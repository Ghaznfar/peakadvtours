'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ImageRef } from '@/types/content';

/** One photo in a column, with the caption that rides on top of it. */
export interface ShowcaseSlide {
  image: ImageRef;
  title: string;
  subtitle: string;
}

export interface PhotoStackProps {
  /** One array per card. Each card cycles its own photos. */
  columns: ShowcaseSlide[][];
  className?: string;
}

const INTERVAL_MS = 5000;

/**
 * The three stacked photos beside the homepage intro, each cycling through the
 * featured trips of its category.
 *
 * All three advance on ONE shared timer rather than three of their own: three
 * independent fades running out of phase reads as flicker, and a single index
 * also means a single pause control for the group.
 *
 * The cards are deliberately NOT links. Their captions name a trip, so linking
 * them looks obvious — but the target would change under the pointer every few
 * seconds, which is exactly the moving-target problem carousels are criticised
 * for. Navigation lives in the link rows beside them instead.
 */
export function PhotoStack({ columns, className }: PhotoStackProps) {
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  // Same shape as `HeroSlideshow`: read once during render, then only subscribe
  // in the effect — setting state in an effect body triggers cascading renders
  // and is a lint error in this repo.
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

  const longest = columns.reduce((max, c) => Math.max(max, c.length), 0);
  const canRotate = longest > 1;
  const paused = userPaused || reducedMotion || !canRotate;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {columns.map((slides, column) => {
        const active = slides.length > 0 ? index % slides.length : 0;
        return (
          <figure
            key={column}
            className="relative overflow-hidden rounded-xl shadow-[0_10px_30px_rgb(0_0_0/0.12)]"
          >
            <div className="relative aspect-[16/10]">
              {slides.map((slide, i) => (
                <Image
                  key={`${slide.image.src}-${i}`}
                  src={slide.image.src}
                  alt={i === active ? slide.image.alt : ''}
                  aria-hidden={i === active ? undefined : true}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className={cn(
                    'object-cover transition-opacity duration-700 motion-reduce:transition-none',
                    i === active ? 'opacity-100' : 'opacity-0',
                  )}
                  // No `priority`: this section sits below the hero AND the
                  // category tiles, so preloading it would compete with the
                  // real LCP image for bandwidth.
                  loading="lazy"
                />
              ))}
              {/* Scrim so the caption stays legible over any photograph. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgb(0_0_0/0.78)_0%,rgb(0_0_0/0.45)_45%,transparent_100%)]"
              />
            </div>

            {slides[active] && (
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[15px] font-bold text-white">{slides[active].title}</p>
                <p className="mt-0.5 text-[12px] font-medium tracking-[0.08em] text-white/85 uppercase">
                  {slides[active].subtitle}
                </p>
              </figcaption>
            )}
          </figure>
        );
      })}

      {canRotate && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={paused}
          className="focus-visible:ring-brand-600 inline-flex min-h-11 items-center gap-2 self-end rounded-full px-3 text-[13px] font-medium text-slate-500 hover:text-slate-800 focus-visible:ring-2 focus-visible:outline-none dark:text-slate-400 dark:hover:text-slate-100"
        >
          {paused ? (
            <Play aria-hidden className="size-3.5" />
          ) : (
            <Pause aria-hidden className="size-3.5" />
          )}
          {paused ? 'Play photos' : 'Pause photos'}
        </button>
      )}
    </div>
  );
}
