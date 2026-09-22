import Link from 'next/link';
import { getDestinations, getAllTrips } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { tripPath } from '@/lib/trips/href';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = buildMetadata({
  title: 'Sitemap',
  description: 'Every page on this site, grouped by section.',
  path: '/sitemap',
});

export default async function SitemapPage() {
  const [trips, destinations] = await Promise.all([getAllTrips(), getDestinations()]);

  const groups: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: 'Explore',
      links: [
        { label: 'Tours', href: '/tours' },
        { label: 'Treks', href: '/treks' },
        { label: 'Expeditions', href: '/expeditions' },
        { label: 'Festivals', href: '/festivals' },
        { label: 'All trips', href: '/trips' },
        { label: 'Corporate retreats', href: '/corporate-retreats' },
        { label: 'Custom trips', href: '/custom-trips' },
      ],
    },
    {
      heading: 'Destinations',
      links: destinations.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` })),
    },
    {
      heading: 'Company',
      links: [
        { label: 'About us', href: '/about' },
        { label: 'Blog & news', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'Booking info', href: '/booking-info' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Booking terms', href: '/terms' },
        { label: 'Privacy policy', href: '/privacy' },
      ],
    },
    {
      heading: 'All trips',
      links: trips.map((trip) => ({ label: trip.title, href: tripPath(trip) })),
    },
  ];

  return (
    <Section spacing="sm" ariaLabel="Sitemap">
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Sitemap' }]} />
        <h1 className="text-h1 mt-4">Sitemap</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          Every page on this site, grouped by section.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {group.heading}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-brand-700 dark:text-brand-400 text-sm hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
