import { PolicyPage } from '@/components/PolicyPage';
import { business } from '@/data/business';

export const metadata = { title: 'Delivery & Returns | Hadassah Lifestyle' };

export default function DeliveryReturnsPage() {
  return (
    <PolicyPage
      eyebrow="After you order"
      title="Delivery & returns"
      introduction="What to expect when your Hadassah order is prepared, delivered or needs attention."
    >
      <section>
        <h2>Delivery arrangements</h2>
        <p>
          We serve customers from Abuja, Nigeria. Your delivery area, delivery fee and expected
          timing will be shown or confirmed before payment or before your order is placed. Timing
          may depend on the destination, stock and the delivery service, and we will tell you if a
          known issue affects the arrangement.
        </p>
      </section>
      <section>
        <h2>Receiving your order</h2>
        <p>
          Please provide a complete address and a telephone number where you can be reached. Check
          the parcel when it arrives where reasonably possible, and contact us promptly if anything
          is missing, damaged or different from what was confirmed.
        </p>
      </section>
      <section>
        <h2>Return eligibility</h2>
        <p>
          Physical goods may be eligible for return only when unused and unworn, with their original
          tags, accessories and packaging, and when you contact us promptly. The final returns
          window is being approved and will be stated here before online checkout is enabled.
        </p>
      </section>
      <section>
        <h2>Items that may be excluded</h2>
        <p>
          Where lawful, exclusions can include personalised or made-to-order goods and
          hygiene-sensitive goods once opened or used. An exclusion will not remove any right you
          have where an item is faulty, damaged, wrongly supplied or otherwise protected by
          applicable law.
        </p>
      </section>
      <section>
        <h2>Damaged or wrong goods</h2>
        <p>
          Contact us as soon as you notice a problem, explain what happened and keep the item and
          packaging while we review it. We may request clear photographs or other reasonable order
          details. We will escalate confirmed damaged or wrong goods and discuss an appropriate
          replacement, repair or refund as applicable.
        </p>
      </section>
      <section>
        <h2>Return and refund process</h2>
        <p>
          Contact the team before sending anything back so that the return method and any delivery
          arrangements can be agreed. Eligible refunds are issued after the returned item has been
          received and inspected, normally to the original payment method. Your payment provider or
          bank may need additional processing time.
        </p>
      </section>
      <section>
        <h2>Contact the team</h2>
        <p>
          Email <a href={`mailto:${business.primaryEmail}`}>{business.primaryEmail}</a> or call
          {` ${business.phone}`} with your name, order reference and a short description of the
          issue.
        </p>
      </section>
    </PolicyPage>
  );
}
