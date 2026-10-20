/**
 * Custom next/image loader — serves transforms from **Sanity's** image CDN
 * instead of Netlify's.
 *
 * Why: on Netlify, `/_next/image` is rewritten to `/.netlify/images`, so every
 * rendered image became a billable Netlify transformation even though the same
 * image already sits on Sanity's CDN, which does the resizing for free. With a
 * custom loader Next stops optimizing entirely and simply emits these URLs, so
 * the work (and the cost) moves to Sanity.
 *
 * `auto=format` keeps the AVIF/WebP negotiation we'd otherwise lose, and
 * `fit=max` never upscales past the original.
 *
 * Non-Sanity sources (the local brand/legacy images under `public/`) are
 * returned untouched and served as-is.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith('https://cdn.sanity.io/')) return src;

  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  url.searchParams.set('fit', 'max');
  return url.toString();
}
