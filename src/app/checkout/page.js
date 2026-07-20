import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { CheckoutForm } from '@/components/CheckoutForm';
import { products } from '@/data/products';

export const metadata = { title: 'Checkout | Hadassah Lifestyle' };
export default function CheckoutPage() {
  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link href="/" aria-label="Hadassah Lifestyle home">
          <BrandMark />
        </Link>
        <span>Order confirmation / no charge yet</span>
      </header>
      <section className="checkout-hero">
        <p className="eyebrow">Your order</p>
        <h1>Confirm every detail.</h1>
        <p>
          Review your pieces, add delivery details, then open the prepared order in WhatsApp. You
          will still need to press Send there. No payment is collected on this page.
        </p>
      </section>
      <CheckoutForm products={products} />
    </main>
  );
}
