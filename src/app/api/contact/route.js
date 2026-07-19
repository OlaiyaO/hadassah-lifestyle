import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please complete every field.' }, { status: 400 });
  }

  const primaryRecipient = process.env.CONTACT_PRIMARY_EMAIL;
  const secondaryRecipient = process.env.CONTACT_SECONDARY_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;

  if (!primaryRecipient || !apiKey) {
    return NextResponse.json(
      {
        error:
          'Email delivery is awaiting the professional address and provider key. Please use WhatsApp for now.',
      },
      { status: 503 },
    );
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || 'Hadassah Lifestyle <onboarding@resend.dev>',
      to: [primaryRecipient, secondaryRecipient].filter(Boolean),
      reply_to: email,
      subject: `Hadassah enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: 'The message could not be sent. Please try WhatsApp.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
