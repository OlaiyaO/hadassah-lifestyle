export async function POST() {
  return Response.json(
    {
      error:
        'Online payment is unavailable because the Paystack integration is not yet ready. No money has been collected; please confirm your order on WhatsApp.',
    },
    { status: 503 },
  );
}
