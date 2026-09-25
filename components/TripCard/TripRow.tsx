import Link from 'next/link';
import type { Trip } from '@/types/content';
import { tripPath } from '@/lib/trips/href';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { resolveIcon } from '@/components/ui/icons/iconMap';

export interface TripRowProps {
  trip: Trip;
  priority?: boolean;
  className?: string;
}

/**
 * Horizontal listing row — image, body, price rail — used on `/tours`, where a
 * long descriptive list reads better than a card grid. Same content as
 * `TripCard`; only the shape differs, so a trip needs no extra fields.
 *
 * Stacks to a single column below `md`, where three columns would crush both
 * the description and the price.
 */
export function TripRow({ trip, priority = false, className }: TripRowProps) {
  const href = tripPath(trip);
  const facts = trip.cardFacts ?? [];

  return (
    <article
      className={cn(
        'bg-card relative grid overflow-hidden rounded-md border border-slate-200 shadow-[0_2px_10px_rgb(0_0_0/0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_26px_rgb(0_0_0/0.13)] motion-reduce:transform-none motion-reduce:transition-none md:grid-cols-[250px_1fr_190px] dark:border-slate-800 dark:shadow-black/30',
        className,
      )}
    >
      <div className="relative min-h-[180px]">
        <OptimizedImage
          image={trip.heroImage}
          fill
          aspectRatio="auto"
          wrapperClassName="absolute inset-0 h-full"
          sizes="(max-width: 768px) 100vw, 250px"
          priority={priority}
        />
        {trip.earlyBird && (
          <span className="bg-brand-500 absolute top-[22px] -right-[38px] z-[2] rotate-45 px-11 py-1.5 text-[11.5px] font-extrabold tracking-[0.06em] text-white uppercase shadow-[0_2px_8px_rgb(0_0_0/0.25)]">
            Early bird!
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-2.5 px-[22px] py-[18px]">
        <h3 className="text-[16.5px] leading-[1.35] font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-slate-50">
          {trip.title}
        </h3>
        <p className="text-[13.5px] text-slate-600 dark:text-slate-400">{trip.summary}</p>

        {facts.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {facts.map(({ icon, label }, i) => {
              const Icon = resolveIcon(icon);
              return (
                <li
                  key={`${i}-${label}`}
                  className="inline-flex items-center gap-[5px] rounded-[3px] border border-slate-200 bg-slate-50 px-[9px] py-1 text-[11.5px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  <Icon aria-hidden className="size-3.5 shrink-0" />
                  {label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-slate-200 px-4 py-[18px] text-center md:border-l dark:border-slate-800">
        {trip.priceOnRequest ? (
          <p className="text-brand-500 text-[16px] font-extrabold">Price on request</p>
        ) : (
          <p className="leading-[1.35]">
            {trip.price.originalAmount && (
              <s className="block text-[13px] text-slate-400">
                {formatCurrency(trip.price.originalAmount, trip.price.currency)}
              </s>
            )}
            <b className="text-brand-500 text-[22px] font-extrabold">
              {formatCurrency(trip.price.amount, trip.price.currency)}
            </b>
            <small className="block text-[12px] text-slate-500">per person</small>
          </p>
        )}

        <Button
          asChild
          fullWidth
          className="text-[12.5px] tracking-[0.07em] after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          <Link href={href}>View trip &amp; itinerary</Link>
        </Button>

        {/* Above the stretched CTA overlay so it stays separately clickable. */}
        <Link
          href={`/custom-trips?trip=${trip.slug}`}
          className="text-brand-600 hover:text-brand-700 dark:text-brand-400 relative z-[2] text-[13.5px] font-bold"
        >
          Enquire
        </Link>
      </div>
    </article>
  );
}
