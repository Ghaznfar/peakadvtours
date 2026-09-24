import Image from 'next/image';
import type { ImageRef } from '@/types/content';
import { Container } from '@/components/ui/Container';

export interface PageHeroProps {
  /** Script-font line above the title (e.g. "Boots on"). */
  eyebrow?: string;
  /** The page's single <h1>. */
  title: string;
  /**
   * Background photograph. Falls back to a flat brand panel when absent —
   * which is the right look for utility and legal pages.
   */
  heroImage?: ImageRef;
}

/**
 * Full-bleed banner at the top of a listing or institutional page: photograph,
 * dark scrim, script eyebrow and an uppercase title anchored to the bottom edge
 * and aligned to the page container.
 *
 * Uses `next/image` directly rather than `OptimizedImage` because this is a
 * fixed-height band — `OptimizedImage`'s fill mode supplies its own
 * aspect-ratio wrapper, which would fight the fixed height.
 *
 * Presentational — the page supplies the copy (fixed per route) and the image
 * (from the content layer).
 */
export function PageHero({ eyebrow, title, heroImage }: PageHeroProps) {
  return (
    <section
      aria-label={title}
      className="bg-brand-950 relative h-[220px] overflow-hidden lg:h-[300px]"
    >
      {heroImage && (
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
          {...(heroImage.blurDataURL
            ? { placeholder: 'blur' as const, blurDataURL: heroImage.blurDataURL }
            : {})}
        />
      )}
      {/* Bottom-weighted scrim. The stops are chosen so white text clears 4.5:1
          (WCAG 2.2 AA, CLAUDE.md §9) anywhere in the caption zone even over a
          snow-bright photograph: opacity stays >= 0.58 up to 62% of the height,
          which is the highest the eyebrow ever reaches. Above that it clears
          fast so the photograph is still the thing you see. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgb(3_22_35/0.92)_0%,rgb(3_22_35/0.78)_35%,rgb(3_22_35/0.58)_62%,rgb(3_22_35/0.22)_100%)]"
      />
      <Container className="absolute inset-x-0 bottom-9 text-white">
        {eyebrow && (
          <span className="font-script block text-[24px] [text-shadow:0_1px_8px_rgb(0_0_0/0.5)]">
            {eyebrow}
          </span>
        )}
        {/* `text-white` must be set on the element, not inherited: the base
            layer applies `text-foreground` directly to every h1-h4
            (app/globals.css), and a direct declaration always beats
            inheritance from the wrapper. */}
        <h1 className="text-[clamp(26px,3.6vw,40px)] font-extrabold tracking-[0.02em] text-white uppercase [text-shadow:0_2px_12px_rgb(0_0_0/0.5)]">
          {title}
        </h1>
      </Container>
    </section>
  );
}
