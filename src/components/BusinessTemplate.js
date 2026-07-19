import { BrandMark } from '@/components/BrandMark';
import { business } from '@/data/business';

const documentTitles = {
  invoice: 'Invoice',
  quotation: 'Quotation',
  receipt: 'Payment receipt',
  'purchase-order': 'Purchase order',
  'delivery-note': 'Delivery note',
  'order-form': 'Customer order form',
  'return-form': 'Return & exchange form',
  'inventory-sheet': 'Inventory sheet',
};

function ContactBlock() {
  return (
    <div className="document-contact">
      <strong>{business.owner}</strong>
      <span>{business.phone}</span>
      <span>{business.primaryEmail}</span>
      {business.address.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

function DocumentHeader({ title }) {
  return (
    <header className="document-header">
      <BrandMark />
      <div>
        <p>{title}</p>
        <span>No. __________</span>
      </div>
    </header>
  );
}

function LineTable({ slug }) {
  const headers =
    slug === 'inventory-sheet'
      ? ['SKU / item', 'Category', 'In stock', 'Reorder level', 'Unit cost']
      : slug === 'return-form'
        ? ['Item', 'Order no.', 'Reason', 'Condition', 'Resolution']
        : ['Description / item', 'Qty', 'Unit price', 'Amount'];

  return (
    <table className="document-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 7 }, (_, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>&nbsp;</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StandardDocument({ slug }) {
  const title = documentTitles[slug];
  return (
    <article className="print-sheet">
      <DocumentHeader title={title} />
      <section className="document-parties">
        <div>
          <small>{slug === 'purchase-order' ? 'Supplier' : 'Customer'}</small>
          <p>Name: __________________________</p>
          <p>Phone: _________________________</p>
          <p>Address: ________________________</p>
        </div>
        <div>
          <small>Document details</small>
          <p>Date: ___________________________</p>
          <p>Reference: ______________________</p>
          <p>Prepared by: {business.owner}</p>
        </div>
      </section>
      <LineTable slug={slug} />
      <section className="document-summary">
        <div>
          <small>Notes / terms</small>
          <p>__________________________________________________</p>
          <p>__________________________________________________</p>
        </div>
        <div>
          <p>Subtotal __________</p>
          <p>Delivery __________</p>
          <strong>Total __________</strong>
        </div>
      </section>
      <section className="document-signatures">
        <p>Issued / approved __________________</p>
        <p>Customer / recipient __________________</p>
      </section>
      <footer className="document-footer">
        <span>Registration / Tax ID: [confirm before use]</span>
        <span>Bank details: [insert approved account]</span>
      </footer>
    </article>
  );
}

function BusinessCard() {
  return (
    <div className="card-sheet">
      <article className="identity-card identity-card--front">
        <BrandMark light />
        <h1>
          Beautifully chosen.
          <br />
          <em>Effortlessly yours.</em>
        </h1>
        <span>Abuja, Nigeria</span>
      </article>
      <article className="identity-card identity-card--back">
        <BrandMark />
        <div>
          <h2>{business.owner}</h2>
          <p>Founder / Curator</p>
        </div>
        <ContactBlock />
      </article>
    </div>
  );
}

function Letterhead() {
  return (
    <article className="print-sheet letterhead">
      <DocumentHeader title="Private correspondence" />
      <div className="letter-meta">
        <p>Date: __________________</p>
        <p>To: ____________________</p>
        <p>Subject: __________________________________________</p>
      </div>
      <div className="letter-body">
        <p>Dear __________________,</p>
        <p>
          Begin your message here. This working template is designed for supplier correspondence,
          customer resolutions, partnership letters and formal business communication.
        </p>
        <p>________________________________________________________________</p>
        <p>________________________________________________________________</p>
        <p>Warmly,</p>
        <strong>{business.owner}</strong>
        <span>Hadassah Lifestyle</span>
      </div>
      <footer className="document-footer">
        <ContactBlock />
      </footer>
    </article>
  );
}

function EmailSignature() {
  return (
    <article className="signature-sheet">
      <div className="signature-mark">
        <BrandMark />
      </div>
      <div>
        <h2>{business.owner}</h2>
        <p>Founder / Curator · Hadassah Lifestyle</p>
        <a href={`tel:${business.phone.replaceAll(' ', '')}`}>{business.phone}</a>
        <a href={`mailto:${business.primaryEmail}`}>{business.primaryEmail}</a>
        <span>{business.address.join(' · ')}</span>
      </div>
    </article>
  );
}

function SocialCard() {
  return (
    <article className="social-sheet">
      <div className="social-sheet__frame">
        <BrandMark light />
        <p>THE HADASSAH EDIT</p>
        <h1>
          Beautiful things.
          <br />
          <em>Chosen for real life.</em>
        </h1>
        <span>Clothing · Shoes · Bags · Kitchen</span>
      </div>
    </article>
  );
}

function ThankYouCard() {
  return (
    <article className="thank-you-sheet">
      <BrandMark />
      <p>FOR YOU, WITH INTENTION</p>
      <h1>
        Thank you for
        <br />
        <em>choosing beautifully.</em>
      </h1>
      <span>Share your Hadassah moment with us.</span>
      <strong>{business.phone} · Abuja</strong>
    </article>
  );
}

export function BusinessTemplate({ slug }) {
  if (slug === 'business-card') return <BusinessCard />;
  if (slug === 'letterhead') return <Letterhead />;
  if (slug === 'email-signature') return <EmailSignature />;
  if (slug === 'social-card') return <SocialCard />;
  if (slug === 'thank-you-card') return <ThankYouCard />;
  return <StandardDocument slug={slug} />;
}
