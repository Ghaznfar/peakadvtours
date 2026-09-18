/**
 * Types for the client-swappable site configuration (see `site.config.ts`).
 * Nothing here is content — this is branding, contact and navigation.
 */

export interface NavChild {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** When present, the item renders a dropdown / accordion of children. */
  children?: NavChild[];
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
  pinterest?: string;
}

export interface ContactInfo {
  phone: string;
  /** Optional second phone line shown alongside the primary. */
  phoneSecondary?: string;
  /** International WhatsApp number, digits only, no leading `+`. */
  whatsapp: string;
  email: string;
  /** Optional second inbox shown alongside the primary. */
  emailSecondary?: string;
  hours: string;
  address: {
    line1: string;
    city: string;
    country: string;
  };
  geo?: { lat: number; lng: number };
}

export interface FooterColumn {
  heading: string;
  links: NavChild[];
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  url: string;
  logo: { src: string; alt: string };
  defaultCurrency: string;
  locale: string;
  foundedYear: number;
  contact: ContactInfo;
  social: SocialLinks;
  nav: NavItem[];
  footer: {
    about: string;
    columns: FooterColumn[];
  };
  featureFlags: {
    map: boolean;
    newsletter: boolean;
    blog: boolean;
  };
}
