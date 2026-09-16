import Link from 'next/link';
import { CalendarDays, Gauge, Mountain, Sun } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Trip, TripCategory, Difficulty, Season } from '@/types/content';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Price } from '@/components/ui/Price';

const CATEGORY_LABEL: Record<TripCategory, string> = {
  tour: 'Tour',
  trek: 'Trek',
  expedition: 'Expedition',
};

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

export interface TripCardProps {
  trip: Trip;
  /** Hint next/image for correct srcset in the grid it lives in. */
  imageSizes?: string;
  /** Prioritise the image (first row, above the fold only). */
  priority?: boolean;
  className?: string;
}

/**
 * The reusable trip card — renders any tour, trek or expedition. Category only
 * changes the badge and which quick-facts are emphasised (altitude for
 * treks/expeditions). Presentational: receives a fully-formed `Trip`.
 */
export function TripCard({ trip, imageSizes, priority = false, className }: TripCardProps) {
  const href = `/trips/${trip.slug}`;
  const showAltitude = trip.category !== 'tour' && typeof trip.maxAltitudeM === 'number';
  const seasonText = trip.seasonNote ?? trip.season.map((s) => SEASON_LABEL[s]).join(', ');

  return (
    <article
      className={cn(
        'group rounded-card flex flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="relative">
        <OptimizedImage
          image={trip.heroImage}
          fill
          aspectRatio="16 / 10"
          sizes={imageSizes ?? '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge tone="brand">{CATEGORY_LABEL[trip.category]}</Badge>
          {trip.earlyBird && <Badge tone="accent">Early bird</Badge>}
          {trip.badge && <Badge tone="outline">{trip.badge}</Badge>}
        </div>
        {showAltitude && (
          <Badge tone="outline" className="absolute top-3 right-3">
            {trip.maxAltitudeM?.toLocaleString()} m
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-h3">
          <Link href={href} className="hover:text-brand-700">
            {trip.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{trip.summary}</p>

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-1.5">
            <CalendarDays aria-hidden className="text-brand-600 size-4" />
            <dt className="sr-only">Duration</dt>
            <dd>{trip.durationDays} days</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge aria-hidden className="text-brand-600 size-4" />
            <dt className="sr-only">Difficulty</dt>
            <dd>{DIFFICULTY_LABEL[trip.difficulty]}</dd>
          </div>
          {showAltitude && (
            <div className="flex items-center gap-1.5">
              <Mountain aria-hidden className="text-brand-600 size-4" />
              <dt className="sr-only">Maximum altitude</dt>
              <dd>{trip.maxAltitudeM?.toLocaleString()} m</dd>
            </div>
          )}
          {seasonText && (
            <div className="flex items-center gap-1.5">
              <Sun aria-hidden className="text-brand-600 size-4" />
              <dt className="sr-only">Season</dt>
              <dd>{seasonText}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          {trip.priceOnRequest ? (
            <span className="text-sm font-medium text-slate-700">Price on request</span>
          ) : (
            <Price price={trip.price} />
          )}
          <div className="flex gap-2">
            {/* Enquire link carries the trip context to the enquiry funnel. */}
            <Button asChild variant="outline" size="sm">
              <Link href={`/custom-trips?trip=${trip.slug}`}>Enquire</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href={href}>Itinerary</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
