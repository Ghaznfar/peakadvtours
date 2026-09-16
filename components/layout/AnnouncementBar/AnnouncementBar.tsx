import { Mail, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';

/**
 * Thin top information bar above the header. Server component; content is a
 * short promo line plus quick contact links (all from site config).
 */
export function AnnouncementBar() {
  const { contact } = siteConfig;
  return (
    <div className="bg-brand-950 text-brand-50">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs">
        <p className="truncate">
          <span className="font-medium">Early-bird 2026 departures open</span>
          <span className="hidden sm:inline"> — small groups, fully-inclusive pricing.</span>
        </p>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Phone aria-hidden className="size-3.5" />
            <span className="hidden md:inline">{contact.phone}</span>
            <span className="md:hidden">Call</span>
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="hidden items-center gap-1.5 hover:text-white sm:inline-flex"
          >
            <Mail aria-hidden className="size-3.5" />
            <span>{contact.email}</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
