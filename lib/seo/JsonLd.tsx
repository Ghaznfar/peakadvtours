import { siteConfig } from '@/site.config';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD structured-data block. Server component.
 * IMPORTANT: only ever pass real, truthful data (see CLAUDE.md §2 / SEO_PLAN §3).
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // Data is our own serialised object, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization / TravelAgency schema for the whole site. */
export function organizationSchema(): Record<string, unknown> {
  const sameAs = Object.values(siteConfig.social).filter((v): v is string => Boolean(v));
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    foundingDate: String(siteConfig.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address.line1,
      addressLocality: siteConfig.contact.address.city,
      addressCountry: siteConfig.contact.address.country,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** WebSite schema (enables sitelinks search box eligibility later). */
export function websiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
