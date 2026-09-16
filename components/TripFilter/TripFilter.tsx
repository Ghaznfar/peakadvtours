'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Effort, Season, Trip, TripCategory } from '@/types/content';
import { TripCard } from '@/components/TripCard';
import { Button } from '@/components/ui/Button';

type TypeFilter = 'all' | TripCategory;
type EffortFilter = 'any' | Effort;
type SeasonFilter = 'any' | Season;
type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'altitude-desc' | 'duration-asc';

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tour', label: 'Tours' },
  { value: 'trek', label: 'Treks' },
  { value: 'expedition', label: 'Expeditions' },
];

const EFFORT_OPTIONS: { value: EffortFilter; label: string }[] = [
  { value: 'any', label: 'Any effort' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'serious', label: 'Serious' },
];

const SEASON_OPTIONS: { value: SeasonFilter; label: string }[] = [
  { value: 'any', label: 'Any season' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'winter', label: 'Winter' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'price-desc', label: 'Price (high to low)' },
  { value: 'altitude-desc', label: 'Altitude (high to low)' },
  { value: 'duration-asc', label: 'Length (short to long)' },
];

const selectClasses =
  'h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

export interface TripFilterProps {
  trips: Trip[];
  className?: string;
}

/**
 * Interactive "find your trip" filter/sort interface. Client island operating
 * over trips embedded at build time — no network. On the dedicated /trips page
 * (later phase) this state also syncs to the URL; here it is local.
 */
export function TripFilter({ trips, className }: TripFilterProps) {
  const [type, setType] = useState<TypeFilter>('all');
  const [effort, setEffort] = useState<EffortFilter>('any');
  const [season, setSeason] = useState<SeasonFilter>('any');
  const [sort, setSort] = useState<SortKey>('recommended');

  const results = useMemo(() => {
    const filtered = trips.filter((t) => {
      if (type !== 'all' && t.category !== type) return false;
      if (effort !== 'any' && t.effort !== effort) return false;
      if (season !== 'any' && !t.season.includes(season)) return false;
      return true;
    });

    const priceOf = (t: Trip) => (t.priceOnRequest ? Number.POSITIVE_INFINITY : t.price.amount);

    const sorted = [...filtered];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
        break;
      case 'altitude-desc':
        sorted.sort((a, b) => (b.maxAltitudeM ?? 0) - (a.maxAltitudeM ?? 0));
        break;
      case 'duration-asc':
        sorted.sort((a, b) => a.durationDays - b.durationDays);
        break;
      default:
        sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return sorted;
  }, [trips, type, effort, season, sort]);

  const resetFilters = () => {
    setType('all');
    setEffort('any');
    setSeason('any');
    setSort('recommended');
  };

  return (
    <div className={cn('', className)}>
      {/* Controls */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Type segmented control */}
          <div role="group" aria-label="Trip type" className="flex flex-wrap gap-1.5">
            {TYPE_OPTIONS.map((opt) => {
              const active = type === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(opt.value)}
                  className={cn(
                    'focus-visible:ring-brand-600 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                    active
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-700 ring-1 ring-slate-200 ring-inset hover:bg-slate-100',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Selects */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="filter-effort">
              Effort
            </label>
            <select
              id="filter-effort"
              className={selectClasses}
              value={effort}
              onChange={(e) => setEffort(e.target.value as EffortFilter)}
            >
              {EFFORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-season">
              Season
            </label>
            <select
              id="filter-season"
              className={selectClasses}
              value={season}
              onChange={(e) => setSeason(e.target.value as SeasonFilter)}
            >
              {SEASON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-sort">
              Sort by
            </label>
            <select
              id="filter-sort"
              className={selectClasses}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal aria-hidden className="size-4" />
          <span aria-live="polite">
            Showing {results.length} of {trips.length} trips
          </span>
        </p>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((trip) => (
            <li key={trip.slug}>
              <TripCard trip={trip} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-card mt-8 border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-600">No trips match those filters yet.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
