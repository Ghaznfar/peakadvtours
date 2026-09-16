import Link from 'next/link';
import { getFeaturedTrips } from '@/lib/content';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { TripCard } from '@/components/TripCard';

/**
 * Placeholder home page. It exists to prove the foundation (layout, tokens,
 * primitives, content repository, images) works end-to-end. The real home
 * sections are built in Phase 4.
 */
export default async function HomePage() {
  const featured = await getFeaturedTrips();

  return (
    <>
      {/* Hero */}
      <Section spacing="lg" ariaLabel="Introduction" className="bg-brand-950 text-white">
        <Container size="lg" className="text-center">
          <p className="text-brand-200 text-sm font-medium tracking-widest uppercase">
            Placeholder foundation
          </p>
          <h1 className="text-display mt-4 text-white">{siteConfig.tagline}</h1>
          <p className="text-lead text-brand-50/90 mx-auto mt-5 max-w-2xl">
            {siteConfig.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href="/trips">Find your trip</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/customize">Build a custom trip</Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Featured trips — demonstrates the reusable TripCard */}
      <Section ariaLabel="Featured trips">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-h2">Featured trips</h2>
              <p className="mt-2 text-slate-600">
                Sample placeholder trips rendered from the content repository.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/trips">View all</Link>
            </Button>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((trip, i) => (
              <li key={trip.slug}>
                <TripCard trip={trip} priority={i === 0} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBanner
        heading="Your dates, your route"
        body="Nothing here fits? Tell us where you want to go and we build a custom day-by-day itinerary."
        primary={{ label: 'Start an itinerary', href: '/customize' }}
        whatsAppMessage={`Hi ${siteConfig.name}, I'd like to plan a custom trip.`}
      />
    </>
  );
}
