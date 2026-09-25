import Link from 'next/link';
import Image from 'next/image';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { SocialRow } from '@/components/ui/SocialRow';

/**
 * Site footer — every value comes from `siteConfig`, so nothing here needs
 * editing when the client's details change. Always dark, independent of the
 * page theme, matching the client's reference design.
 *
 * Social circles come from the shared `SocialRow`, so the top bar and footer
 * cannot drift apart in colour, order or content.
 */
export function SiteFooter() {
  const { footer, contact, legalName, foundedYear, logo } = siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2c3e50] text-slate-300">
      <Container className="grid gap-x-8 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-6 lg:py-16">
        {/* Brand, blurb and socials */}
        <div className="sm:col-span-2 lg:col-span-2">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={112}
            height={112}
            className="size-14 rounded-full object-cover"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">{footer.about}</p>

          <SocialRow size="md" className="mt-6" />
        </div>

        {/* Link columns */}
        {footer.columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-bold tracking-[0.08em] text-white uppercase">
              {column.heading}
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              {/* An entry with no href yet renders as plain text rather than a
                  link to nowhere, so the column reads correctly while the
                  client fills the destinations in. */}
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <Link
                      href={link.href}
                      className="text-slate-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* Head office */}
        <div>
          <h2 className="text-sm font-bold tracking-[0.08em] text-white uppercase">Head office</h2>
          <address className="mt-5 flex flex-col gap-3 text-sm not-italic">
            <span className="flex items-start gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <span>
                {contact.address.line1}
                <br />
                {contact.address.city}, {contact.address.country}
              </span>
            </span>
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
              className="flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Phone aria-hidden className="size-4 shrink-0 text-slate-400" />
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Mail aria-hidden className="size-4 shrink-0 text-slate-400" />
              {contact.email}
            </a>
            <span className="flex items-center gap-2.5">
              <Clock aria-hidden className="size-4 shrink-0 text-slate-400" />
              {contact.hours}
            </span>
          </address>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-400 sm:flex-row">
          <p>
            © {legalName} {foundedYear}–{String(year).slice(-2)} All Rights Reserved
          </p>
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {[
              { label: 'Booking terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Booking info', href: '/booking-info' },
            ].map((link, i, arr) => (
              <li key={link.href} className="flex items-center gap-2">
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
                {i < arr.length - 1 && <span aria-hidden>·</span>}
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
