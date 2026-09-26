import Link from 'next/link';
import type { Trip, TripCategory } from '@/types/content';
import { tripPath } from '@/lib/trips/href';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { CATEGORY_COLOUR, CATEGORY_PLURAL, toPoints, type TripPoint } from './points';
import { TripMapLoader } from './TripMapLoader';

/** Categories in legend order. Only those actually on the map are shown. */
const LEGEND_ORDER: TripCategory[] = ['tour', 'trek', 'expedition', 'corporate'];

export interface TripMapProps {
  trips: Trip[];
}

/** Sentence describing the spread, built from the plotted trips themselves. */
function summarise(points: TripPoint[]): string {
  const altitudes = points.map((p) => p.maxAltitudeM).filter((a): a is number => Boolean(a));
  const count = points.length;
  if (altitudes.length === 0) {
    return `All ${count} of them, plotted where they actually run. The bigger the dot, the higher the trip goes.`;
  }
  const low = Math.min(...altitudes).toLocaleString();
  const high = Math.max(...altitudes).toLocaleString();
  return `All ${count} of them, plotted where they run — from the Kalash valleys in the Hindu Kush to the Khumbu in Nepal, and from ${low} m to ${high} m at the high point. The bigger the dot, the higher the trip goes.`;
}

/**
 * "Our range, on the map" — every trip in the catalogue as a dot, coloured by
 * category and sized by how high it goes.
 *
 * The full list is rendered as real links beneath the map, visually hidden.
 * The catalogue is content, not decoration, so it must not exist only inside a
 * canvas: this keeps it reachable by screen readers, by search engines and by
 * anyone the map fails for.
 */
export function TripMap({ trips }: TripMapProps) {
  const points = toPoints(trips);
  if (points.length === 0) return null;

  const present = LEGEND_ORDER.filter((c) => points.some((p) => p.category === c));

  return (
    <Section ariaLabel="Our range, on the map" className="bg-slate-50 dark:bg-[#0d1117]">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgb(0_0_0/0.06)] dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_1fr]">
            <div className="p-7 lg:p-9">
              <p className="text-[12.5px] font-bold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                Where the trips actually are
              </p>
              <h2 className="mt-2 text-[clamp(22px,2.4vw,30px)] leading-tight font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-white">
                Our range, on the map
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-slate-600 dark:text-slate-400">
                {summarise(points)}
              </p>

              <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                {present.map((category) => (
                  <li
                    key={category}
                    className="flex items-center gap-2 text-[12.5px] font-bold tracking-[0.08em] text-slate-600 uppercase dark:text-slate-300"
                  >
                    <span
                      aria-hidden
                      className="inline-block size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLOUR[category] }}
                    />
                    {CATEGORY_PLURAL[category]}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-h-[420px] lg:min-h-[520px]">
              <TripMapLoader points={points} />
            </div>
          </div>
        </div>

        {/* The catalogue in text, for screen readers and for crawlers. */}
        <ul className="sr-only">
          {points.map((point) => (
            <li key={point.slug}>
              <Link href={tripPath({ slug: point.slug, category: point.category })}>
                {point.title}
              </Link>{' '}
              — {point.place}
              {point.maxAltitudeM ? `, up to ${point.maxAltitudeM.toLocaleString()} m` : ''}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
