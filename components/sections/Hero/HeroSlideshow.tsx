'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

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
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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
      className="absolute inset-0 flex flex-col"
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
            'object-cover transition-opacity duration-1000 motion-reduce:transition-none',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      {/* Legibility scrims — kept light so the photography stays vivid:
          a left wash behind the text plus a soft bottom vignette. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/20 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent"
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
            className="absolute top-1/2 left-4 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/45 text-white/90 transition-colors hover:bg-slate-900/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:left-8 sm:size-14"
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 z-10 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/45 text-white/90 transition-colors hover:bg-slate-900/70 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:right-8 sm:size-14"
          >
            <ChevronRight aria-hidden className="size-6" />
          </button>
        </>
      )}

      {/* Slide content — short by design: eyebrow, title, one CTA */}
      <div className="relative z-[1] flex flex-1 items-center px-6 pb-28 sm:px-12 lg:px-[8%]">
        <div className="max-w-2xl text-white">
          <p
            key={`eyebrow-${index}`}
            className="font-script text-2xl opacity-0 [animation:fade-up_0.6s_ease-out_0.05s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none] sm:text-3xl"
          >
            {current.eyebrow}
          </p>
          <h1
            key={`title-${index}`}
            className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-tight text-white uppercase opacity-0 [animation:fade-up_0.6s_ease-out_0.15s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none] sm:text-6xl lg:text-7xl"
          >
            {current.title}
          </h1>
          <div
            key={`cta-${index}`}
            className="mt-8 opacity-0 [animation:fade-up_0.6s_ease-out_0.25s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none]"
          >
            <Button
              asChild
              size="lg"
              className="bg-brand-500 hover:bg-brand-600 rounded-sm px-10 text-sm font-bold tracking-[0.15em] text-white uppercase"
            >
              <Link href={current.cta.href}>{current.cta.label}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnail filmstrip — centred along the bottom edge */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 z-[1] flex items-center justify-center gap-2 px-4">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}: ${slide.title}`}
              aria-current={i === index}
              className={cn(
                'relative h-12 w-16 shrink-0 overflow-hidden rounded-xs transition-all sm:h-16 sm:w-24',
                i === index
                  ? 'ring-brand-500 opacity-100 ring-2'
                  : 'opacity-55 hover:opacity-85',
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
