'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface HeroSlide {
  src: string;
  alt: string;
  /** Short caption shown over the slide (e.g. the featured trip name). */
  label?: string;
}

export interface HeroSlideshowProps {
  slides: HeroSlide[];
  intervalMs?: number;
}

/**
 * Auto-rotating background slideshow for the hero. Client-only (state/timers);
 * the headline/CTAs stay server-rendered in `Hero.tsx` and are layered above
 * this via normal DOM order. Pauses on hover/focus, on user request, and
 * whenever `prefers-reduced-motion` is set (CLAUDE.md §9).
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
      className="absolute inset-0"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={() => setInteracting(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured trip photos"
    >
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

      <p aria-live="polite" className="sr-only">
        {current.label ? `Now showing: ${current.label}` : `Photo ${index + 1} of ${slides.length}`}
      </p>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center gap-2 sm:items-end sm:pr-6">
          {current.label && (
            <span className="rounded-full bg-black/35 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur">
              {current.label}
            </span>
          )}
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-1.5 ring-1 ring-white/25 backdrop-blur">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Previous photo"
              className="rounded-full p-1 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>

            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1} of ${slides.length}`}
                aria-current={i === index}
                className={cn(
                  'size-2 rounded-full transition-colors',
                  i === index ? 'bg-white' : 'bg-white/40 hover:bg-white/60',
                )}
              />
            ))}

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Next photo"
              className="rounded-full p-1 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>

            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
              aria-pressed={userPaused}
              className="ml-1 rounded-full p-1 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {userPaused ? (
                <Play aria-hidden className="size-3.5" />
              ) : (
                <Pause aria-hidden className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
