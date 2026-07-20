import assert from 'node:assert/strict';
import test from 'node:test';

import { POST } from '../src/app/api/payments/paystack/initialize/route.js';

test('keeps online payment initialization disabled', async () => {
  const response = await POST();

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error:
      'Online payment is unavailable because the Paystack integration is not yet ready. No money has been collected; please confirm your order on WhatsApp.',
  });
});
