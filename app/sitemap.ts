import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';
import { getAllTrips, getBlogPosts, getDestinations } from '@/lib/content';
import { tripPath } from '@/lib/trips/href';

/**
 * Generated XML sitemap built from the content repository. Static marketing
 * routes + every published trip. Extend with destinations/blog in later phases.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/tours',
    '/treks',
    '/expeditions',
    '/festivals',
    '/trips',
    '/custom-trips',
    '/destinations',
    '/corporate-retreats',
    '/about',
    '/contact',
    '/blog',
    '/booking-info',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));

  const trips = await getAllTrips();
  const tripRoutes: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: `${base}${tripPath(trip)}`,
    lastModified: new Date(trip.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const destinations = await getDestinations();
  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((destination) => ({
    url: `${base}/destinations/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const posts = await getBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...tripRoutes, ...destinationRoutes, ...blogRoutes];
}
