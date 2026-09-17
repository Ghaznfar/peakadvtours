import type { BlogPost } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { BLOG_ALL, BLOG_BY_SLUG } from '@/sanity/queries';

/**
 * Blog access. There is no local blog seed yet, so without Sanity these return
 * empty — the (not-yet-built) blog pages should render an empty state.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch<BlogPost[]>(BLOG_ALL);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSanityConfigured) return undefined;
  const row = await sanityFetch<BlogPost | null>(BLOG_BY_SLUG, { slug });
  return row ?? undefined;
}
