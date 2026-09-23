import Link from 'next/link';
import { WhatsappIcon } from '@/components/ui/icons/SocialIcons';
import { siteConfig } from '@/site.config';
import type { Trip } from '@/types/content';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { formatPrice } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface BookingPanelProps {
  trip: Trip;
}

/**
 * Booking/enquiry panel. On desktop the parent makes this sticky in the aside;
 * on mobile it renders inline (a separate sticky bottom bar handles the mobile
 * CTA). Content-driven — price, deposit and CTAs come from the trip + config.
 */
export function BookingPanel({ trip }: BookingPanelProps) {
  const { current, original } = formatPrice(trip.price, siteConfig.locale);
  const whatsappHref = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    `Hi ${siteConfig.name}, I'm interested in the ${trip.title}.`,
  );

  return (
    <div className="rounded-card border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-baseline gap-2">
        {trip.priceOnRequest ? (
          <span className="text-2xl font-bold text-slate-900">Price on request</span>
        ) : (
          <>
            <span className="text-xs text-slate-500">From</span>
            {original && <span className="text-sm text-slate-400 line-through">{original}</span>}
            <span className="text-2xl font-bold text-slate-900">{current}</span>
            <span className="text-xs text-slate-500">/ person</span>
          </>
        )}
      </div>

      {trip.earlyBird && (
        <Badge tone="accent" className="mt-3">
          Early-bird price
        </Badge>
      )}

      <dl className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Duration</dt>
          <dd className="font-medium text-slate-900">{trip.durationDays} days</dd>
        </div>
        {typeof trip.depositPercent === 'number' && (
          <div className="flex justify-between">
            <dt className="text-slate-500">Deposit to book</dt>
            <dd className="font-medium text-slate-900">{trip.depositPercent}%</dd>
          </div>
        )}
        {trip.groupSizeMax && (
          <div className="flex justify-between">
            <dt className="text-slate-500">Group size</dt>
            <dd className="font-medium text-slate-900">Max {trip.groupSizeMax}</dd>
          </div>
        )}
      </dl>

      <div className="mt-6 flex flex-col gap-3">
        <Button asChild size="lg" fullWidth>
          <Link href="#enquiry">Enquire about this trip</Link>
        </Button>
        <Button asChild variant="whatsapp" size="lg" fullWidth>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon aria-hidden className="size-5" />
            Ask on WhatsApp
          </a>
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        No account, no obligation — a planner replies personally.
      </p>
    </div>
  );
}
