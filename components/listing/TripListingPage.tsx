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
import { TripCard } from '@/components/TripCard';
import { TripFilterControls } from '@/components/TripListing';
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
  destinations: Destination[];
  showTypeFilter?: boolean;
  breadcrumbLabel: string;
  /** Canonical path for this listing (e.g. "/tours") — used for clear/reset. */
  basePath: string;
  /** Raw URL search params (resolved) — filtering happens server-side for SEO. */
  searchParams: ParamsInput;
}

/**
 * Server shell shared by every listing route. Filtering, sorting, search and
 * pagination all run on the server from the URL query, so results are rendered
 * into the HTML (crawlable) and shared/refreshed/direct URLs show the right
 * results immediately. The interactive controls are a thin client component.
 */
export function TripListingPage({
  eyebrow,
  title,
  heroImage,
  sectionEyebrow,
  sectionTitle,
  description,
  trips,
  destinations,
  showTypeFilter = false,
  breadcrumbLabel,
  basePath,
  searchParams,
}: TripListingPageProps) {
  const query = parseTripQuery(searchParams);
  const page = parsePage(searchParams);

  const destinationNames = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
  const present = new Set(trips.flatMap((t) => t.destinationSlugs));
  const destinationOptions = destinations
    .filter((d) => present.has(d.slug))
    .map((d) => ({ slug: d.slug, name: d.name }));

  const results = filterAndSortTrips(trips, query, destinationNames);
  const shown = results.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < results.length;

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
            <TripFilterControls
              query={query}
              resultCount={results.length}
              destinationOptions={destinationOptions}
              showTypeFilter={showTypeFilter}
              basePath={basePath}
            />

            {results.length > 0 ? (
              <>
                <ul className="mt-8 grid grid-cols-1 gap-[26px] md:grid-cols-2 lg:grid-cols-3">
                  {shown.map((trip, i) => (
                    <li key={trip.slug}>
                      <TripCard trip={trip} priority={i < 3} />
                    </li>
                  ))}
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
              <div className="rounded-card mt-8 border border-dashed border-slate-300 p-12 text-center">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  No trips match
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Try removing a filter, or tell us what you&rsquo;re looking for and we&rsquo;ll
                  build it.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild variant="outline">
                    <Link href={basePath} scroll={false}>
                      Clear filters
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/custom-trips">Plan a custom trip</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <CtaBanner
        heading="Can't find the right trip?"
        body="Tell us your dates, group size and budget and we'll build a custom day-by-day itinerary."
        primary={{ label: 'Plan a custom trip', href: '/custom-trips' }}
      />

      <JsonLd data={itemList} />
    </>
  );
}
