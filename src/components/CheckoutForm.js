'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, LockKeyhole, Minus, Plus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import { formatNaira, MAX_CART_QUANTITY } from '@/data/products';
import { updateCartQuantity, useCart } from '@/lib/cart';

export function CheckoutForm({ products, paystackConfigured }) {
  const cart = useCart();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines = cart.flatMap((item) => {
    const product = productMap.get(item.id);
    return product ? [{ ...item, product }] : [];
  });
  const totalKobo = lines.reduce(
    (total, line) => total + line.product.priceKobo * line.quantity,
    0,
  );

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: Object.fromEntries(formData),
          cart: lines.map(({ id, quantity }) => ({ id, quantity })),
          policyAccepted: formData.has('policyAccepted'),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.authorizationUrl)
        throw new Error(payload.error || 'Payment could not be started.');
      window.location.assign(payload.authorizationUrl);
    } catch (submissionError) {
      setError(submissionError.message);
      setPending(false);
    }
  }

  if (!lines.length) {
    return (
      <section className="empty-cart">
        <p className="eyebrow eyebrow--dark">Nothing to confirm</p>
        <h1>Your bag is empty.</h1>
        <p>Choose a piece from the Hadassah edit, then return here to confirm your order.</p>
        <Link href="/#shop" className="button button--wine">
          <ArrowLeft /> Shop the edit
        </Link>
      </section>
    );
  }

  return (
    <div className="checkout-grid">
      <form onSubmit={handleSubmit} className="checkout-form">
        <p className="eyebrow eyebrow--dark">Delivery details</p>
        <h2>Where should we prepare your order?</h2>
        <div className="checkout-fields">
          <label className="field-wide">
            Full name
            <input name="name" autoComplete="name" minLength="2" maxLength="100" required />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" maxLength="254" required />
          </label>
          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              minLength="7"
              maxLength="20"
              required
            />
          </label>
          <label className="field-wide">
            Delivery address
            <input
              name="address"
              autoComplete="street-address"
              minLength="5"
              maxLength="200"
              required
            />
          </label>
          <label>
            City
            <input
              name="city"
              autoComplete="address-level2"
              defaultValue="Abuja"
              minLength="2"
              maxLength="80"
              required
            />
          </label>
          <label>
            State
            <input
              name="state"
              autoComplete="address-level1"
              defaultValue="FCT"
              minLength="2"
              maxLength="80"
              required
            />
          </label>
        </div>
        <label className="policy-consent">
          <input name="policyAccepted" type="checkbox" required />
          <span>
            I have read and agree to the <Link href="/terms">customer terms</Link>,{' '}
            <Link href="/privacy">privacy notice</Link> and{' '}
            <Link href="/delivery-returns">delivery and returns policy</Link>.
          </span>
        </label>
        {!paystackConfigured && (
          <div className="configuration-notice" role="status">
            <strong>Online payment is not configured.</strong>
            <p>
              Your bag is saved on this device, but payment is disabled until the server has a
              Paystack secret key.
            </p>
          </div>
        )}
        {error && (
          <p className="checkout-error" role="alert">
            {error}
          </p>
        )}
        <div className="checkout-submit">
          <Link href="/#shop">
            <ArrowLeft /> Keep shopping
          </Link>
          <button className="button button--wine" disabled={!paystackConfigured || pending}>
            <LockKeyhole /> {pending ? 'Connecting securely...' : 'Continue to Paystack'}{' '}
            <ArrowRight />
          </button>
        </div>
      </form>

      <aside className="order-summary">
        <p className="eyebrow eyebrow--dark">Order confirmation</p>
        <h2>Your bag</h2>
        <div className="order-lines">
          {lines.map(({ product, quantity }) => (
            <div className="order-line" key={product.id}>
              <Image src={product.image} alt={product.imageAlt} width={82} height={104} />
              <div>
                <h3>{product.name}</h3>
                <p>{product.variantNote}</p>
                <strong>{formatNaira(product.priceKobo * quantity)}</strong>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    disabled={quantity >= MAX_CART_QUANTITY}
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-total">
          <span>Total</span>
          <strong>{formatNaira(totalKobo)}</strong>
        </div>
        <div className="secure-note">
          <ShieldCheck />
          <p>
            The server checks current product prices before Paystack opens. Card details are handled
            securely by Paystack and never stored here.
          </p>
        </div>
      </aside>
    </div>
  );
}
