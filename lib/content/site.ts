import type { HeroSlideEntry, SiteSettings } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { SITE_SETTINGS } from '@/sanity/queries';
import { CATEGORY_LABEL, CATEGORY_SLUG } from '@/lib/trips/href';
import { heroSlides as localHeroSlides } from './hero.data';

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

type RawHeroSlide = {
  image: HeroSlideEntry['image'];
  eyebrow: string;
  tourTitle?: string;
  tourCategory?: 'tour' | 'trek' | 'expedition';
  tourSlug?: string;
};

/**
 * Homepage hero slides — edited in Sanity Studio ("Site settings" → "Homepage
 * hero slides"), never in code. Each slide's title/CTA are derived from its
 * linked tour, so the client only ever picks a photo, writes one short line,
 * and chooses which trip to feature. Falls back to local placeholder slides
 * when Sanity is unconfigured or none are set yet.
 */
export async function getHeroSlides(): Promise<HeroSlideEntry[]> {
  if (!isSanityConfigured) return localHeroSlides;

  const settings = await sanityFetch<{ heroSlides?: RawHeroSlide[] } | null>(SITE_SETTINGS);
  const raw = settings?.heroSlides ?? [];

  const slides = raw
    .filter((s): s is RawHeroSlide & { tourTitle: string; tourCategory: 'tour' | 'trek' | 'expedition'; tourSlug: string } =>
      Boolean(s.tourTitle && s.tourCategory && s.tourSlug),
    )
    .map((s) => ({
      image: s.image,
      eyebrow: s.eyebrow,
      title: s.tourTitle,
      ctaLabel: `View ${CATEGORY_LABEL[s.tourCategory].toLowerCase()}`,
      ctaHref: `/${CATEGORY_SLUG[s.tourCategory]}/${s.tourSlug}`,
    }));

  return slides.length > 0 ? slides : localHeroSlides;
}
