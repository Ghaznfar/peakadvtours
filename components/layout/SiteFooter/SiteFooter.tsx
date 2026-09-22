import type { ComponentType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  XIcon,
  YoutubeIcon,
} from '@/components/ui/icons/SocialIcons';

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

const SOCIAL_ICONS: Partial<Record<keyof typeof siteConfig.social, IconType>> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  x: XIcon,
};

/** Site footer — every value is sourced from `siteConfig`. Server component. */
export function SiteFooter() {
  const { footer, contact, social, name, legalName, foundedYear, logo } = siteConfig;
  const year = new Date().getFullYear();

  const socialEntries = (Object.keys(SOCIAL_ICONS) as Array<keyof typeof social>)
    .map((key) => ({ key, href: social[key], Icon: SOCIAL_ICONS[key] }))
    .filter((entry): entry is { key: keyof typeof social; href: string; Icon: IconType } =>
      Boolean(entry.href && entry.Icon),
    );

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-400">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5 lg:py-16">
        {/* Brand + socials */}
        <div className="lg:col-span-2">
          <div className="font-display flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm">{footer.about}</p>
          {socialEntries.length > 0 && (
            <ul className="mt-5 flex gap-2">
              {socialEntries.map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} on ${key}`}
                    className="hover:border-brand-600 hover:text-brand-700 dark:hover:border-brand-400 dark:hover:text-brand-400 inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                  >
                    <Icon aria-hidden className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Link columns */}
        {footer.columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {column.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Contact */}
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Head office</h2>
          <address className="mt-4 flex flex-col gap-3 text-sm not-italic">
            <span className="flex items-start gap-2">
              <MapPin
                aria-hidden
                className="text-brand-600 dark:text-brand-400 mt-0.5 size-4 shrink-0"
              />
              <span>
                {contact.address.line1}
                <br />
                {contact.address.city}, {contact.address.country}
              </span>
            </span>
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
              className="hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-2"
            >
              <Phone aria-hidden className="text-brand-600 dark:text-brand-400 size-4 shrink-0" />
              {contact.phone}
            </a>
            {contact.phoneSecondary && (
              <a
                href={`tel:${contact.phoneSecondary.replace(/[^\d+]/g, '')}`}
                className="hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-2"
              >
                <Phone aria-hidden className="size-4 shrink-0 text-transparent" />
                {contact.phoneSecondary}
              </a>
            )}
            <a
              href={`mailto:${contact.email}`}
              className="hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-2"
            >
              <Mail aria-hidden className="text-brand-600 dark:text-brand-400 size-4 shrink-0" />
              {contact.email}
            </a>
            {contact.emailSecondary && (
              <a
                href={`mailto:${contact.emailSecondary}`}
                className="hover:text-brand-700 dark:hover:text-brand-400 flex items-center gap-2"
              >
                <Mail aria-hidden className="size-4 shrink-0 text-transparent" />
                {contact.emailSecondary}
              </a>
            )}
            <span className="text-slate-500 dark:text-slate-500">{contact.hours}</span>
          </address>
        </div>
      </Container>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-slate-500 sm:flex-row dark:text-slate-500">
          <p>
            © {foundedYear}–{year} {legalName}. All rights reserved.
          </p>
          <ul className="flex gap-4">
            <li>
              <Link href="/terms" className="hover:text-brand-700 dark:hover:text-brand-400">
                Booking terms
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-brand-700 dark:hover:text-brand-400">
                Privacy
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
