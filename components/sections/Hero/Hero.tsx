import type { HeroSlideEntry } from '@/types/content';
import { HeroSlideshow, type HeroSlide } from './HeroSlideshow';

export interface HeroProps {
  slides: HeroSlideEntry[];
}

/**
 * Cinematic full-bleed hero carousel. Fixed min-heights per breakpoint
 * prevent layout shift. Content is fetched by the page from Sanity (Site
 * settings → Homepage hero slides) — this component is presentational and
 * never imports the content layer itself (COMPONENT_ARCHITECTURE.md §7).
 */
export function Hero({ slides }: HeroProps) {
  const mapped: HeroSlide[] = slides.map((s) => ({
    src: s.image.src,
    alt: s.image.alt,
    eyebrow: s.eyebrow,
    title: s.title,
    cta: { label: s.ctaLabel, href: s.ctaHref },
  }));

  return (
    <section
      aria-label="Introduction"
      className="relative h-[420px] overflow-hidden bg-black md:h-[480px] lg:h-[600px]"
    >
      <HeroSlideshow slides={mapped} />
    </section>
  );
}
