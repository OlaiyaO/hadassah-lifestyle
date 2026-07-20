'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
} from 'lucide-react';

import { formatNaira, MAX_CART_QUANTITY } from '@/data/products';
import { business } from '@/data/business';
import { updateCartQuantity, useCart } from '@/lib/cart';

export function CheckoutForm({ products }) {
  const cart = useCart();
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines = cart.flatMap((item) => {
    const product = productMap.get(item.id);
    return product ? [{ ...item, product }] : [];
  });
  const totalKobo = lines.reduce(
    (total, line) => total + line.product.priceKobo * line.quantity,
    0,
  );

  function handleSubmit(event) {
    event.preventDefault();
    const customer = Object.fromEntries(new FormData(event.currentTarget));
    const orderRequestHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
      `Hello Hadassah Lifestyle, please help me confirm this order before payment:\n\nCustomer\n- Name: ${customer.name}\n- Email: ${customer.email}\n- Phone: ${customer.phone}\n- Delivery address: ${customer.address}, ${customer.city}, ${customer.state}\n\nOrder\n${lines
        .map(({ product, quantity }) => `- ${product.name} x ${quantity}`)
        .join(
          '\n',
        )}\nItems total: ${formatNaira(totalKobo)}\n\nPlease confirm the variants, availability and delivery fee. I understand that no online payment has been made.`,
    )}`;

    window.open(orderRequestHref, '_blank', 'noopener,noreferrer');
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
    <div className="checkout-grid checkout-grid--concierge">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <p className="eyebrow eyebrow--dark">Personal shopping concierge</p>
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
          <input type="checkbox" name="policyAccepted" required />
          <span>
            I have read and accept the <Link href="/terms">customer terms</Link>,{' '}
            <Link href="/privacy">privacy notice</Link> and{' '}
            <Link href="/delivery-returns">delivery and returns policy</Link>.
          </span>
        </label>
        <div className="configuration-notice" role="status">
          <div className="configuration-notice__heading">
            <CreditCard aria-hidden="true" />
            <strong>Paystack payment is not ready yet.</strong>
          </div>
          <p>
            You cannot send money through this website because the Paystack integration is not yet
            ready. You will not be charged. We will prepare a WhatsApp message with your details;
            review it and press Send there so we can confirm variants, availability and delivery.
          </p>
        </div>
        <div className="checkout-submit">
          <Link href="/#shop">
            <ArrowLeft /> Keep shopping
          </Link>
          <button className="button button--wine" type="submit">
            <MessageCircle /> Open order in WhatsApp <ArrowRight />
          </button>
        </div>
      </form>

      <aside className="order-summary">
        <p className="eyebrow eyebrow--dark">Order confirmation</p>
        <h2>Your bag</h2>
        <p className="order-summary__intro">
          Adjust quantities here before adding delivery details.
        </p>
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
            Your bag stays on this device. No money is collected here while Paystack remains
            unavailable.
          </p>
        </div>
      </aside>
    </div>
  );
}
