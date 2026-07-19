import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createSnapshot, MAX_CSV_BYTES, parseProductsCsv } from './product-csv.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const localCsvPath = path.join(projectRoot, 'catalog/products.csv');
const snapshotPath = path.join(projectRoot, 'src/data/products.snapshot.json');

async function readRemoteCsv(url) {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:') throw new Error('PRODUCTS_CSV_URL must use HTTPS.');
  const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Catalogue download failed with HTTP ${response.status}.`);
  if (new URL(response.url).protocol !== 'https:')
    throw new Error('Catalogue redirect must remain on HTTPS.');
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_CSV_BYTES) throw new Error('Remote catalogue exceeds 1 MB.');
  if (!response.body) throw new Error('Remote catalogue response was empty.');

  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.byteLength;
    if (size > MAX_CSV_BYTES) throw new Error('Remote catalogue exceeds 1 MB.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function syncProducts({
  check = false,
  sourceUrl = process.env.PRODUCTS_CSV_URL,
} = {}) {
  const csv = sourceUrl
    ? await readRemoteCsv(sourceUrl)
    : await readFile(localCsvPath, { encoding: 'utf8', signal: AbortSignal.timeout(5000) });
  const products = await parseProductsCsv(csv, { publicDir: path.join(projectRoot, 'public') });
  const snapshot = createSnapshot(csv, products);

  if (!check) {
    const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
    try {
      await writeFile(temporaryPath, `${JSON.stringify(snapshot, null, 2)}\n`, { flag: 'wx' });
      await rename(temporaryPath, snapshotPath);
    } finally {
      await rm(temporaryPath, { force: true });
    }
  }
  return snapshot;
}

const check = process.argv.includes('--check');
syncProducts({ check })
  .then((snapshot) => {
    console.log(
      `${check ? 'Validated' : 'Synced'} ${snapshot.products.length} active products (${snapshot.catalogVersion.slice(0, 12)}).`,
    );
  })
  .catch((error) => {
    console.error(`Product catalogue rejected: ${error.message}`);
    process.exitCode = 1;
  });
