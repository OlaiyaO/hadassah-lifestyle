import { createHash } from 'node:crypto';
import { stat } from 'node:fs/promises';
import path from 'node:path';

import { parse } from 'csv-parse/sync';

export const MAX_CSV_BYTES = 1024 * 1024;
export const MAX_PRODUCT_ROWS = 500;
export const PRODUCT_HEADERS = [
  'id',
  'sku',
  'category',
  'name',
  'price_ngn',
  'unit',
  'image_path',
  'image_alt',
  'description',
  'variant_note',
  'active',
  'sort_order',
];

function requiredText(row, field, min, max) {
  const value = row[field]?.trim() || '';
  if (value.length < min || value.length > max) {
    throw new Error(`${field} must contain ${min}-${max} characters.`);
  }
  return value;
}

function ngnToKobo(value) {
  const match = /^(0|[1-9]\d{0,9})(?:\.(\d{1,2}))?$/.exec(value);
  if (!match)
    throw new Error('price_ngn must be a positive decimal with at most two decimal places.');
  const kobo = BigInt(match[1]) * 100n + BigInt((match[2] || '').padEnd(2, '0') || '0');
  if (kobo <= 0n || kobo > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('price_ngn is outside the supported range.');
  }
  return Number(kobo);
}

async function validateImage(imagePath, publicDir) {
  if (
    !/^\/[A-Za-z0-9._/-]+\.(?:avif|jpe?g|png|webp)$/i.test(imagePath) ||
    imagePath.includes('..') ||
    imagePath.includes('//')
  ) {
    throw new Error('image_path must be a safe local image path with a supported extension.');
  }
  const publicRoot = path.resolve(publicDir);
  const filePath = path.resolve(publicRoot, `.${imagePath}`);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`))
    throw new Error('image_path leaves public/.');
  const imageStat = await stat(filePath).catch(() => null);
  if (!imageStat?.isFile()) throw new Error(`Image does not exist in public/: ${imagePath}`);
}

export async function parseProductsCsv(csv, { publicDir }) {
  const bytes = Buffer.byteLength(csv);
  if (bytes === 0 || bytes > MAX_CSV_BYTES)
    throw new Error('Catalogue CSV must be 1 MB or smaller.');

  const records = parse(csv, { bom: true, skip_empty_lines: true, trim: false });
  const headers = records.shift();
  if (
    !headers ||
    headers.length !== PRODUCT_HEADERS.length ||
    headers.some((header, index) => header !== PRODUCT_HEADERS[index])
  ) {
    throw new Error(`CSV headers must exactly match: ${PRODUCT_HEADERS.join(',')}`);
  }
  if (records.length > MAX_PRODUCT_ROWS)
    throw new Error(`Catalogue cannot exceed ${MAX_PRODUCT_ROWS} rows.`);

  const ids = new Set();
  const skus = new Set();
  const sortOrders = new Set();
  const products = [];

  for (let index = 0; index < records.length; index += 1) {
    const values = records[index];
    const rowNumber = index + 2;
    if (values.length !== PRODUCT_HEADERS.length)
      throw new Error(`Row ${rowNumber} has the wrong number of columns.`);
    const row = Object.fromEntries(
      PRODUCT_HEADERS.map((header, fieldIndex) => [header, values[fieldIndex]]),
    );

    try {
      const id = requiredText(row, 'id', 3, 80);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
        throw new Error('id must be an immutable-style lowercase slug.');
      }
      if (ids.has(id)) throw new Error(`Duplicate id: ${id}`);
      ids.add(id);

      const sku = requiredText(row, 'sku', 1, 64);
      if (skus.has(sku)) throw new Error(`Duplicate sku: ${sku}`);
      skus.add(sku);

      const activeText = row.active?.trim();
      if (activeText !== 'TRUE' && activeText !== 'FALSE')
        throw new Error('active must be TRUE or FALSE.');
      const sortText = row.sort_order?.trim();
      if (!/^(?:0|[1-9]\d{0,3})$/.test(sortText)) {
        throw new Error('sort_order must be an integer from 0 to 9999.');
      }
      const sortOrder = Number(sortText);
      if (sortOrders.has(sortOrder)) throw new Error(`Duplicate sort_order: ${sortOrder}`);
      sortOrders.add(sortOrder);

      const image = requiredText(row, 'image_path', 5, 200);
      await validateImage(image, publicDir);
      products.push({
        id,
        sku,
        category: requiredText(row, 'category', 2, 60),
        name: requiredText(row, 'name', 2, 120),
        priceKobo: ngnToKobo(row.price_ngn?.trim() || ''),
        unit: requiredText(row, 'unit', 1, 30),
        image,
        imageAlt: requiredText(row, 'image_alt', 5, 180),
        description: requiredText(row, 'description', 10, 500),
        variantNote: requiredText(row, 'variant_note', 5, 300),
        active: activeText === 'TRUE',
        sortOrder,
      });
    } catch (error) {
      throw new Error(`Row ${rowNumber}: ${error.message}`);
    }
  }

  return products;
}

export function createSnapshot(csv, products) {
  return {
    schemaVersion: 1,
    catalogVersion: createHash('sha256').update(csv).digest('hex'),
    products: products
      .filter((product) => product.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ active, sortOrder, ...product }) => product),
  };
}
