import {
  getCategories,
  getCredentials,
  getDestinations,
  getFeaturedDestinations,
  getFeaturedTrips,
  getStats,
  getTeam,
  getTestimonials,
  getAllTrips,
  getValueProps,
} from '@/lib/content';
import { siteConfig } from '@/site.config';
import type { TripCategory } from '@/types/content';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { Hero } from '@/components/sections/Hero';
import { CategoryCards, type CategoryCardVM } from '@/components/sections/CategoryCards';
import { FeaturedTrips } from '@/components/sections/FeaturedTrips';
import { FindYourTrip } from '@/components/sections/FindYourTrip';
import { DestinationShowcase } from '@/components/sections/DestinationShowcase';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Stats } from '@/components/sections/Stats';
import { Team } from '@/components/sections/Team';
import { Testimonials } from '@/components/sections/Testimonials';
import { Credentials } from '@/components/sections/Credentials';
import { Enquiry } from '@/components/sections/Enquiry';

const CATEGORY_ICON: Record<TripCategory, string> = {
  tour: 'compass',
  trek: 'footprints',
  expedition: 'mountain-snow',
};

/** Homepage — composes the marketing sections from the content repository. */
export default async function HomePage() {
  const [
    categories,
    allTrips,
    featuredTrips,
    destinations,
    featuredDestinations,
    valueProps,
    stats,
    team,
    testimonials,
    credentials,
  ] = await Promise.all([
    getCategories(),
    getAllTrips(),
    getFeaturedTrips(6),
    getDestinations(),
    getFeaturedDestinations(4),
    getValueProps(),
    getStats(),
    getTeam(),
    getTestimonials(3),
    getCredentials(),
  ]);

  // Derive category cards (counts + "from" price) from the trips themselves.
  const categoryVMs: CategoryCardVM[] = categories.map((cat) => {
    const catTrips = allTrips.filter((t) => t.category === cat.key);
    const prices = catTrips.filter((t) => !t.priceOnRequest).map((t) => t.price.amount);
    return {
      key: cat.key,
      label: cat.label,
      pluralLabel: cat.pluralLabel,
      slug: cat.slug,
      intro: cat.intro,
      icon: CATEGORY_ICON[cat.key],
      count: catTrips.length,
      fromAmount: prices.length > 0 ? Math.min(...prices) : undefined,
      currency: siteConfig.defaultCurrency,
    };
  });

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  const heroChips = categories.map((c) => ({ label: c.pluralLabel, href: `/${c.slug}` }));

  return (
    <>
      <Hero
        eyebrow={`Since ${siteConfig.foundedYear}`}
        title="Small-group adventures, planned by people who walk the routes"
        subtitle={siteConfig.description}
        primary={{ label: 'Find your trip', href: '/trips' }}
        secondary={{ label: 'Build a custom trip', href: '/custom-trips' }}
        chips={heroChips}
      />

      <CategoryCards categories={categoryVMs} />

      <FeaturedTrips trips={featuredTrips} />

      <FindYourTrip trips={allTrips} />

      <DestinationShowcase destinations={featuredDestinations} />

      <CtaBanner
        heading="Your dates, your route"
        body="Nothing here fits? Tell us where you want to go and we build a custom day-by-day itinerary within 24 hours — no deposit to see one."
        primary={{ label: 'Start an itinerary', href: '/custom-trips' }}
        whatsAppMessage={`Hi ${siteConfig.name}, I'd like to plan a custom trip.`}
      />

      <WhyChooseUs valueProps={valueProps} />

      <Stats stats={stats} />

      <Team members={team} />

      <Testimonials testimonials={testimonials} />

      <Credentials credentials={credentials} />

      <Enquiry destinationOptions={destinationOptions} />
    </>
  );
}
