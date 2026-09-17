import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';
import type { TripCategory } from '@/types/content';
import { getTripBySlug, getTripSlugsByCategory } from '@/lib/content';
import { tripPath } from '@/lib/trips/href';

/** Static params for a category's detail route (`generateStaticParams`). */
export async function tripStaticParams(category: TripCategory): Promise<{ slug: string }[]> {
  const slugs = await getTripSlugsByCategory(category);
  return slugs.map((slug) => ({ slug }));
}

/**
 * Dynamic metadata for a trip detail page: title, description, canonical,
 * OpenGraph and Twitter card, with the hero as the social image.
 */
export async function tripMetadata(
  category: TripCategory,
  params: Promise<{ slug: string }>,
): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip || trip.category !== category) {
    return { title: 'Trip not found' };
  }

  const title = trip.seo?.title ?? `${trip.title} — ${trip.durationDays} days`;
  const description = trip.seo?.description ?? trip.summary;
  const canonical = tripPath(trip);
  const ogImage = trip.seo?.ogImage?.src ?? trip.heroImage.src;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${siteConfig.url}${canonical}`,
      images: [{ url: ogImage, alt: trip.heroImage.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: trip.seo?.noindex ? { index: false, follow: false } : undefined,
  };
}
