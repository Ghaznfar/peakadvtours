import 'server-only';
import {
  DURATION_OPTIONS,
  FLEXIBILITY_OPTIONS,
  TRIP_TYPE_OPTIONS,
  labelFor,
  type EnquiryInput,
} from './schema';

/**
 * Enquiry delivery architecture.
 *
 * A validated enquiry is handed to `deliverEnquiry`, which fans it out to every
 * ENABLED channel. Channels are pluggable so the client can later route leads to
 * email, a database, a CRM or a WhatsApp workflow WITHOUT touching the form or
 * the API — just enable a channel via env vars.
 *
 * SECURITY: this module is server-only (`server-only`); all credentials come
 * from server env vars and are never exposed to the browser.
 *
 * Enabled today (simplest production-safe default):
 *   - logChannel     — always on; structured server log (no secrets, no setup).
 *   - emailChannel    — on when RESEND_API_KEY + ENQUIRY_TO_EMAIL are set.
 *   - webhookChannel  — on when ENQUIRY_WEBHOOK_URL is set (Zapier/Make/n8n →
 *                       CRM, spreadsheet, WhatsApp Business API, etc.).
 *
 * To add a database channel later: implement `send()` to insert a row, gate it
 * behind e.g. DATABASE_URL, and push it into `CHANNELS`. Nothing else changes.
 */

export interface EnquiryRecord {
  id: string;
  receivedAt: string;
  ip?: string;
  fullName: string;
  email: string;
  whatsapp: string;
  country?: string;
  destination?: string;
  startDate?: string;
  adults: number;
  children: number;
  hotel?: string;
  budget?: string;
  message?: string;
  /** Trip-builder answers (/custom-trips), stored as the wording the visitor saw. */
  tripTypes?: string[];
  duration?: string;
  flexibility?: string;
  tripSlug?: string;
  tripTitle?: string;
  source?: string;
}

interface Channel {
  name: string;
  isEnabled: () => boolean;
  send: (record: EnquiryRecord) => Promise<void>;
}

function summaryLines(r: EnquiryRecord): string {
  return [
    `New enquiry (${r.id})`,
    `Name: ${r.fullName}`,
    `Email: ${r.email}`,
    `WhatsApp/phone: ${r.whatsapp}`,
    r.country ? `Country: ${r.country}` : '',
    r.destination ? `Destination: ${r.destination}` : '',
    r.tripTitle ? `Trip: ${r.tripTitle} (${r.tripSlug ?? ''})` : '',
    r.tripTypes?.length ? `Trip type: ${r.tripTypes.join(', ')}` : '',
    r.startDate ? `Preferred start: ${r.startDate}` : '',
    r.flexibility ? `Date flexibility: ${r.flexibility}` : '',
    r.duration ? `Length: ${r.duration}` : '',
    `Travellers: ${r.adults} adult(s), ${r.children} child(ren)`,
    r.hotel ? `Hotel: ${r.hotel}` : '',
    r.budget ? `Budget: ${r.budget}` : '',
    r.message ? `Message: ${r.message}` : '',
    r.source ? `Source: ${r.source}` : '',
    `Received: ${r.receivedAt}`,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Always-on: a structured server log so a lead is never lost, even with no setup. */
const logChannel: Channel = {
  name: 'log',
  isEnabled: () => true,
  async send(record) {
    console.info('[enquiry] received\n' + summaryLines(record));
  },
};

/** Email via Resend REST API (no SDK dependency). Enabled by env vars. */
const emailChannel: Channel = {
  name: 'email',
  isEnabled: () => Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL),
  async send(record) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL ?? 'Enquiries <onboarding@resend.dev>',
        to: [process.env.ENQUIRY_TO_EMAIL],
        reply_to: record.email,
        subject: `New enquiry${record.tripTitle ? ` — ${record.tripTitle}` : ''} (${record.fullName})`,
        text: summaryLines(record),
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  },
};

/** Generic webhook (CRM / WhatsApp workflow / automation). Enabled by env var. */
const webhookChannel: Channel = {
  name: 'webhook',
  isEnabled: () => Boolean(process.env.ENQUIRY_WEBHOOK_URL),
  async send(record) {
    const res = await fetch(process.env.ENQUIRY_WEBHOOK_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  },
};

const CHANNELS: Channel[] = [logChannel, emailChannel, webhookChannel];

export interface DeliveryResult {
  ok: boolean;
  delivered: string[];
  failed: string[];
}

/** Build a record from validated input + request metadata. */
export function toRecord(input: EnquiryInput, meta: { ip?: string }): EnquiryRecord {
  const clean = (v?: string) => (v && v.length > 0 ? v : undefined);
  return {
    id: `enq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    receivedAt: new Date().toISOString(),
    ip: meta.ip,
    fullName: input.fullName,
    email: input.email,
    whatsapp: input.whatsapp,
    country: clean(input.country),
    destination: clean(input.destination),
    startDate: clean(input.startDate),
    adults: input.adults,
    children: input.children ?? 0,
    hotel: clean(input.hotel),
    budget: clean(input.budget),
    message: clean(input.message),
    tripTypes: input.tripTypes?.length
      ? input.tripTypes.map((v) => labelFor(TRIP_TYPE_OPTIONS, v) ?? v)
      : undefined,
    duration: labelFor(DURATION_OPTIONS, clean(input.duration)),
    flexibility: labelFor(FLEXIBILITY_OPTIONS, clean(input.flexibility)),
    tripSlug: clean(input.tripSlug),
    tripTitle: clean(input.tripTitle),
    source: clean(input.source),
  };
}

/**
 * Deliver to all enabled channels. The always-on log channel means we consider
 * the lead captured even if an optional channel (email/webhook) is down; those
 * failures are logged but do not fail the user's request.
 */
export async function deliverEnquiry(record: EnquiryRecord): Promise<DeliveryResult> {
  const delivered: string[] = [];
  const failed: string[] = [];

  await Promise.all(
    CHANNELS.filter((c) => c.isEnabled()).map(async (channel) => {
      try {
        await channel.send(record);
        delivered.push(channel.name);
      } catch (error) {
        failed.push(channel.name);
        console.error(`[enquiry] channel "${channel.name}" failed:`, error);
      }
    }),
  );

  // Success as long as at least one channel captured it (log is always enabled).
  return { ok: delivered.length > 0, delivered, failed };
}
