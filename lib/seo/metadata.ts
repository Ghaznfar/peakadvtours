import type { Metadata } from 'next';
import { siteConfig } from '@/site.config';

const baseUrl = siteConfig.url;

/**
 * Root metadata applied in the app layout. `metadataBase` makes all relative
 * OG/canonical URLs absolute. Titles use a template so child pages only set the
 * page-specific part. See docs/SEO_PLAN.md §2.
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: baseUrl,
    locale: siteConfig.locale.replace('-', '_'),
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export interface PageMetaInput {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}

/**
 * Build per-page metadata with a self-referential canonical URL and matching
 * OpenGraph/Twitter fields. Use from a template's `generateMetadata`.
 */
export function buildMetadata({ title, description, path, noindex }: PageMetaInput): Metadata {
  const desc = description ?? siteConfig.description;
  const canonical = path ?? undefined;
  return {
    title,
    description: desc,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description: desc,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
    },
    twitter: { title, description: desc },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}
