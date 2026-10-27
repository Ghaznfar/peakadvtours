import { Suspense } from 'react';
import { siteConfig } from '@/site.config';
import type { Destination, ImageRef, Trip } from '@/types/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { TripCard } from '@/components/TripCard';
import { TripResults } from '@/components/listing/TripResults';
import { TripResultsFromUrl } from '@/components/listing/TripResultsFromUrl';
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
   * expeditions split by altitude band. Empty groups are dropped,
   * and alternate bands are tinted so the sections read apart.
   */
  extraGroups?: Array<{
    /** Anchor id, so the section can be linked to (e.g. /expeditions#eight-thousanders). */
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
}

/**
 * Static shell shared by every listing route.
 *
 * The unfiltered first page is rendered on the server into the static HTML, so
 * it is crawlable and is what a visitor sees immediately; `TripResultsFromUrl`
 * then re-renders the same component in the browser with the real URL query, so
 * a shared or hand-built `/treks?difficulty=easy` link still shows the right
 * results. This split exists so the route needs no `searchParams` and can be
 * prerendered — see `TripResultsFromUrl` for why that matters on this plan.
 *
 * There is no filter UI here by design — it lives only on the homepage.
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
}: TripListingPageProps) {
  const destinationNames = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));

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

          <Suspense
            fallback={
              <TripResults
                trips={trips}
                destinationNames={destinationNames}
                basePath={basePath}
                searchParams={{}}
              />
            }
          >
            <TripResultsFromUrl
              trips={trips}
              destinationNames={destinationNames}
              basePath={basePath}
            />
          </Suspense>
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
