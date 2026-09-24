'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ImageRef } from '@/types/content';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface GalleryProps {
  images: ImageRef[];
}

/**
 * Responsive image gallery with a click-to-enlarge lightbox. Grid thumbnails
 * lazy-load (none are the LCP element); the lightbox is a Radix `Dialog` for
 * a built-in focus trap, Escape-to-close and focus return. Client component —
 * the whole point of this one is click/keyboard interaction.
 */
export function Gallery({ images }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const current = openIndex !== null ? images[openIndex] : undefined;

  function step(delta: number) {
    setOpenIndex((i) => (i === null ? null : (i + delta + images.length) % images.length));
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, i) => (
          <li key={`${image.src}-${i}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View photo ${i + 1} of ${images.length} full-size`}
              className="group focus-visible:ring-brand-600 block w-full overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <OptimizedImage
                image={image}
                fill
                aspectRatio="1 / 1"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="transition-transform duration-300 group-hover:scale-105"
                wrapperClassName="rounded-lg"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root
        open={current !== undefined}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-slate-950/90 data-[state=closed]:[animation:overlay-fade-out_200ms_ease-in] data-[state=open]:[animation:overlay-fade-in_200ms_ease-out]" />
          <Dialog.Content
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 focus:outline-none"
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') step(1);
              if (e.key === 'ArrowLeft') step(-1);
            }}
          >
            <Dialog.Title className="sr-only">{current?.alt || 'Gallery photo'}</Dialog.Title>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close"
                className="focus-visible:ring-brand-600 absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none"
              >
                <X aria-hidden className="size-6" />
              </button>
            </Dialog.Close>

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="focus-visible:ring-brand-600 absolute left-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none sm:left-4"
              >
                <ChevronLeft aria-hidden className="size-6" />
              </button>
            )}

            {current && (
              <div className="relative aspect-4/3 max-h-[85vh] w-full max-w-4xl">
                <OptimizedImage
                  image={current}
                  fill
                  aspectRatio="4 / 3"
                  sizes="90vw"
                  priority
                  className="object-contain"
                  wrapperClassName="h-full bg-transparent"
                />
              </div>
            )}

            {images.length > 1 && (
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="focus-visible:ring-brand-600 absolute right-2 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:outline-none sm:right-4"
              >
                <ChevronRight aria-hidden className="size-6" />
              </button>
            )}

            {images.length > 1 && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
                {(openIndex ?? 0) + 1} / {images.length}
              </p>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
