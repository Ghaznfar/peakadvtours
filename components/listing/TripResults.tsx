import Link from 'next/link';
import type { Trip } from '@/types/content';
import {
  PAGE_SIZE,
  filterAndSortTrips,
  parsePage,
  parseTripQuery,
  serializeTripQuery,
  type ParamsInput,
} from '@/lib/trips/filters';
import { Button } from '@/components/ui/Button';
import { TripCard, CustomTripCard } from '@/components/TripCard';

export interface TripResultsProps {
  /** Full set for this page (already scoped by category/tag). */
  trips: Trip[];
  /** slug -> display name, so the free-text search can match a destination. */
  destinationNames: Record<string, string>;
  /** Canonical path for this listing (e.g. "/tours") — used for clear/reset. */
  basePath: string;
  /** The query to apply. `{}` renders the default, unnarrowed first page. */
  searchParams: ParamsInput;
}

/**
 * The results grid for a listing route: filter, sort, paginate, render.
 *
 * Deliberately a plain function with no hooks and no server-only imports, so
 * the identical component renders in both graphs — on the server for the static
 * HTML (crawlable, and what the Suspense fallback shows), and on the client via
 * `TripResultsFromUrl` once the real URL query is readable. Keeping one
 * component for both is what stops the two renders from drifting apart.
 */
export function TripResults({ trips, destinationNames, basePath, searchParams }: TripResultsProps) {
  // The filter UI lives only on the homepage; these listings show everything.
  // The query is still parsed so a shared or hand-built URL like
  // `/tours?effort=easy&sort=price-asc` keeps working, and so pagination does.
  const query = parseTripQuery(searchParams);
  const page = parsePage(searchParams);

  const results = filterAndSortTrips(trips, query, destinationNames);
  const shown = results.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < results.length;

  // True when the URL actually narrowed the list — decides which empty state
  // to show, since "clear your filters" is nonsense without a filter UI.
  const isNarrowed = serializeTripQuery(query).toString().length > 0;

  // Build the "load more" href: same query, next page.
  const nextParams = serializeTripQuery(query);
  nextParams.set('page', String(page + 1));
  const loadMoreHref = `${basePath}?${nextParams.toString()}`;

  return (
    <div className="mt-10">
      {results.length > 0 ? (
        <>
          <ul className="mt-8 grid grid-cols-1 gap-[26px] md:grid-cols-2 lg:grid-cols-3">
            {shown.map((trip, i) => (
              <li key={trip.slug}>
                <TripCard trip={trip} priority={i < 3} />
              </li>
            ))}
            {/* Closing promo card. Deliberately not a CMS document: it has
                no duration or price (both of which a trip requires), its
                button goes to the enquiry funnel rather than a detail
                page, and as a trip it would inflate every trip count on
                the site. Only shown on the last page of results. */}
            {!hasMore && (
              <li>
                <CustomTripCard />
              </li>
            )}
          </ul>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <Button asChild variant="outline" size="lg">
                {/* Cumulative pagination via ?page — shareable, no JS needed.
                    On a static page this is a client-side navigation: the URL
                    changes, `useSearchParams` updates and this component
                    re-renders in the browser, so no server render happens. */}
                <Link href={loadMoreHref} scroll={false} replace>
                  Load more ({results.length - shown.length} more)
                </Link>
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Two different empty states: a narrowed URL can be widened, but
           with no filter UI the usual case is simply "nothing here yet",
           where offering to clear filters would only confuse. */
        <div className="rounded-card mt-8 border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            {isNarrowed ? 'No trips match' : 'Nothing here just yet'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {isNarrowed
              ? 'Try widening your search, or tell us what you’re looking for and we’ll build it.'
              : 'We’re adding trips to this page. In the meantime, tell us what you’re looking for and we’ll build it around your dates.'}
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            {isNarrowed && (
              <Button asChild variant="outline">
                <Link href={basePath} scroll={false}>
                  Show all
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/custom-trips">Plan a custom trip</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
