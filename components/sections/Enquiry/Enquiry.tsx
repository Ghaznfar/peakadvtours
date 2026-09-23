import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/icons/SocialIcons';
import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { EnquiryForm } from '@/components/EnquiryForm';

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
}

/** Enquiry CTA + contact details + WhatsApp + lead form (sections 17–19). */
export function Enquiry({
  destinationOptions,
  defaultDestination,
  tripSlug,
  tripTitle,
  source,
  eyebrow = 'Plan your trip',
  title = 'Tell us who’s travelling and roughly when',
}: EnquiryProps) {
  const { contact } = siteConfig;
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, '')}`;

  return (
    <Section id="enquiry" ariaLabel="Plan your trip">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: pitch + contact details */}
          <div>
            <p className="text-brand-700 text-sm font-semibold tracking-wider uppercase">
              {eyebrow}
            </p>
            <h2 className="text-h2 mt-2">{title}</h2>
            <p className="mt-4 text-slate-600">
              A trip planner — not a call centre — replies personally with a day-by-day itinerary
              and the full price per person. No account and no deposit to see one.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <span className="flex flex-col text-slate-700">
                  <a href={telHref} className="hover:text-brand-700">
                    {contact.phone}
                  </a>
                  {contact.phoneSecondary && (
                    <a
                      href={`tel:${contact.phoneSecondary.replace(/[^\d+]/g, '')}`}
                      className="hover:text-brand-700"
                    >
                      {contact.phoneSecondary}
                    </a>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <span className="flex flex-col text-slate-700">
                  <a href={`mailto:${contact.email}`} className="hover:text-brand-700">
                    {contact.email}
                  </a>
                  {contact.emailSecondary && (
                    <a href={`mailto:${contact.emailSecondary}`} className="hover:text-brand-700">
                      {contact.emailSecondary}
                    </a>
                  )}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <span className="text-slate-700">{contact.hours}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <span className="text-slate-700">
                  {contact.address.line1}, {contact.address.city}, {contact.address.country}
                </span>
              </li>
            </ul>

            <div className="rounded-card mt-8 border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">Prefer to chat? Message us directly.</p>
              <Button asChild variant="whatsapp" className="mt-3">
                <a
                  href={buildWhatsAppUrl(
                    contact.whatsapp,
                    `Hi ${siteConfig.name}, I'd like to plan a trip.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsappIcon aria-hidden className="size-5" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
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
