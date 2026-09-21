import type { BlogPost } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { BLOG_ALL, BLOG_BY_SLUG } from '@/sanity/queries';
import { blogPosts as localBlogPosts } from './blog.data';

/**
 * Blog access. Falls back to local placeholder posts when Sanity is unset,
 * matching the rest of `lib/content/` (see docs/DATA_MODEL.md).
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isSanityConfigured) {
    return [...localBlogPosts].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }
  return sanityFetch<BlogPost[]>(BLOG_ALL);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isSanityConfigured) return localBlogPosts.find((p) => p.slug === slug);
  const row = await sanityFetch<BlogPost | null>(BLOG_BY_SLUG, { slug });
  return row ?? undefined;
}
