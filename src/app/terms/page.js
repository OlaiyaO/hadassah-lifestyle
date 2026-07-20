import { PolicyPage } from '@/components/PolicyPage';
import { business } from '@/data/business';

export const metadata = { title: 'Customer Terms | Hadassah Lifestyle' };

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Shopping with Hadassah"
      title="Customer terms"
      introduction="The practical terms for browsing, ordering and buying from Hadassah Lifestyle in Nigeria."
    >
      <section>
        <h2>About these terms</h2>
        <p>
          These terms apply when you use this website or discuss an order with {business.name}.
          Online checkout will remain unavailable until the complete ordering terms have been
          approved and published.
        </p>
      </section>
      <section>
        <h2>Products and availability</h2>
        <p>
          We aim to describe and photograph products accurately, but screens, handmade details and
          supplier variations may affect colour or appearance. Products remain subject to
          availability. Size, colour, set contents and other variants must be confirmed with our
          team where the product listing says so.
        </p>
      </section>
      <section>
        <h2>Prices and delivery</h2>
        <p>
          Product prices are shown in Nigerian naira (NGN). Any applicable delivery fee and expected
          delivery time will be confirmed before payment. We will not assume an exact fee or timing
          where it has not yet been agreed with you.
        </p>
      </section>
      <section>
        <h2>Orders and payment</h2>
        <p>
          Submitting checkout details or receiving a Paystack payment response does not by itself
          mean that we have accepted your order. An order is accepted only after successful payment
          and separate merchant confirmation of the product, variant, availability and delivery
          details. If we cannot accept a paid order, we will contact you and arrange an appropriate
          refund.
        </p>
      </section>
      <section>
        <h2>Using this website</h2>
        <p>
          Please provide accurate information and use the website only for lawful shopping and
          enquiries. Do not interfere with its operation, attempt unauthorised access, submit
          harmful material or use its content in a misleading or unlawful way.
        </p>
      </section>
      <section>
        <h2>Problems and responsibility</h2>
        <p>
          Contact us promptly if an order is wrong, damaged or not as agreed so that we can
          investigate and put matters right. Nothing in these terms excludes rights or
          responsibilities that cannot lawfully be excluded. To the extent permitted by law, we are
          not responsible for indirect losses that were not reasonably foreseeable from the order.
        </p>
      </section>
      <section>
        <h2>Nigerian law</h2>
        <p>
          These terms are intended to be interpreted under the laws of the Federal Republic of
          Nigeria. We will try to resolve concerns fairly and directly first. Any dispute process
          remains subject to applicable consumer rights and the jurisdiction available under
          Nigerian law.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about an order or these terms can be sent to{' '}
          <a href={`mailto:${business.primaryEmail}`}>{business.primaryEmail}</a> or discussed with
          the Hadassah team on {business.phone}.
        </p>
      </section>
    </PolicyPage>
  );
}
