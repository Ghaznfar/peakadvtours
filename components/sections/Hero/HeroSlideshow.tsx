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
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-slate-950/10"
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
            className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/40 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6 sm:size-12"
          >
            <ChevronLeft aria-hidden className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/40 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:size-12"
          >
            <ChevronRight aria-hidden className="size-6" />
          </button>
        </>
      )}

      {/* Slide content — short by design: eyebrow, title, one CTA */}
      <div className="relative z-[1] flex flex-1 items-center px-6 sm:px-12 lg:px-16">
        <div className="max-w-2xl text-white">
          <p
            key={`eyebrow-${index}`}
            className="font-display text-lg italic opacity-0 [animation:fade-up_0.6s_ease-out_0.05s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none]"
          >
            {current.eyebrow}
          </p>
          <h1
            key={`title-${index}`}
            className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase opacity-0 [animation:fade-up_0.6s_ease-out_0.15s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none] sm:text-5xl lg:text-6xl"
          >
            {current.title}
          </h1>
          <div
            key={`cta-${index}`}
            className="mt-6 opacity-0 [animation:fade-up_0.6s_ease-out_0.25s_forwards] motion-reduce:opacity-100 motion-reduce:[animation:none]"
          >
            <Button asChild size="lg">
              <Link href={current.cta.href} className="tracking-wide uppercase">
                {current.cta.label}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnail filmstrip */}
      {slides.length > 1 && (
        <div className="relative z-[1] flex items-center gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show slide ${i + 1} of ${slides.length}: ${slide.title}`}
              aria-current={i === index}
              className={cn(
                'relative size-14 shrink-0 overflow-hidden rounded-md ring-2 transition-all sm:size-16',
                i === index
                  ? 'ring-brand-400 opacity-100'
                  : 'opacity-60 ring-transparent hover:opacity-90',
              )}
            >
              <Image src={slide.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
            aria-pressed={userPaused}
            className="ml-1 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {userPaused ? (
              <Play aria-hidden className="size-4" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
