import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { CheckoutForm } from '@/components/CheckoutForm';
import { products } from '@/data/products';

export const metadata = { title: 'Checkout | Hadassah Lifestyle' };
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link href="/" aria-label="Hadassah Lifestyle home">
          <BrandMark />
        </Link>
        <span>Secure order confirmation</span>
      </header>
      <section className="checkout-hero">
        <p className="eyebrow">Your order</p>
        <h1>Confirm every detail.</h1>
        <p>Review your pieces, delivery information and total before continuing to Paystack.</p>
      </section>
      <CheckoutForm
        products={products}
        paystackConfigured={Boolean(process.env.PAYSTACK_SECRET_KEY)}
      />
    </main>
  );
}
