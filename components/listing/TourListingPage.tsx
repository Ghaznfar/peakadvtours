import { siteConfig } from '@/site.config';
import type { ImageRef, Trip } from '@/types/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TripRow } from '@/components/TripCard/TripRow';
import { CustomTripRow } from '@/components/TripCard/CustomTripRow';
import { JsonLd } from '@/lib/seo/JsonLd';
import { ListingSidebar } from './ListingSidebar';

export interface TourListingGroup {
  eyebrow?: string;
  title: string;
  /** One or more intro paragraphs under the heading. */
  intro?: string[];
  trips: Trip[];
}

export interface TourListingPageProps {
  eyebrow?: string;
  title: string;
  heroImage?: ImageRef;
  breadcrumbLabel: string;
  /**
   * Ordered groups, each with its own heading — e.g. the main packages, then
   * the specialist safaris. Empty groups are dropped.
   */
  groups: TourListingGroup[];
}

/**
 * The `/tours` template: descriptive horizontal rows in a left column with a
 * sticky enquiry rail beside them.
 *
 * Separate from `TripListingPage` (the card-grid used by treks, expeditions and
 * the rest) because the shapes differ enough that one component with a `layout`
 * switch would be harder to follow than two.
 */
export function TourListingPage({
  eyebrow,
  title,
  heroImage,
  breadcrumbLabel,
  groups,
}: TourListingPageProps) {
  const visible = groups.filter((g) => g.trips.length > 0);
  const all = visible.flatMap((g) => g.trips);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    numberOfItems: all.length,
    itemListElement: all.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `${siteConfig.url}/tours/${t.slug}`,
    })),
  };

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} heroImage={heroImage} />

      <Section spacing="sm" ariaLabel={title}>
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: breadcrumbLabel }]} />

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px] lg:gap-12">
            <div className="flex flex-col gap-10">
              {visible.length === 0 ? (
                <p className="rounded-md border border-dashed border-slate-300 p-12 text-center text-slate-600 dark:border-slate-700 dark:text-slate-400">
                  We&rsquo;re adding trips to this page. Tell us what you&rsquo;re looking for and
                  we&rsquo;ll build it around your dates.
                </p>
              ) : (
                visible.map((group, gi) => (
                  <section key={group.title} aria-label={group.title}>
                    <SectionHeading
                      variant="display"
                      eyebrow={group.eyebrow}
                      title={group.title}
                      description={
                        group.intro && group.intro.length > 0 ? (
                          <>
                            {group.intro.map((p) => (
                              <p key={p.slice(0, 32)}>{p}</p>
                            ))}
                          </>
                        ) : undefined
                      }
                    />
                    <div className="mt-8 flex flex-col gap-[22px]">
                      {group.trips.map((trip, i) => (
                        <TripRow key={trip.slug} trip={trip} priority={gi === 0 && i < 2} />
                      ))}
                      {/* Closes the last group only, so it reads as the end of
                          the list rather than a divider between sections. */}
                      {gi === visible.length - 1 && <CustomTripRow />}
                    </div>
                  </section>
                ))
              )}
            </div>

            <ListingSidebar />
          </div>
        </Container>
      </Section>

      <JsonLd data={itemList} />
    </>
  );
}
