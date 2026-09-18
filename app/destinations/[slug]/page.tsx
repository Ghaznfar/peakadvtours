import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import { getAllTrips, getDestinationBySlug, getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { TripCard } from '@/components/TripCard';

type Params = { slug: string };

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return { title: 'Destination not found' };

  const title = destination.seo?.title ?? destination.name;
  const description = destination.seo?.description ?? destination.intro;
  return buildMetadata({ title, description, path: `/destinations/${slug}` });
}

export default async function DestinationDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const allTrips = await getAllTrips();
  const trips = allTrips.filter((t) => t.destinationSlugs.includes(slug));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.intro,
    url: `${siteConfig.url}/destinations/${slug}`,
    image: destination.heroImage?.src ? [destination.heroImage.src] : undefined,
  };

  return (
    <>
      <Container className="pt-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Destinations', href: '/destinations' },
            { label: destination.name },
          ]}
        />
      </Container>

      {/* Hero */}
      <div className="bg-brand-950 relative mt-4 flex min-h-[18rem] items-end overflow-hidden sm:min-h-[22rem]">
        <OptimizedImage
          image={destination.heroImage}
          fill
          aspectRatio="21 / 9"
          sizes="100vw"
          priority
          wrapperClassName="absolute inset-0 h-full"
          className="h-full"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/10"
        />
        <Container className="relative pb-8">
          {destination.region && (
            <p className="text-xs font-medium tracking-wider text-white/80 uppercase">
              {destination.region}
            </p>
          )}
          <h1 className="text-display mt-2 max-w-3xl text-white">{destination.name}</h1>
        </Container>
      </div>

      <Section spacing="md" ariaLabel={`${destination.name} overview`}>
        <Container>
          <p className="max-w-2xl text-slate-600">{destination.intro}</p>

          <h2 className="text-h2 mt-10">
            {trips.length > 0 ? `Trips in ${destination.name}` : 'No trips here yet'}
          </h2>

          {trips.length > 0 ? (
            <ul className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip, i) => (
                <li key={trip.slug}>
                  <TripCard trip={trip} priority={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-card mt-6 border border-dashed border-slate-300 p-10 text-center">
              <p className="text-slate-600">
                We don&rsquo;t have a trip listed for {destination.name} yet.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <CtaBanner
        heading="Can't find the right trip?"
        body="Tell us your dates, group size and budget and we'll build a custom day-by-day itinerary."
        primary={{ label: 'Plan a custom trip', href: '/custom-trips' }}
      />

      <JsonLd data={schema} />
    </>
  );
}
