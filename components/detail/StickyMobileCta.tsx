import Link from 'next/link';
import { WhatsappIcon } from '@/components/ui/icons/SocialIcons';
import { siteConfig } from '@/site.config';
import type { Trip } from '@/types/content';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';

export interface StickyMobileCtaProps {
  trip: Trip;
}

/**
 * Mobile-only sticky bottom bar (hidden ≥ lg). Fixed position, no JS. The page
 * adds bottom padding so it never covers content. Sits above the global
 * floating WhatsApp button via z-index.
 */
export function StickyMobileCta({ trip }: StickyMobileCtaProps) {
  const { current } = formatPrice(trip.price, siteConfig.locale);
  const whatsappHref = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    `Hi ${siteConfig.name}, I'm interested in the ${trip.title}.`,
  );

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-slate-500">
            {trip.priceOnRequest ? 'Price on request' : `From ${current} / person`}
          </p>
          <p className="truncate text-sm font-semibold text-slate-900">{trip.title}</p>
        </div>
        <Button asChild variant="whatsapp" size="icon" aria-label="Ask on WhatsApp">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon aria-hidden className="size-5" />
          </a>
        </Button>
        <Button asChild size="md">
          <Link href="#enquiry">Enquire</Link>
        </Button>
      </div>
    </div>
  );
}
