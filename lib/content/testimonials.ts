import type { Testimonial } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { TESTIMONIALS_ALL } from '@/sanity/queries';
import { testimonials as localTestimonials } from './testimonials.data';

/** Only consented testimonials are ever returned (CLAUDE.md §2). */
export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  const rows = isSanityConfigured
    ? await sanityFetch<Testimonial[]>(TESTIMONIALS_ALL)
    : localTestimonials.filter((t) => t.consentGiven);
  return typeof limit === 'number' ? rows.slice(0, limit) : rows;
}
