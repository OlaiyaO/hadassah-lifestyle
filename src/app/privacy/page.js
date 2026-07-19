import { PolicyPage } from '@/components/PolicyPage';
import { business } from '@/data/business';

export const metadata = { title: 'Privacy Notice | Hadassah Lifestyle' };

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Your information"
      title="Privacy notice"
      introduction="How Hadassah Lifestyle handles the information you share while shopping or contacting our Abuja team."
    >
      <section>
        <h2>Who handles your information</h2>
        <p>
          {business.name}, based at {business.address.join(', ')}, is responsible for the customer
          information described here. Our final legal identity must be confirmed before live launch.
        </p>
      </section>
      <section>
        <h2>Information we receive</h2>
        <p>
          At checkout, we receive your name, email address, telephone number, delivery address,
          city, state and order details. If you contact us, we receive the details in your message
          and any information you choose to provide. We may also receive basic technical and
          security information needed to operate and protect the website.
        </p>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>
          We use this information to respond to enquiries, confirm products and variants, process
          and verify orders, arrange delivery, provide customer care, prevent misuse and keep
          appropriate business and transaction records.
        </p>
      </section>
      <section>
        <h2>Services involved</h2>
        <p>
          Paystack handles checkout and payment information under its own privacy terms. Hadassah
          does not receive or store your full card details. Resend and email providers may process
          contact messages and service emails so that our team can reply and manage an order.
        </p>
        <p>
          A published Google Sheets CSV may supply the public product catalogue. It contains product
          information only and must not contain customer, payment or order data.
        </p>
      </section>
      <section>
        <h2>Sharing and sale</h2>
        <p>
          We do not sell personal data. We share it only where reasonably needed with service
          providers supporting payment, email, website operation or delivery, or where disclosure is
          required by law or needed to protect customers and the business.
        </p>
      </section>
      <section>
        <h2>Retention and security</h2>
        <p>
          We keep information only for as long as reasonably needed for the purpose collected,
          customer support, accounting, dispute handling and applicable legal obligations. We use
          reasonable organisational and technical safeguards, while recognising that no online
          service can promise absolute security.
        </p>
      </section>
      <section>
        <h2>Your requests</h2>
        <p>
          You may ask about, correct or request deletion of your personal information, subject to
          any lawful reason we must retain it. Until a professional business email is established,
          send privacy requests to{' '}
          <a href={`mailto:${business.primaryEmail}`}>{business.primaryEmail}</a>. We may need to
          verify that a request relates to you before acting on it.
        </p>
      </section>
    </PolicyPage>
  );
}
