import { Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { SocialRow } from '@/components/ui/SocialRow';

/**
 * Thin utility bar above the header: quick contact + positioning lines on the
 * left, social links on the right. Server component — every value comes from
 * `site.config.ts`.
 */
export function AnnouncementBar() {
  const { contact, topBarHighlights } = siteConfig;

  return (
    <div className="bg-slate-700 text-slate-100 dark:bg-slate-800">
      <Container className="flex h-10 items-center justify-between gap-4 text-xs">
        {/* Left: phone + short positioning lines */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex shrink-0 items-center gap-1.5 hover:text-white"
          >
            <Phone aria-hidden className="size-3.5" />
            <span>{contact.phone}</span>
          </a>
          {topBarHighlights.map((highlight) => (
            <span key={highlight} className="hidden items-center gap-3 sm:inline-flex sm:gap-4">
              <span aria-hidden className="text-slate-100/30">
                |
              </span>
              <span className="truncate">{highlight}</span>
            </span>
          ))}
        </div>

        {/* Right: social links — same component and colours as the footer */}
        <SocialRow size="sm" className="shrink-0" />
      </Container>
    </div>
  );
}
