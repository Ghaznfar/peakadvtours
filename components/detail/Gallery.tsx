import type { ImageRef } from '@/types/content';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface GalleryProps {
  images: ImageRef[];
}

/** Responsive image gallery. Images lazy-load (none are the LCP element). */
export function Gallery({ images }: GalleryProps) {
  if (images.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image, i) => (
        <li key={`${image.src}-${i}`}>
          <OptimizedImage
            image={image}
            fill
            aspectRatio="1 / 1"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="rounded-lg"
            wrapperClassName="rounded-lg"
          />
        </li>
      ))}
    </ul>
  );
}
