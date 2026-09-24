import Link from 'next/link';
import {
  Bed,
  CalendarDays,
  Clock,
  Footprints,
  Mountain,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency } from '@/lib/utils/format';
import type { Trip, Difficulty, Season } from '@/types/content';
import { tripPath } from '@/lib/trips/href';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
  technical: 'Technical',
};

const SEASON_LABEL: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
};

interface CardTag {
  icon: LucideIcon;
  label: string;
}

/**
 * Build the pill row from the trip's structured fields rather than its free-text
 * `tags`, so every card shows the same facts in the same order with a matching
 * icon. Anything not set on the trip is simply omitted.
 */
function buildTags(trip: Trip): CardTag[] {
  const tags: CardTag[] = [];

  const route =
    trip.startCity && trip.endCity
      ? `${trip.durationDays} days, ${trip.startCity} to ${trip.endCity}`
      : `${trip.durationDays} days`;
  tags.push({ icon: Clock, label: route });

  if (typeof trip.maxAltitudeM === 'number') {
    tags.push({
      icon: Mountain,
      label: `Maximum altitude ${trip.maxAltitudeM.toLocaleString()} m`,
    });
  }

  tags.push({ icon: Footprints, label: DIFFICULTY_LABEL[trip.difficulty] });

  if (trip.groupSizeMax) {
    tags.push({
      icon: Users,
      label: trip.groupSizeMin
        ? `Small groups, ${trip.groupSizeMin} to ${trip.groupSizeMax}`
        : `Small groups, maximum ${trip.groupSizeMax}`,
    });
  }

  if (trip.accommodationNote) tags.push({ icon: Bed, label: trip.accommodationNote });

  const seasonText = trip.seasonNote ?? trip.season.map((s) => SEASON_LABEL[s]).join(', ');
  if (seasonText) tags.push({ icon: CalendarDays, label: seasonText });

  return tags;
}

export interface TripCardProps {
  trip: Trip;
  /** Hint next/image for correct srcset in the grid it lives in. */
  imageSizes?: string;
  /** Prioritise the image (first row, above the fold only). */
  priority?: boolean;
  className?: string;
}

/**
 * The reusable trip card — renders any tour, trek or expedition. Category never
 * changes the layout; it only affects which facts exist to show (altitude, for
 * instance, is absent on most tours). Presentational: receives a formed `Trip`.
 *
 * The primary CTA carries a stretched pseudo-element so the whole card is one
 * click target, while the secondary "Enquire" link stays independently
 * clickable by sitting above it in the stacking order.
 */
export function TripCard({ trip, imageSizes, priority = false, className }: TripCardProps) {
  const href = tripPath(trip);
  const tags = buildTags(trip);

  return (
    <article
      className={cn(
        'bg-card relative flex h-full flex-col overflow-hidden rounded-md border border-slate-200 shadow-[0_2px_10px_rgb(0_0_0/0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_26px_rgb(0_0_0/0.13)] motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:shadow-black/30',
        className,
      )}
    >
      <div className="relative h-[210px] overflow-hidden">
        <OptimizedImage
          image={trip.heroImage}
          fill
          aspectRatio="auto"
          wrapperClassName="absolute inset-0 h-full"
          sizes={imageSizes ?? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'}
          priority={priority}
        />
        {trip.earlyBird && (
          <span className="bg-brand-500 absolute top-[22px] -right-[38px] z-[2] rotate-45 px-11 py-1.5 text-[11.5px] font-extrabold tracking-[0.06em] text-white uppercase shadow-[0_2px_8px_rgb(0_0_0/0.25)]">
            Early bird!
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-[22px] pt-5 pb-[22px]">
        <p className="text-[13px] text-slate-500 dark:text-slate-400">
          {trip.priceOnRequest ? (
            <span className="font-medium text-slate-700 dark:text-slate-300">Price on request</span>
          ) : (
            <>
              From{' '}
              <b className="text-brand-500 text-[21px] font-extrabold">
                {formatCurrency(trip.price.amount, trip.price.currency)}
              </b>
              {trip.price.originalAmount && (
                <s className="ml-1.5 text-slate-400">
                  {formatCurrency(trip.price.originalAmount, trip.price.currency)}
                </s>
              )}{' '}
              /person
            </>
          )}
        </p>

        <h3 className="text-[17px] leading-[1.35] font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-slate-50">
          {trip.title}
        </h3>

        <p className="text-[13.5px] text-slate-600 dark:text-slate-400">{trip.summary}</p>

        {tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
            {tags.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-[5px] rounded-[3px] border border-slate-200 bg-slate-50 px-[9px] py-1 text-[11.5px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
              >
                <Icon aria-hidden className="size-3.5 shrink-0" />
                {label}
              </li>
            ))}
          </ul>
        )}

        <Button
          asChild
          fullWidth
          className="mt-3.5 text-[12.5px] tracking-[0.07em] after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          <Link href={href}>View trip &amp; itinerary</Link>
        </Button>

        <p className="mt-3 text-center">
          {/* Sits above the stretched CTA overlay so it stays clickable. */}
          <Link
            href={`/custom-trips?trip=${trip.slug}`}
            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 relative z-[2] text-[13.5px] font-bold"
          >
            Enquire
          </Link>
        </p>
      </div>
    </article>
  );
}
