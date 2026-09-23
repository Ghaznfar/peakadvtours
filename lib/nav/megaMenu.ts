import { siteConfig } from '@/site.config';
import { getBlogPosts, getTripsByCategory, getTripsByTag } from '@/lib/content';
import { tripPath } from '@/lib/trips/href';
import type { Trip, TripCategory } from '@/types/content';
import type { MegaMenuItem, MegaMenuTile } from '@/components/layout/MegaMenu';

/** Which nav href gets its image tiles from which trip category. */
const CATEGORY_BY_HREF: Record<string, TripCategory> = {
  '/tours': 'tour',
  '/treks': 'trek',
  '/expeditions': 'expedition',
};

const MAX_TILES = 12;

/** Corporate retreats is a curated view of tagged trips (SITE_ARCHITECTURE §1). */
const CORPORATE_TAG = 'corporate';

function tripTiles(trips: Trip[]): MegaMenuTile[] {
  return trips.slice(0, MAX_TILES).map((trip) => ({
    title: trip.title,
    href: tripPath(trip),
    src: trip.heroImage.src,
    alt: trip.heroImage.alt,
  }));
}

/**
 * Builds the desktop mega-menu view-model: nav structure from
 * `site.config.ts`, image tiles from the CMS (trips per category, plus recent
 * blog posts). Called from the root layout — the `MegaMenu` component itself
 * stays presentational and never touches the content layer.
 */
export async function buildMegaMenu(): Promise<MegaMenuItem[]> {
  const [tours, treks, expeditions, retreats, posts] = await Promise.all([
    getTripsByCategory('tour'),
    getTripsByCategory('trek'),
    getTripsByCategory('expedition'),
    getTripsByTag(CORPORATE_TAG),
    getBlogPosts(),
  ]);

  const tilesByCategory: Record<TripCategory, MegaMenuTile[]> = {
    tour: tripTiles(tours),
    trek: tripTiles(treks),
    expedition: tripTiles(expeditions),
  };

  const blogTiles: MegaMenuTile[] = posts.slice(0, MAX_TILES).map((post) => ({
    title: post.title,
    href: `/blog/${post.slug}`,
    src: post.coverImage.src,
    alt: post.coverImage.alt,
  }));

  const retreatTiles = tripTiles(retreats);

  return siteConfig.nav.map((item) => {
    const category = CATEGORY_BY_HREF[item.href];
    const tiles = category
      ? tilesByCategory[category]
      : item.href === '/blog'
        ? blogTiles
        : item.href === '/corporate-retreats'
          ? retreatTiles
          : [];

    return {
      label: item.label,
      href: item.href,
      ...(tiles.length > 0 ? { tiles } : {}),
      ...(item.children?.length
        ? { links: item.children.map((c) => ({ label: c.label, href: c.href })) }
        : {}),
    };
  });
}
