import Link from 'next/link';
import { siteConfig } from '@/site.config';
import type { Destination, ImageRef, Trip } from '@/types/content';
import {
  PAGE_SIZE,
  filterAndSortTrips,
  parsePage,
  parseTripQuery,
  serializeTripQuery,
  type ParamsInput,
} from '@/lib/trips/filters';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { TripCard, CustomTripCard } from '@/components/TripCard';
import { JsonLd } from '@/lib/seo/JsonLd';

export interface TripListingPageProps {
  /** Script-font line in the page banner (e.g. "Boots on"). */
  eyebrow?: string;
  /** Banner <h1> — fixed per route, not from the CMS. */
  title: string;
  /** Banner photograph. Falls back to a flat brand panel when absent. */
  heroImage?: ImageRef;
  /** Script-font line above the grid heading (e.g. "The Karakoram classics"). */
  sectionEyebrow?: string;
  /** <h2> above the grid — fixed per route, not from the CMS. */
  sectionTitle: string;
  /** Intro paragraph under the grid heading. */
  description: string;
  /** Full set for this page (already scoped by category/tag). */
  trips: Trip[];
  /**
   * Further separately-headed grids below the main one, in order. Used where a
   * page covers distinct groups a single list would blur together — Pakistan
   * treks vs Nepal, or expeditions by altitude band. Empty groups are dropped,
   * and alternate bands are tinted so the sections read apart.
   */
  extraGroups?: Array<{
    /** Anchor id, so the section can be linked to (e.g. /treks#nepal). */
    id?: string;
    eyebrow?: string;
    title: string;
    description?: string;
    trips: Trip[];
  }>;
  destinations: Destination[];
  breadcrumbLabel: string;
  /** Canonical path for this listing (e.g. "/tours") — used for clear/reset. */
  basePath: string;
  /** Raw URL search params (resolved) — filtering happens server-side for SEO. */
  searchParams: ParamsInput;
}

/**
 * Server shell shared by every listing route. Sorting, filtering and pagination
 * all run on the server from the URL query, so results are rendered into the
 * HTML (crawlable) and a shared or refreshed URL shows the right results
 * immediately.
 *
 * There is no filter UI here by design — it lives only on the homepage. The
 * query is still honoured so hand-built and shared links keep working.
 */
export function TripListingPage({
  eyebrow,
  title,
  heroImage,
  sectionEyebrow,
  sectionTitle,
  description,
  trips,
  extraGroups = [],
  destinations,
  breadcrumbLabel,
  basePath,
  searchParams,
}: TripListingPageProps) {
  // The filter UI lives only on the homepage; these listings show everything.
  // The query is still parsed so a shared or hand-built URL like
  // `/tours?effort=easy&sort=price-asc` keeps working, and so pagination does.
  const query = parseTripQuery(searchParams);
  const page = parsePage(searchParams);

  const destinationNames = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
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

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: trips.length,
    itemListElement: trips.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${siteConfig.url}/trips/${t.slug}`,
    })),
  };

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} heroImage={heroImage} />

      <Section spacing="sm" ariaLabel={sectionTitle}>
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: breadcrumbLabel }]} />

          <SectionHeading
            variant="display"
            align="center"
            eyebrow={sectionEyebrow}
            title={sectionTitle}
            description={description}
            className="mt-6"
          />

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
                      {/* Cumulative pagination via ?page — shareable, no JS needed. */}
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
        </Container>
      </Section>

      {extraGroups
        .filter((g) => g.trips.length > 0)
        .map((group, i) => (
          <Section
            key={group.title}
            id={group.id}
            ariaLabel={group.title}
            className={i % 2 === 0 ? 'bg-slate-50 dark:bg-[#0d1117]' : undefined}
          >
            <Container>
              <SectionHeading
                variant="display"
                align="center"
                eyebrow={group.eyebrow}
                title={group.title}
                description={group.description}
              />
              <ul className="mt-10 grid grid-cols-1 gap-[26px] md:grid-cols-2 lg:grid-cols-3">
                {group.trips.map((trip) => (
                  <li key={trip.slug}>
                    <TripCard
                      trip={trip}
                      imageSizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        ))}

      <CtaBanner
        heading="Can't find the right trip?"
        body="Tell us your dates, group size and budget and we'll build a custom day-by-day itinerary."
        primary={{ label: 'Plan a custom trip', href: '/custom-trips' }}
      />

      <JsonLd data={itemList} />
    </>
  );
}
