import { NextResponse } from 'next/server';

/**
 * Enquiry endpoint (stub). Validates the essential fields and a honeypot, then
 * acknowledges. Email delivery (Resend), Zod schema-sharing, rate-limiting and
 * a CAPTCHA are added in the forms phase — this keeps the homepage form working
 * end-to-end without leaking anywhere yet.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot: a filled `company` field means a bot — pretend success, do nothing.
  if (typeof payload.company === 'string' && payload.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const whatsapp = typeof payload.whatsapp === 'string' ? payload.whatsapp.trim() : '';
  const consent = payload.consent === true;

  if (!fullName || !email || !whatsapp || !consent) {
    return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 422 });
  }

  // TODO(forms phase): deliver via email/CRM. For now, log server-side only.
  console.info('[enquiry] received', { fullName, email, context: payload.context });

  return NextResponse.json({ ok: true });
}
