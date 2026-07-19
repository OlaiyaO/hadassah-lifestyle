import { randomUUID } from 'node:crypto';

import { initializePaystack, validateCustomer } from '@/lib/paystack';

function callbackBaseUrl(request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = configuredUrl ? new URL(configuredUrl) : request.nextUrl;
  const localHostname = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (
    (!configuredUrl && process.env.NODE_ENV === 'production' && !localHostname) ||
    (!localHostname && url.protocol !== 'https:')
  ) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be configured with an HTTPS URL in production.');
  }
  return url;
}

export async function POST(request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return Response.json({ error: 'Online checkout is not configured yet.' }, { status: 503 });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return Response.json({ error: 'A JSON request is required.' }, { status: 415 });
  }
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 20000 || request.headers.get('sec-fetch-site') === 'cross-site') {
    return Response.json({ error: 'Invalid checkout request.' }, { status: 400 });
  }

  try {
    const payload = await request.json();
    if (payload.policyAccepted !== true) {
      return Response.json(
        { error: 'You must accept the customer policies to continue.' },
        { status: 400 },
      );
    }
    const customer = validateCustomer(payload.customer);
    const result = await initializePaystack({
      customer,
      cart: payload.cart,
      reference: `HADAS-${randomUUID()}`,
      callbackUrl: new URL('/payment/callback', callbackBaseUrl(request)).toString(),
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: 'Invalid checkout request.' }, { status: 400 });
    }
    const clientErrors = [
      'Your cart is empty or invalid.',
      'One or more cart items are invalid.',
      'Duplicate cart items are not allowed.',
      'Please provide valid customer and delivery details.',
    ];
    const isClientError = clientErrors.includes(error.message);
    if (!isClientError) console.error('Paystack initialization failed:', error.message);
    return Response.json(
      {
        error: isClientError
          ? error.message
          : 'Secure checkout is temporarily unavailable. Please try again.',
      },
      { status: isClientError ? 400 : 502 },
    );
  }
}
