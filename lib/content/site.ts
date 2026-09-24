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
  /** Typed directly on the slide; wins over the linked trip's title. */
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tourTitle?: string;
  tourCategory?: 'tour' | 'trek' | 'expedition';
  tourSlug?: string;
};

/**
 * Homepage hero slides — edited in Sanity Studio ("Site settings" → "Homepage
 * hero slides"), never in code. A slide needs a photo, a short eyebrow line
 * and a headline. The headline and button can either be typed on the slide or
 * inherited from a linked trip — typed values win, so a slide works with no
 * trips in the dataset at all. Falls back to local placeholder slides only
 * when Sanity is unconfigured or no usable slide exists.
 */
export async function getHeroSlides(): Promise<HeroSlideEntry[]> {
  if (!isSanityConfigured) return localHeroSlides;

  const settings = await sanityFetch<{ heroSlides?: RawHeroSlide[] } | null>(SITE_SETTINGS);
  const raw = settings?.heroSlides ?? [];

  const slides = raw
    // A slide needs a picture and a headline. The headline may be typed on the
    // slide or inherited from a linked trip; everything else has a sensible
    // default, so a slide with neither is skipped rather than rendered blank.
    .filter((s) => Boolean(s.image?.src && (s.title || s.tourTitle)))
    .map((s) => {
      const linkedHref =
        s.tourCategory && s.tourSlug
          ? `/${CATEGORY_SLUG[s.tourCategory]}/${s.tourSlug}`
          : undefined;
      const linkedLabel = s.tourCategory
        ? `View ${CATEGORY_LABEL[s.tourCategory].toLowerCase()}`
        : undefined;

      return {
        image: s.image,
        eyebrow: s.eyebrow,
        // Typed values win, so an editor can override a linked trip's wording.
        title: s.title ?? (s.tourTitle as string),
        ctaLabel: s.ctaLabel ?? linkedLabel ?? 'Explore trips',
        ctaHref: s.ctaHref ?? linkedHref ?? '/trips',
      };
    });

  return slides.length > 0 ? slides : localHeroSlides;
}
