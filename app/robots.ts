import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/** Generated robots.txt — allow crawl, disallow API, point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
