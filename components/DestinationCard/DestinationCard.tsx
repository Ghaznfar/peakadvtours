import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Destination } from '@/types/content';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface DestinationCardProps {
  destination: Destination;
  /** Larger, taller card for a lead/featured position. */
  featured?: boolean;
  imageSizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Image-led destination tile with a gradient scrim for legible overlaid text.
 * The whole card is a single link (no nested interactive elements).
 */
export function DestinationCard({
  destination,
  featured = false,
  imageSizes,
  priority = false,
  className,
}: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        'group rounded-card focus-visible:ring-ring relative flex overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
    >
      <OptimizedImage
        image={destination.heroImage}
        fill
        aspectRatio={featured ? '4 / 5' : '4 / 3'}
        sizes={imageSizes ?? '(max-width: 768px) 100vw, 33vw'}
        priority={priority}
        className="transition-transform duration-500 group-hover:scale-105"
        wrapperClassName="w-full"
      />
      {/* Legibility scrim */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        {destination.region && (
          <p className="text-xs font-medium tracking-wider text-white/80 uppercase">
            {destination.region}
          </p>
        )}
        <h3 className="font-display mt-1 text-xl font-semibold text-white">{destination.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/85">{destination.intro}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white">
          {typeof destination.tripCount === 'number' ? `${destination.tripCount} trips` : 'Explore'}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
