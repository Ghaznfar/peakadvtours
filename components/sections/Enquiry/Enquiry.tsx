import { Clock, Mail, MapPin, Phone, Route, ShieldCheck, Wallet } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/icons/SocialIcons';
import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { EnquiryForm } from '@/components/EnquiryForm';

/**
 * The three reassurance lines beside the form. Deliberately not claims the
 * client has to earn: no accreditation, award or rating is asserted here —
 * CLAUDE.md §2 — only what the enquiry process itself does.
 */
const PROMISES = [
  { Icon: Route, text: 'Every itinerary written from scratch around your dates.' },
  { Icon: ShieldCheck, text: 'One planner owns your trip, before and during it.' },
  { Icon: Wallet, text: 'A full costing up front — no deposit to see one.' },
];

export interface EnquiryProps {
  destinationOptions: { value: string; label: string }[];
  /** Preselect a destination/category in the form (e.g. from a trip page). */
  defaultDestination?: string;
  /** Auto-attach a specific trip to the enquiry (from a detail page). */
  tripSlug?: string;
  tripTitle?: string;
  /** Which page/context produced the enquiry (tracking). */
  source?: string;
  eyebrow?: string;
  title?: string;
  /**
   * Accreditations shown under the contact details. Passed in rather than
   * fetched here so this stays presentational (CLAUDE.md §4). Omitted on pages
   * that don't load them; the row simply doesn't render.
   */
  credentials?: Array<{ id: string; name: string; abbr?: string }>;
}

/** Enquiry CTA + contact details + WhatsApp + lead form (sections 17–19). */
export function Enquiry({
  destinationOptions,
  defaultDestination,
  tripSlug,
  tripTitle,
  source,
  eyebrow = 'Plan your trip',
  title = 'Plan your trip',
  credentials = [],
}: EnquiryProps) {
  const { contact } = siteConfig;
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`;

  return (
    <Section id="enquiry" ariaLabel="Plan your trip" className="bg-[#2c3e50] text-slate-300">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: pitch + contact details */}
          <div>
            <span className="sr-only">{eyebrow}</span>
            <h2 className="text-[clamp(26px,3vw,36px)] font-extrabold tracking-[0.02em] text-white uppercase">
              {title}
            </h2>
            <p className="mt-4 max-w-md text-slate-300">
              Tell us who is travelling and roughly when. A trip planner — not a call centre —
              replies personally with a day-by-day itinerary and the full price per person, with
              nothing hidden underneath it.
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              {PROMISES.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <hr className="my-7 border-white/10" />

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span className="flex flex-col">
                  <a href={telHref} className="font-semibold hover:text-white">
                    {contact.phone}
                  </a>
                  {contact.phoneSecondary && (
                    <a
                      href={`tel:${contact.phoneSecondary.replace(/[^\d+]/g, '')}`}
                      className="font-semibold hover:text-white"
                    >
                      {contact.phoneSecondary}
                    </a>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span className="flex flex-col">
                  <a href={`mailto:${contact.email}`} className="font-semibold hover:text-white">
                    {contact.email}
                  </a>
                  {contact.emailSecondary && (
                    <a
                      href={`mailto:${contact.emailSecondary}`}
                      className="font-semibold hover:text-white"
                    >
                      {contact.emailSecondary}
                    </a>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>{contact.hours}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span>
                  {contact.address.line1}, {contact.address.city}, {contact.address.country}
                </span>
              </li>
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="flex-1 bg-[#25D366] text-[12.5px] tracking-[0.07em] hover:bg-[#1da851]"
              >
                <a
                  href={buildWhatsAppUrl(
                    contact.whatsapp,
                    `Hi ${siteConfig.name}, I'd like to plan a trip.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon aria-hidden className="size-4" />
                  Chat on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-white/30 text-[12.5px] tracking-[0.07em] text-white hover:bg-white/10"
              >
                <a href={telHref}>
                  <Phone aria-hidden className="size-4" />
                  Call us
                </a>
              </Button>
            </div>

            {credentials.length > 0 && (
              <>
                <hr className="my-7 border-white/10" />
                <h3 className="text-[12px] font-bold tracking-[0.12em] text-white uppercase">
                  Active member &amp; authorised by
                </h3>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {credentials.map((c) => (
                    <li
                      key={c.id}
                      className="flex h-16 w-[112px] items-center justify-center rounded bg-white px-3 text-center"
                    >
                      {/* Text marks until the client supplies logo artwork —
                          inventing badges would assert credentials they may not
                          hold (CLAUDE.md §2). */}
                      <span className="text-[11px] leading-tight font-bold text-slate-700">
                        {c.abbr ?? c.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Right: form */}
          <div className="rounded-card bg-white p-6 shadow-xl sm:p-8">
            <EnquiryForm
              destinationOptions={destinationOptions}
              defaultDestination={defaultDestination}
              tripSlug={tripSlug}
              tripTitle={tripTitle}
              source={source}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
