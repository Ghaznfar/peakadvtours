import type { PageContent } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { PAGE_BY_SLUG } from '@/sanity/queries';
import { pages as localPages } from './pages.data';

/**
 * Editable marketing page content by route slug ("Pages" in Sanity Studio).
 * Falls back to local placeholder copy when Sanity is unconfigured or the
 * document hasn't been created yet, so routes never render empty.
 */
export async function getPageBySlug(slug: string): Promise<PageContent | undefined> {
  const fallback = localPages.find((p) => p.slug === slug);
  if (!isSanityConfigured) return fallback;

  const page = await sanityFetch<PageContent | null>(PAGE_BY_SLUG, { slug });
  return page ?? fallback;
}
