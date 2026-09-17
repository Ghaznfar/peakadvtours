import { NextResponse } from 'next/server';
import { enquirySchema } from '@/lib/enquiry/schema';
import { deliverEnquiry, toRecord } from '@/lib/enquiry/delivery';
import { rateLimit } from '@/lib/enquiry/rateLimit';

// Bots typically submit forms in well under a second.
const MIN_FILL_MS = 800;

function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Enquiry submission endpoint. Validates with the SAME Zod schema as the client
 * (defence in depth), applies spam protection (honeypot + time-trap + IP rate
 * limit) and hands off to the pluggable delivery layer. All secrets stay server
 * side. Returns a typed JSON result the form can render.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // 1) Honeypot — a filled hidden field means a bot. Pretend success, do nothing.
  if (typeof data.company === 'string' && data.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2) Time-trap — submitted implausibly fast. Silently discard.
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  // 3) Rate limit per IP.
  const limit = rateLimit(`enquiry:${clientIp(request)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  // 4) Server-side validation with the shared schema.
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // 5) Deliver via enabled channels.
  try {
    const record = toRecord(parsed.data, { ip: clientIp(request) });
    const result = await deliverEnquiry(record);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: 'We could not process your enquiry. Please try again.' },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, id: record.id });
  } catch (error) {
    console.error('[enquiry] unexpected error:', error);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
