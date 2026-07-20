'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CreditCard,
  Headphones,
  Home,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { BrandMark } from '@/components/BrandMark';
import { ChatReviewCard } from '@/components/ChatReviewCard';
import { EditorialConcepts } from '@/components/EditorialConcepts';
import { products, formatNaira, MAX_CART_QUANTITY } from '@/data/products';
import { business, whatsappHref } from '@/data/business';
import { addToCart, useCart } from '@/lib/cart';

const reviews = [
  {
    name: 'Amara K.',
    initial: 'A',
    prompt: 'How did the shirts work out for you?',
    promptTime: '10:21',
    message:
      'Those shirts were excellent. The fit and finishing were even better than I expected. Everyone kept asking where I got them.',
    time: '10:24',
  },
  {
    name: 'Zainab M.',
    initial: 'Z',
    prompt: 'Did the bag suit what you needed?',
    promptTime: '14:08',
    message:
      'Perfectly. It looks polished but still holds everything I carry every day. You understood exactly what I meant.',
    time: '14:11',
  },
  {
    name: 'Chidinma O.',
    initial: 'C',
    prompt: 'How are you finding the kitchen set?',
    promptTime: '18:42',
    message:
      'Honestly, it made serving at home feel special again. Beautiful enough for guests and practical enough for every day.',
    time: '18:47',
  },
];

const marqueeItems = ['Clothing', 'Shoes', 'Bags', 'Kitchen', 'Beautiful things for real life'];
const kitchenProduct = products.find((product) => product.category.toLowerCase() === 'kitchen');
const verifiedCustomerCount = process.env.NEXT_PUBLIC_VERIFIED_CUSTOMER_COUNT;
const emailConfigured = !business.primaryEmail.startsWith('[');

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2a9.8 9.8 0 0 0-8.5 14.7L2 22l5.4-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3.2.8.9-3.1-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.8-1.8-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.6 7.6 0 0 1-1.4-1.8c-.1-.2 0-.4.1-.5l.4-.5.2-.4c.1-.1.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.6-.4Z" />
    </svg>
  );
}

function MarqueeGroup() {
  return (
    <div className="marquee__group" aria-hidden="true">
      {marqueeItems.map((item) => (
        <span key={item}>
          {item} <Sparkles />
        </span>
      ))}
    </div>
  );
}

