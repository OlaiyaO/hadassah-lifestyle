import Link from 'next/link';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';

import { BrandMark } from '@/components/BrandMark';
import { PaymentComplete } from '@/components/PaymentComplete';
import { formatNaira } from '@/data/products';
import { verifyPaystack } from '@/lib/paystack';

export const metadata = { title: 'Payment Status | Hadassah Lifestyle' };
export const dynamic = 'force-dynamic';

export default async function PaymentCallbackPage({ searchParams }) {
  const params = await searchParams;
  const reference = typeof params.reference === 'string' ? params.reference : '';
  let result = { state: 'invalid' };

  if (!process.env.PAYSTACK_SECRET_KEY) {
    result = { state: 'configuration' };
  } else if (reference) {
    try {
      const verification = await verifyPaystack(reference);
      result = verification.verified
        ? {
            state: 'success',
            amountKobo: verification.order.amountKobo,
            itemCount: verification.order.items.reduce((total, item) => total + item.quantity, 0),
          }
        : { state: 'not-complete' };
    } catch (error) {
      if (!['INVALID_REFERENCE', 'PAYSTACK_NOT_CONFIGURED'].includes(error.message)) {
        console.error('Paystack verification failed:', error.message);
      }
    }
  }

  const content = {
    success: {
      icon: CheckCircle2,
      eyebrow: 'Payment verified',
      title: 'Your payment is confirmed.',
      body: `Paystack confirmed ${formatNaira(result.amountKobo)} for ${result.itemCount} ${result.itemCount === 1 ? 'piece' : 'pieces'}. Your order now awaits Hadassah's availability and delivery confirmation; the team will follow up using your submitted details.`,
    },
    'not-complete': {
      icon: Clock3,
      eyebrow: 'Payment not complete',
      title: 'No confirmed payment yet.',
      body: 'Paystack did not return a successful transaction. If you completed payment, contact us with the reference before trying again.',
    },
    configuration: {
      icon: AlertTriangle,
      eyebrow: 'Configuration pending',
      title: 'Verification is not configured.',
      body: 'The Paystack secret key is unavailable, so this transaction cannot be verified on the server.',
    },
    invalid: {
      icon: AlertTriangle,
      eyebrow: 'Unable to verify',
      title: 'We could not confirm this transaction.',
      body: 'The payment reference is missing, invalid or temporarily unavailable. Please confirm with the Hadassah team before making another payment.',
    },
  }[result.state];
  const Icon = content.icon;

  return (
    <main className="payment-page">
      <header className="checkout-header">
        <Link href="/">
          <BrandMark />
        </Link>
      </header>
      <section className="payment-card">
        <Icon className={result.state === 'success' ? 'payment-success' : 'payment-warning'} />
        <p className="eyebrow eyebrow--dark">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>{content.body}</p>
        {reference && <code>Reference: {reference}</code>}
        <Link className="button button--wine" href={result.state === 'success' ? '/' : '/checkout'}>
          {result.state === 'success' ? 'Return home' : 'Return to checkout'} <ArrowRight />
        </Link>
        {result.state === 'success' && <PaymentComplete />}
      </section>
    </main>
  );
}
