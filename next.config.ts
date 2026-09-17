import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // AVIF/WebP first for smaller payloads (see docs/SEO_PLAN.md §6).
    formats: ['image/avif', 'image/webp'],
    // Sanity's image CDN (content images). Additional hosts can be added here.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
    // Allows the first-party placeholder SVGs to render through next/image.
    // Once real raster photography is supplied at handoff this can be removed.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
