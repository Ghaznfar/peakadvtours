'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export interface HeroSlide {
  src: string;
  alt: string;
  /** Small line above the title (e.g. "All-inclusive & guided"). */
  eyebrow: string;
  /** The slide's headline — rendered as the page's single <h1>. */
  title: string;
  cta: { label: string; href: string };
}

export interface HeroSlideshowProps {
  slides: HeroSlide[];
  intervalMs?: number;
}

/**
 * Full-bleed hero carousel: background crossfade, per-slide headline/CTA, big
 * edge arrows and a clickable thumbnail filmstrip. Client component — the
 * whole point is the interactive slide state — but still server-rendered for
 * the initial HTML, so slide 0's <h1>/CTA are present on first paint (no pop-in,
 * no SEO/LCP cost). Pauses on hover/focus, on request, and under
 * `prefers-reduced-motion` (CLAUDE.md §9).
 */
export function HeroSlideshow({ slides, intervalMs = 6000 }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const paused = userPaused || interacting || reducedMotion || slides.length <= 1;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, intervalMs, slides.length]);

  function goTo(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }

  const current = slides[index];
  if (!current) return null;

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured trips"
    >
      {/* Background image stack */}
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={i === 0}
          sizes="100vw"
          aria-hidden={i !== index}
          className={cn(
            'object-cover transition-opacity duration-[800ms] ease-out motion-reduce:transition-none',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      {/* Bottom-weighted scrim, matching PageHero. The stops guarantee white
          text clears 4.5:1 (WCAG 2.2 AA, CLAUDE.md §9) anywhere in the caption
          zone — which reaches ~45% of the height on a tall slide — even over a
          snow-bright photograph. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgb(3_22_35/0.92)_0%,rgb(3_22_35/0.78)_35%,rgb(3_22_35/0.58)_62%,rgb(3_22_35/0.22)_100%)]"
      />

      <p aria-live="polite" className="sr-only">
        Now showing: {current.title}
      </p>

      {/* Big edge arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="hover:bg-brand-500 absolute top-1/2 left-[10px] z-10 inline-flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none lg:left-[22px] lg:size-[52px]"
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="hover:bg-brand-500 absolute top-1/2 right-[10px] z-10 inline-flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none lg:right-[22px] lg:size-[52px]"
          >
            <ChevronRight aria-hidden className="size-6" />
          </button>
        </>
      )}

      {/* Slide content — short by design: eyebrow, title, one CTA. Anchored to
          the bottom edge and aligned to the page container, so the headline sits
          on the darkest part of the scrim. */}
      <Container className="absolute inset-x-0 bottom-[48px] z-[1] lg:bottom-[72px]">
        <div className="text-white">
          <p
            key={`eyebrow-${index}`}
            className="font-script [animation:fade-up_0.6s_ease-out_0.05s_forwards] text-[26px] opacity-0 [text-shadow:0_1px_8px_rgb(0_0_0/0.5)] motion-reduce:[animation:none] motion-reduce:opacity-100"
          >
            {current.eyebrow}
          </p>
          <h1
            key={`title-${index}`}
            className="mt-1 max-w-[640px] [animation:fade-up_0.6s_ease-out_0.15s_forwards] text-[clamp(26px,4vw,44px)] leading-[1.15] font-extrabold tracking-[0.02em] text-white uppercase opacity-0 [text-shadow:0_2px_14px_rgb(0_0_0/0.5)] motion-reduce:[animation:none] motion-reduce:opacity-100"
          >
            {current.title}
          </h1>
          <div
            key={`cta-${index}`}
            className="mt-4 [animation:fade-up_0.6s_ease-out_0.25s_forwards] opacity-0 motion-reduce:[animation:none] motion-reduce:opacity-100"
          >
            <Button
              asChild
              className="bg-brand-500 hover:bg-brand-600 min-h-[44px] rounded-lg px-5 py-[13px] text-[12.5px] font-bold tracking-[0.07em] text-white uppercase"
            >
              <Link href={current.cta.href}>{current.cta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>

      {/* Thumbnail filmstrip — centred along the bottom edge */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-[1] hidden items-center justify-center gap-2 px-4 lg:flex">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}: ${slide.title}`}
              aria-current={i === index}
              className={cn(
                'relative h-12 w-[72px] shrink-0 overflow-hidden rounded-xs transition-all',
                i === index ? 'ring-brand-500 opacity-100 ring-2' : 'opacity-55 hover:opacity-85',
              )}
            >
              <Image src={slide.src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Autoplay control — hidden by design, but still reachable by keyboard
          so the carousel keeps a real pause mechanism (CLAUDE.md §9). Same
          sr-only/focus pattern as the layout's skip link. Autoplay also stops
          on hover/focus and is disabled entirely under prefers-reduced-motion. */}
      {slides.length > 1 && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
          aria-pressed={userPaused}
          className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:bottom-6 focus:z-[2] focus:inline-flex focus:size-9 focus:items-center focus:justify-center focus:rounded-full focus:bg-slate-900/70 focus:text-white focus:ring-2 focus:ring-white focus:outline-none sm:focus:right-8"
        >
          {userPaused ? (
            <Play aria-hidden className="size-4" />
          ) : (
            <Pause aria-hidden className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}
