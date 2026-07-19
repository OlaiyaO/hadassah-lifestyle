'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Headphones,
  Home,
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
import { products, formatNaira } from '@/data/products';
import { business, whatsappHref } from '@/data/business';
import { addToCart, useCart } from '@/lib/cart';

const categories = [
  {
    name: 'Clothing',
    kicker: 'The wardrobe edit',
    image: '/images/category-clothing.jpg',
    alt: 'Elegant Black woman in a refined African print blouse',
  },
  {
    name: 'Shoes',
    kicker: 'Finish every look',
    image: '/images/category-shoes.jpg',
    alt: 'A considered edit of women’s shoes',
  },
  {
    name: 'Bags',
    kicker: 'Carry it beautifully',
    image: '/images/category-bags.jpg',
    alt: 'Structured bags selected by Hadassah Lifestyle',
  },
  {
    name: 'Kitchen',
    kicker: 'For the heart of home',
    image: '/images/category-kitchen.jpg',
    alt: 'Bright kitchen arranged with colourful cookware and fresh produce',
  },
];

const marqueeItems = ['Clothing', 'Shoes', 'Bags', 'Kitchen', 'Beautiful things for real life'];

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
    setNotice(`${product.name} added to your bag.`);
    window.setTimeout(() => setNotice(''), 2200);
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
          <BrandMark />
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

      <section className="category-section section" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow--dark">Shop your way</p>
            <h2>
              Four beautiful <em>edits.</em>
            </h2>
          </div>
        </div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <a
              className="category-card"
              href={`#${category.name.toLowerCase()}`}
              key={category.name}
            >
              <Image
                src={category.image}
                alt={category.alt}
                fill
                sizes="(min-width: 900px) 25vw, 85vw"
              />
              <div className="category-card__shade" />
              <span className="category-card__number">0{index + 1}</span>
              <div>
                <p>{category.kicker}</p>
                <h3>{category.name}</h3>
              </div>
              <span className="circle-arrow">
                <ArrowUpRight size={20} />
              </span>
            </a>
          ))}
        </div>
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
            Add your favourites, then confirm every detail before payment.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" id={product.category.toLowerCase()} key={product.id}>
              <div className="product-card__image">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(min-width: 900px) 25vw, 78vw"
                />
                <button className="quick-add" onClick={() => addProduct(product)}>
                  Add to bag <ShoppingBag size={16} />
                </button>
              </div>
              <p>{product.category}</p>
              <h3>{product.name}</h3>
              <p className="product-card__description">{product.description}</p>
              <small>{product.variantNote}</small>
              <strong>{formatNaira(product.priceKobo)}</strong>
            </article>
          ))}
        </div>
      </section>

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
          <a href="#kitchen" className="button button--cream">
            Shop kitchen <ArrowRight size={17} />
          </a>
        </div>
      </section>

      <section className="services section" aria-label="Shopping confidence">
        {[
          [MapPin, 'Abuja delivery', 'Delivery details are confirmed clearly with your order.'],
          [
            Headphones,
            'Personal WhatsApp shopper',
            'Speak to a real person when you need help choosing.',
          ],
          [
            CreditCard,
            'Secure Paystack checkout',
            'Your payment details stay with Paystack, not this website.',
          ],
          [
            PackageCheck,
            'Clear order confirmation',
            'Review products, quantities and total before payment.',
          ],
        ].map(([Icon, title, copy]) => (
          <div key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </section>

      <section className="testimonial section">
        <p className="quote-mark">“</p>
        <blockquote>
          Like shopping with the friend who knows your taste and helps you choose <em>well.</em>
        </blockquote>
        <p>The Hadassah promise</p>
      </section>

      <section className="newsletter section" id="contact">
        <div>
          <p className="eyebrow">Personal shopping concierge</p>
          <h2>
            Tell us what <em>you need.</em>
          </h2>
          <p className="concierge-copy">
            Shopping for an event, a gift or your home? Send us a note, or chat directly on
            WhatsApp.
          </p>
          <a className="concierge-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle /> Chat on WhatsApp
          </a>
        </div>
        <form onSubmit={submitContact} className="contact-form">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" type="text" required />
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" required />
          <label htmlFor="message">How can we help?</label>
          <textarea id="message" name="message" rows="4" required />
          <button className="button button--wine" disabled={submitting}>
            {submitting ? 'Sending...' : 'Send your request'} <ArrowRight size={16} />
          </button>
        </form>
      </section>

      <footer>
        <div className="footer__lead">
          <BrandMark light />
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
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp concierge
            </a>
            <a href={`mailto:${business.primaryEmail}`}>Email us</a>
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

      <a
        className="whatsapp"
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
