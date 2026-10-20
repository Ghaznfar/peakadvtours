import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Transforms are served by Sanity's image CDN, not Next's optimizer — see
    // `sanity/imageLoader.ts` for the rationale. With a custom loader Next does
    // no optimization itself, so `formats`, `remotePatterns` and the SVG
    // options it used to need no longer apply.
    loader: 'custom',
    loaderFile: './sanity/imageLoader.ts',
  },
};

export default nextConfig;
