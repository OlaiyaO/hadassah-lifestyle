import assert from 'node:assert/strict';
import test from 'node:test';

import { products, validateCartItems } from '../src/data/products.js';

test('calculates totals from catalogue prices', () => {
  const order = validateCartItems([
    { id: products[0].id, quantity: 2 },
    { id: products[3].id, quantity: 1 },
  ]);
  assert.equal(order.amountKobo, products[0].priceKobo * 2 + products[3].priceKobo);
  assert.equal(order.items.length, 2);
});

test('rejects unknown products and invalid quantities', () => {
  assert.throws(() => validateCartItems([{ id: 'unknown', quantity: 1 }]), /invalid/);
  assert.throws(() => validateCartItems([{ id: products[0].id, quantity: 6 }]), /invalid/);
  assert.throws(() => validateCartItems([{ id: products[0].id, quantity: 1.5 }]), /invalid/);
});

test('rejects empty and duplicate cart lines', () => {
  assert.throws(() => validateCartItems([]), /empty or invalid/);
  assert.throws(
    () =>
      validateCartItems([
        { id: products[0].id, quantity: 1 },
        { id: products[0].id, quantity: 1 },
      ]),
    /Duplicate/,
  );
});
