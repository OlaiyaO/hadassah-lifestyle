import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { createSnapshot, parseProductsCsv, PRODUCT_HEADERS } from '../scripts/product-csv.mjs';

const validRow = [
  'test-product',
  'SKU-1',
  'Bags',
  'Test Product',
  '1234.50',
  'piece',
  '/images/test.jpg',
  'A useful test image',
  'A sufficiently detailed product description.',
  'Details are confirmed with your order.',
  'TRUE',
  '10',
];

async function fixture() {
  const publicDir = await mkdtemp(path.join(os.tmpdir(), 'hadassah-products-'));
  await mkdir(path.join(publicDir, 'images'));
  await writeFile(path.join(publicDir, 'images/test.jpg'), 'image');
  return publicDir;
}

function csv(rows, headers = PRODUCT_HEADERS) {
  return `${headers.join(',')}\n${rows.map((row) => row.join(',')).join('\n')}\n`;
}

test('parses valid products and converts decimal naira without floating point maths', async () => {
  const products = await parseProductsCsv(csv([validRow]), { publicDir: await fixture() });
  assert.equal(products[0].priceKobo, 123450);
  assert.equal(createSnapshot(csv([validRow]), products).products.length, 1);
});

test('rejects invalid headers, duplicate identifiers, unsafe images and invalid booleans', async () => {
  const publicDir = await fixture();
  await assert.rejects(
    parseProductsCsv(csv([validRow], [...PRODUCT_HEADERS].reverse()), { publicDir }),
    /headers/,
  );
  await assert.rejects(parseProductsCsv(csv([validRow, validRow]), { publicDir }), /Duplicate id/);
  const unsafe = [...validRow];
  unsafe[6] = 'https://example.com/image.jpg';
  await assert.rejects(parseProductsCsv(csv([unsafe]), { publicDir }), /safe local image/);
  const invalidActive = [...validRow];
  invalidActive[10] = 'yes';
  await assert.rejects(parseProductsCsv(csv([invalidActive]), { publicDir }), /TRUE or FALSE/);
});

test('inactive and deleted rows are absent from the next generated snapshot', async () => {
  const publicDir = await fixture();
  const second = [...validRow];
  second[0] = 'second-product';
  second[1] = 'SKU-2';
  second[10] = 'FALSE';
  second[11] = '20';
  const initialCsv = csv([validRow, second]);
  const initial = createSnapshot(initialCsv, await parseProductsCsv(initialCsv, { publicDir }));
  assert.deepEqual(
    initial.products.map(({ id }) => id),
    ['test-product'],
  );

  const deletedCsv = csv([second]);
  const next = createSnapshot(deletedCsv, await parseProductsCsv(deletedCsv, { publicDir }));
  assert.deepEqual(next.products, []);
});
