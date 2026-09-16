import Image from 'next/image';
import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ImageRef } from '@/types/content';

export interface OptimizedImageProps {
  image: ImageRef;
  /**
   * If true, the image fills its (positioned) parent — use for cards/heroes
   * where the wrapper controls the aspect ratio. If false, width/height from
   * the `ImageRef` set intrinsic dimensions.
   */
  fill?: boolean;
  /** CSS aspect-ratio for `fill` wrappers, e.g. "16 / 10". */
  aspectRatio?: string;
  /** Responsive `sizes` hint — important for correct srcset selection. */
  sizes?: string;
  /** Prioritise loading (use ONLY for above-the-fold LCP images). */
  priority?: boolean;
  className?: string;
  /** Class applied to the wrapper in `fill` mode. */
  wrapperClassName?: string;
}

/**
 * Single wrapper around next/image so every image gets AVIF/WebP, responsive
 * srcset, lazy loading and a required `alt`. Decorative images should pass an
 * empty `alt` in their `ImageRef`. See docs/SEO_PLAN.md §6.
 */
export function OptimizedImage({
  image,
  fill = false,
  aspectRatio = '16 / 10',
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  priority = false,
  className,
  wrapperClassName,
}: OptimizedImageProps) {
  const blur = image.blurDataURL
    ? { placeholder: 'blur' as const, blurDataURL: image.blurDataURL }
    : {};

  if (fill) {
    const style: CSSProperties = { aspectRatio };
    return (
      <div
        className={cn('relative w-full overflow-hidden bg-slate-100', wrapperClassName)}
        style={style}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn('object-cover', className)}
          {...blur}
        />
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width ?? 1200}
      height={image.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
      {...blur}
    />
  );
}
