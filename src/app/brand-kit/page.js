import { ArrowLeft, ArrowUpRight, Download, Eye } from 'lucide-react';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { brandTemplates } from '@/data/brandTemplates';
import { business } from '@/data/business';

export const metadata = {
  title: 'Operational Brand Kit | Hadassah Lifestyle',
  description: 'View, print and download Hadassah Lifestyle daily-business templates.',
};

export default function BrandKitPage() {
  return (
    <main className="kit-page">
      <header className="kit-nav">
        <Link href="/">
          <ArrowLeft size={16} /> Storefront
        </Link>
        <BrandMark />
        <span>Brand system 01</span>
      </header>
      <section className="kit-hero">
        <p>Hadassah working system</p>
        <h1>
          Not mockups.
          <br />
          <em>Tools for business.</em>
        </h1>
        <div>
          <p>
            Every template below is a working operational surface. Open it to edit by hand, print
            directly, or use your browser’s Save as PDF function.
          </p>
          <span>
            {business.owner}
            <br />
            {business.phone}
            <br />
            Abuja, Nigeria
          </span>
        </div>
      </section>
      <section className="kit-principles">
        <div>
          <small>01</small>
          <strong>One identity</strong>
          <p>Consistent typography, colour and contact details across every customer touchpoint.</p>
        </div>
        <div>
          <small>02</small>
          <strong>Useful first</strong>
          <p>Documents are structured around real selling, fulfilment and record-keeping tasks.</p>
        </div>
        <div>
          <small>03</small>
          <strong>Ready to keep</strong>
          <p>View on screen or download clean PDF copies for your operating files.</p>
        </div>
      </section>
      <section className="kit-library" id="templates">
        <div className="kit-library__heading">
          <p>Operational library</p>
          <h2>Choose a working template.</h2>
          <span>{brandTemplates.length} assets</span>
        </div>
        <div className="kit-grid">
          {brandTemplates.map((template, index) => (
            <article className="kit-card" key={template.slug}>
              <div className="kit-card__preview">
                <span>H / L</span>
                <small>{String(index + 1).padStart(2, '0')}</small>
                <h3>{template.title}</h3>
                <p>{template.type}</p>
              </div>
              <div className="kit-card__body">
                <p>{template.description}</p>
                <div>
                  <a href={`/brand-kit/templates/${template.slug}`}>
                    <Eye size={15} /> View
                  </a>
                  <a href={`/brand-kit/templates/${template.slug}?download=1`}>
                    <Download size={15} /> Download PDF
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="kit-contact">
        <p>Canonical business details</p>
        <h2>{business.owner}</h2>
        <div>
          <span>
            {business.address.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </span>
          <span>
            {business.phone}
            <br />
            {business.primaryEmail}
          </span>
        </div>
        <a href={`https://wa.me/${business.whatsappNumber}`} target="_blank" rel="noreferrer">
          Open WhatsApp <ArrowUpRight size={16} />
        </a>
      </section>
    </main>
  );
}
