import type { SiteSettings } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { SITE_SETTINGS } from '@/sanity/queries';

/**
 * Editable site settings from Sanity (branding/contact/socials). Returns an
 * empty object when unconfigured or unset; `site.config.ts` remains the
 * compile-time default that header/footer read today. Merge these in when the
 * client wants those managed in the CMS.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return {};
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS);
  return settings ?? {};
}
