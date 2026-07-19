import 'server-only';

import { catalogVersion, MAX_CART_QUANTITY, validateCartItems } from '@/data/products';

const paystackBaseUrl = 'https://api.paystack.co';
export const POLICY_VERSION = '2026-07-draft';

export function validateCustomer(input) {
  const customer = {
    name: typeof input?.name === 'string' ? input.name.trim() : '',
    email: typeof input?.email === 'string' ? input.email.trim().toLowerCase() : '',
    phone: typeof input?.phone === 'string' ? input.phone.trim() : '',
    address: typeof input?.address === 'string' ? input.address.trim() : '',
    city: typeof input?.city === 'string' ? input.city.trim() : '',
    state: typeof input?.state === 'string' ? input.state.trim() : '',
  };
  const validLength = (value, min, max) => value.length >= min && value.length <= max;

  if (
    !validLength(customer.name, 2, 100) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    customer.email.length > 254 ||
    !/^\+?[0-9 ()-]{7,20}$/.test(customer.phone) ||
    !validLength(customer.address, 5, 200) ||
    !validLength(customer.city, 2, 80) ||
    !validLength(customer.state, 2, 80)
  ) {
    throw new Error('Please provide valid customer and delivery details.');
  }
  return customer;
}

function validatePaidOrder(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > 500) {
    throw new Error('INVALID_ORDER_METADATA');
  }
  const seen = new Set();
  const items = input.map((item) => {
    if (
      !item ||
      typeof item.id !== 'string' ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) ||
      seen.has(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > MAX_CART_QUANTITY ||
      !Number.isSafeInteger(item.unit_price_kobo) ||
      item.unit_price_kobo <= 0
    ) {
      throw new Error('INVALID_ORDER_METADATA');
    }
    seen.add(item.id);
    const lineTotalKobo = item.unit_price_kobo * item.quantity;
    if (!Number.isSafeInteger(lineTotalKobo)) throw new Error('INVALID_ORDER_METADATA');
    return { id: item.id, quantity: item.quantity, lineTotalKobo };
  });
  const amountKobo = items.reduce((total, item) => total + item.lineTotalKobo, 0);
  if (!Number.isSafeInteger(amountKobo)) throw new Error('INVALID_ORDER_METADATA');
  return { items, amountKobo };
}

async function paystackRequest(path, options = {}) {
  if (!process.env.PAYSTACK_SECRET_KEY) throw new Error('PAYSTACK_NOT_CONFIGURED');
  const response = await fetch(`${paystackBaseUrl}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(10000),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.status) {
    throw new Error(payload?.message || 'Paystack could not process this request.');
  }
  return payload.data;
}

export async function initializePaystack({ customer, cart, reference, callbackUrl }) {
  const order = validateCartItems(cart);
  const data = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email: customer.email,
      amount: order.amountKobo,
      currency: 'NGN',
      reference,
      callback_url: callbackUrl,
      metadata: {
        customer,
        catalog_version: catalogVersion,
        policy_version: POLICY_VERSION,
        order_items: order.items.map(({ product, quantity }) => ({
          id: product.id,
          quantity,
          unit_price_kobo: product.priceKobo,
        })),
      },
    }),
  });
  const authorizationUrl = new URL(data.authorization_url);
  if (
    authorizationUrl.protocol !== 'https:' ||
    !(
      authorizationUrl.hostname === 'paystack.com' ||
      authorizationUrl.hostname.endsWith('.paystack.com')
    )
  ) {
    throw new Error('Paystack returned an invalid checkout URL.');
  }
  return { authorizationUrl: authorizationUrl.toString(), reference: data.reference };
}

export async function verifyPaystack(reference) {
  if (!/^HADAS-[0-9a-f-]{36}$/.test(reference)) throw new Error('INVALID_REFERENCE');
  const data = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`);
  const order = validatePaidOrder(data.metadata?.order_items);
  return {
    verified:
      data.reference === reference &&
      data.status === 'success' &&
      data.currency === 'NGN' &&
      data.amount === order.amountKobo,
    order,
  };
}
