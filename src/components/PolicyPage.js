import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { business } from '@/data/business';

export function PolicyPage({ eyebrow, title, introduction, children }) {
  return (
    <main className="policy-page">
      <header className="checkout-header">
        <Link href="/" aria-label="Hadassah Lifestyle home">
          <BrandMark />
        </Link>
        <span>Customer information</span>
      </header>
      <section className="policy-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{introduction}</p>
      </section>
      <div className="policy-layout">
        <aside>
          <strong>Policy desk</strong>
          <nav aria-label="Customer policies">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/delivery-returns">Delivery &amp; returns</Link>
          </nav>
          <p>
            Questions? Email <a href={`mailto:${business.primaryEmail}`}>{business.primaryEmail}</a>
            .
          </p>
        </aside>
        <article className="policy-content">
          <div className="policy-draft" role="note">
            <strong>Online checkout notice</strong>
            <p>
              Online payment remains unavailable while final ordering terms are being approved.
              Contact the Hadassah team before sending payment.
            </p>
          </div>
          {children}
          <p className="policy-version">Last updated: July 2026</p>
        </article>
      </div>
    </main>
  );
}
