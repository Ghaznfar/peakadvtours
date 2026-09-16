'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  CATEGORY_VALUES,
  DIFFICULTY_VALUES,
  DURATION_LABELS,
  DURATION_VALUES,
  SEASON_VALUES,
  SORT_LABELS,
  SORT_VALUES,
  activeFilterCount,
  serializeTripQuery,
  type TripQuery,
} from '@/lib/trips/filters';

const selectClasses =
  'h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600';

const CATEGORY_LABEL: Record<string, string> = {
  tour: 'Tours',
  trek: 'Treks',
  expedition: 'Expeditions',
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface TripFilterControlsProps {
  /** Current committed query (parsed from the URL on the server). */
  query: TripQuery;
  /** Total results for the current query (for the count label). */
  resultCount: number;
  destinationOptions: { slug: string; name: string }[];
  showTypeFilter?: boolean;
  basePath: string;
}

/**
 * Presentational-ish client controls for the listing. State lives in the URL:
 * every change pushes a new query string, so the server re-renders the filtered
 * results. Receives the current query as props (no `useSearchParams`), so the
 * page stays server-rendered/crawlable and needs no Suspense boundary.
 */
export function TripFilterControls({
  query,
  resultCount,
  destinationOptions,
  showTypeFilter = false,
  basePath,
}: TripFilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Push a new URL built from the current query plus one changed field.
  // Omitting `page` resets pagination whenever a filter changes.
  const navigate = useCallback(
    (next: Partial<TripQuery>, replace = false) => {
      const merged = { ...query, ...next };
      const qs = serializeTripQuery(merged).toString();
      const href = qs ? `${pathname}?${qs}` : pathname;
      if (replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [query, pathname, router],
  );

  // Local search text for instant typing; committed to the URL (debounced).
  const [searchText, setSearchText] = useState(query.q ?? '');
  useEffect(() => {
    const handle = setTimeout(() => {
      const trimmed = searchText.trim();
      if ((query.q ?? '') !== trimmed) navigate({ q: trimmed || undefined }, true);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchText, query.q, navigate]);

  const nActive = activeFilterCount(query);

  const chips: { key: string; label: string; onClear: () => void }[] = [];
  if (query.type)
    chips.push({
      key: 'type',
      label: CATEGORY_LABEL[query.type] ?? query.type,
      onClear: () => navigate({ type: undefined }),
    });
  if (query.difficulty)
    chips.push({
      key: 'difficulty',
      label: capitalize(query.difficulty),
      onClear: () => navigate({ difficulty: undefined }),
    });
  if (query.season)
    chips.push({
      key: 'season',
      label: capitalize(query.season),
      onClear: () => navigate({ season: undefined }),
    });
  if (query.destination) {
    const name =
      destinationOptions.find((d) => d.slug === query.destination)?.name ?? query.destination;
    chips.push({
      key: 'destination',
      label: name,
      onClear: () => navigate({ destination: undefined }),
    });
  }
  if (query.duration)
    chips.push({
      key: 'duration',
      label: DURATION_LABELS[query.duration],
      onClear: () => navigate({ duration: undefined }),
    });
  if (query.q)
    chips.push({
      key: 'q',
      label: `“${query.q}”`,
      onClear: () => {
        setSearchText('');
        navigate({ q: undefined });
      },
    });

  const clearAll = () => {
    setSearchText('');
    router.push(basePath, { scroll: false });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <label htmlFor="trip-search" className="sr-only">
            Search trips
          </label>
          <input
            id="trip-search"
            type="search"
            placeholder="Search trips, destinations…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="focus-visible:ring-brand-600 h-11 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
        <div>
          <label htmlFor="trip-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="trip-sort"
            className={cn(selectClasses, 'w-full sm:w-56')}
            value={query.sort}
            onChange={(e) => navigate({ sort: e.target.value as TripQuery['sort'] })}
          >
            {SORT_VALUES.map((s) => (
              <option key={s} value={s}>
                {SORT_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        {showTypeFilter && (
          <>
            <label htmlFor="filter-type" className="sr-only">
              Trip type
            </label>
            <select
              id="filter-type"
              className={selectClasses}
              value={query.type ?? ''}
              onChange={(e) =>
                navigate({ type: (e.target.value || undefined) as TripQuery['type'] })
              }
            >
              <option value="">All types</option>
              {CATEGORY_VALUES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="filter-difficulty" className="sr-only">
          Difficulty
        </label>
        <select
          id="filter-difficulty"
          className={selectClasses}
          value={query.difficulty ?? ''}
          onChange={(e) =>
            navigate({ difficulty: (e.target.value || undefined) as TripQuery['difficulty'] })
          }
        >
          <option value="">Any difficulty</option>
          {DIFFICULTY_VALUES.map((d) => (
            <option key={d} value={d}>
              {capitalize(d)}
            </option>
          ))}
        </select>

        <label htmlFor="filter-season" className="sr-only">
          Season
        </label>
        <select
          id="filter-season"
          className={selectClasses}
          value={query.season ?? ''}
          onChange={(e) =>
            navigate({ season: (e.target.value || undefined) as TripQuery['season'] })
          }
        >
          <option value="">Any season</option>
          {SEASON_VALUES.map((s) => (
            <option key={s} value={s}>
              {capitalize(s)}
            </option>
          ))}
        </select>

        {destinationOptions.length > 0 && (
          <>
            <label htmlFor="filter-destination" className="sr-only">
              Destination
            </label>
            <select
              id="filter-destination"
              className={selectClasses}
              value={query.destination ?? ''}
              onChange={(e) => navigate({ destination: e.target.value || undefined })}
            >
              <option value="">Any destination</option>
              {destinationOptions.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </>
        )}

        <label htmlFor="filter-duration" className="sr-only">
          Duration
        </label>
        <select
          id="filter-duration"
          className={selectClasses}
          value={query.duration ?? ''}
          onChange={(e) =>
            navigate({ duration: (e.target.value || undefined) as TripQuery['duration'] })
          }
        >
          <option value="">Any length</option>
          {DURATION_VALUES.map((d) => (
            <option key={d} value={d}>
              {DURATION_LABELS[d]}
            </option>
          ))}
        </select>
      </div>

      {/* Count + active chips */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-slate-200 pt-3">
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <SlidersHorizontal aria-hidden className="size-4" />
          <span aria-live="polite" role="status">
            {resultCount} {resultCount === 1 ? 'trip' : 'trips'}
          </span>
        </p>
        {chips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={chip.onClear}
            className="bg-brand-100 text-brand-800 hover:bg-brand-200 focus-visible:ring-brand-600 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
          >
            {chip.label}
            <X aria-hidden className="size-3.5" />
            <span className="sr-only">Remove filter</span>
          </button>
        ))}
        {(nActive > 0 || searchText) && (
          <button
            type="button"
            onClick={clearAll}
            className="hover:text-brand-700 text-xs font-medium text-slate-500 underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