export function LandingPage() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const bagCount = cart.reduce((total, item) => total + item.quantity, 0);
  const bagTotal = cart.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.id);
    return total + (product?.priceKobo ?? 0) * item.quantity;
  }, 0);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.body.classList.add('menu-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  function addProduct(product) {
    addToCart(product.id);
  }

  async function submitContact(event) {
    event.preventDefault();
    setSubmitting(true);
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      setNotice(result.ok ? 'Your message is with the Hadassah team.' : result.error);
      if (result.ok) form.reset();
    } catch {
      setNotice('We could not send that message. Please use WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="announcement">
        <p>Abuja delivery · Personal shopping help on WhatsApp</p>
      </div>

      <header className="site-header">
        <a href="#top" className="logo-link" aria-label="Hadassah Lifestyle home">
          <BrandMark className="brand-mark--nav" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#kitchen-campaign">Kitchen</a>
          <a href="#contact">Concierge</a>
        </nav>
        <div className="header-actions">
          <Link
            href="/checkout"
            aria-label={`Shopping bag with ${bagCount} items`}
            className="bag-button"
          >
            <ShoppingBag size={20} />
            <span>{bagCount}</span>
          </Link>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu" autoFocus>
            <X size={26} />
          </button>
          <BrandMark light />
          {[
            ['Shop', '#shop'],
            ['Categories', '#categories'],
            ['Kitchen', '#kitchen-campaign'],
            ['Concierge', '#contact'],
          ].map(([item, href]) => (
            <a key={item} href={href} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <Link href="/checkout">Bag ({bagCount})</Link>
        </div>
      )}

      <section className="hero" id="top">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="hero__media"
        >
          <source src="/video/hadassah-film.mp4" type="video/mp4" />
        </video>
        <div className="hero__veil" />
        <div className="hero__copy">
          <p className="eyebrow">
            <span /> Curated in Abuja, for real life
          </p>
          <h1>
            <span>Dress well.</span>
            <em>Live beautifully.</em>
          </h1>
          <p className="hero__body">
            Considered fashion and home pieces for Nigerian women who want everyday life to feel
            special.
          </p>
          <div className="hero__actions">
            <a className="button button--gold" href="#shop">
              Shop the edit <ArrowRight size={17} />
            </a>
            <a className="text-link" href="#contact">
              Ask our personal shopper
            </a>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee__track">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>

      <section className="intro section" id="story">
        <p className="section-number">Made for your day</p>
        <div>
          <p className="eyebrow eyebrow--dark">Abuja style, thoughtfully chosen</p>
          <h2>
            Pieces that feel right at home in <em>your life.</em>
          </h2>
          <p className="intro__body">
            From a sharp blouse for the working week to serving pieces for Sunday lunch, Hadassah
            brings fashion and home finds together in one warm, personal edit.
          </p>
        </div>
      </section>

      <section
        className="services section confidence-strip"
        id="shopping-confidence"
        aria-label="Shopping confidence"
      >
        {verifiedCustomerCount && (
          <div className="confidence-strip__stat">
            <strong>{verifiedCustomerCount}+</strong>
            <h3>Happy customers</h3>
            <p>Owner-verified Hadassah customer count.</p>
          </div>
        )}
        {[
          [MapPin, 'Abuja delivery', 'Delivery details are confirmed clearly with your order.'],
          [
            Headphones,
            'Personal WhatsApp shopper',
            'Speak to a real person when you need help choosing.',
          ],
          [
            CreditCard,
            'Payment after confirmation',
            'Your concierge shares the next payment step only after confirming your order.',
          ],
          [
            PackageCheck,
            'Order confirmation first',
            'We confirm availability, variants and delivery before payment.',
          ],
        ].map(([Icon, title, copy]) => (
          <div key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </section>

      <section className="products section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Featured collection</p>
            <h2>
              The Hadassah <em>edit.</em>
            </h2>
          </div>
          <p className="section-heading__note">
            Add your favourites, then let our concierge confirm availability, variants and delivery.
          </p>
        </div>
        <nav className="shop-index" id="categories" aria-label="Product categories">
          <span>Browse the edit</span>
          {products.map((product) => (
            <a key={product.id} href={`#${product.id}`}>
              {product.category}
            </a>
          ))}
          <Link href="/checkout">Bag ({bagCount})</Link>
        </nav>
        <div className="product-grid">
          {products.map((product) => {
            const quantity = cart.find((item) => item.id === product.id)?.quantity ?? 0;
            return (
              <article className="product-card" id={product.id} key={product.id}>
                <div className="product-card__image">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(min-width: 900px) 42vw, 100vw"
                  />
                  <span className="product-card__category">{product.category}</span>
                </div>
                <div className="product-card__body">
                  <div className="product-card__heading">
                    <div>
                      <p className="product-card__unit">{product.unit}</p>
                      <h3>{product.name}</h3>
                    </div>
                    <strong>{formatNaira(product.priceKobo)}</strong>
                  </div>
                  <p className="product-card__description">{product.description}</p>
                  <p className="product-card__variant">{product.variantNote}</p>
                  <button
                    className="product-card__add"
                    onClick={() => addProduct(product)}
                    disabled={quantity >= MAX_CART_QUANTITY}
                  >
                    <span>
                      {quantity >= MAX_CART_QUANTITY
                        ? `Maximum in bag · ${quantity}`
                        : quantity
                          ? `Add another · ${quantity} in bag`
                          : 'Add to bag'}
                    </span>
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <EditorialConcepts />

      <section className="campaign" id="kitchen-campaign">
        <Image
          src="/images/category-kitchen.jpg"
          alt="Bright kitchen with colourful cookware and fresh produce"
          fill
          sizes="100vw"
        />
        <div className="campaign__veil" />
        <div className="campaign__copy">
          <p className="eyebrow">The home table</p>
          <h2>
            <span>Made to serve.</span>
            <em>Styled to stay.</em>
          </h2>
          <p>Useful kitchen pieces with enough character for everyday meals and a full house.</p>
          <a
            href={kitchenProduct ? `#${kitchenProduct.id}` : '#shop'}
            className="button button--cream"
          >
            View kitchen piece <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section className="testimonial section" aria-labelledby="customer-reviews-title">
        <div>
          <div className="testimonial__heading">
            <div>
              <p className="eyebrow eyebrow--dark">Customer reviews</p>
              <h2 id="customer-reviews-title">
                Loved for the <em>little details.</em>
              </h2>
            </div>
            <p>
              Thoughtful pieces, personal service and a shopping experience designed to feel easy.
            </p>
          </div>
          <div className="testimonial__grid">
            {reviews.map((review) => (
              <ChatReviewCard key={review.name} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="concierge section" id="contact">
        <div className="concierge__intro">
          <p className="eyebrow">Personal shopping concierge</p>
          <h2>
            Tell us what <em>you need.</em>
          </h2>
          <p className="concierge-copy">
            Shopping for an event, a gift or your home? Start with WhatsApp for the quickest help,
            or leave a considered brief for our team.
          </p>
          <a className="concierge-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
            <span className="concierge-whatsapp__icon">
              <MessageCircle />
            </span>
            <span>
              <small>Fastest response</small>
              Chat with your personal shopper
            </span>
            <ArrowRight />
          </a>
          <ul className="concierge__promises">
            <li>
              <Check /> Help choosing the right piece
            </li>
            <li>
              <Check /> Availability and variant confirmation
            </li>
            <li>
              <Check /> Clear Abuja delivery guidance
            </li>
          </ul>
        </div>
        <div className="concierge__form-panel">
          <div className="concierge__form-heading">
            <span>Prefer a detailed request?</span>
            <p>Tell us enough to make the first reply useful.</p>
          </div>
          <form onSubmit={submitContact} className="contact-form">
            <div className="contact-form__row">
              <label>
                <span>Your name</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="How should we address you?"
                  required
                />
              </label>
              <label>
                <span>Phone / WhatsApp</span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0800 000 0000"
                  required
                />
              </label>
            </div>
            <div className="contact-form__row">
              <label>
                <span>Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                <span>What are you shopping for?</span>
                <select name="requestType" defaultValue="" required>
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Clothing or occasion wear</option>
                  <option>Shoes or bags</option>
                  <option>Kitchen or home pieces</option>
                  <option>A gift</option>
                  <option>Something else</option>
                </select>
              </label>
            </div>
            <label>
              <span>Tell us what you have in mind</span>
              <textarea
                name="message"
                rows="5"
                placeholder="Include the occasion, preferred style, budget or deadline where useful."
                required
              />
            </label>
            <button type="submit" className="button button--wine" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send your request'} <ArrowRight size={16} />
            </button>
            <small className="contact-form__note">
              No payment is requested through this form. We will confirm the next step with you.
            </small>
          </form>
        </div>
      </section>

      <footer>
        <div className="footer__lead">
          <BrandMark light dimensional className="brand-mark--footer" />
          <h2>
            Beautifully chosen.
            <br />
            <em>Effortlessly yours.</em>
          </h2>
        </div>
        <div className="footer__links">
          <div>
            <strong>Shop</strong>
            <a href="#shop">Featured pieces</a>
            <a href="#categories">Categories</a>
            <a href="#kitchen-campaign">Kitchen</a>
          </div>
          <div>
            <strong>Connect</strong>
            <a
              className="footer__contact-link"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={16} />
              WhatsApp concierge
            </a>
            <a
              className="footer__contact-link"
              href={business.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} />
              Instagram
            </a>
            {emailConfigured && (
              <a className="footer__contact-link" href={`mailto:${business.primaryEmail}`}>
                <Mail size={16} />
                Email us
              </a>
            )}
          </div>
          <div>
            <strong>Your order</strong>
            <Link href="/checkout">Review your bag</Link>
            <Link href="/delivery-returns">Delivery &amp; returns</Link>
          </div>
          <div>
            <strong>Policies</strong>
            <Link href="/privacy">Privacy notice</Link>
            <Link href="/terms">Customer terms</Link>
            <Link href="/delivery-returns">Delivery &amp; returns</Link>
          </div>
        </div>
        <div className="footer__bottom">
          <span>Copyright 2026 Hadassah Lifestyle</span>
          <span>Abuja, Nigeria</span>
        </div>
      </footer>

      {bagCount > 0 && (
        <aside className="bag-tray" aria-label="Shopping bag summary">
          <div>
            <span>{bagCount === 1 ? '1 piece in your bag' : `${bagCount} pieces in your bag`}</span>
            <strong>{formatNaira(bagTotal)}</strong>
          </div>
          <Link href="/checkout">
            Review bag <ArrowRight />
          </Link>
        </aside>
      )}

      <a
        className={`whatsapp${bagCount ? ' whatsapp--with-bag' : ''}`}
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Hadassah on WhatsApp"
      >
        <MessageCircle size={24} />
        <span>Personal shopper</span>
      </a>
      <nav className="mobile-tabbar" aria-label="Mobile shortcuts">
        <a href="#top">
          <Home />
          <span>Home</span>
        </a>
        <a href="#shop">
          <Store />
          <span>Shop</span>
        </a>
        <Link href="/checkout">
          <ShoppingBag />
          <span>Bag ({bagCount})</span>
        </Link>
        <a href="#contact">
          <MessageCircle />
          <span>Contact</span>
        </a>
      </nav>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}
