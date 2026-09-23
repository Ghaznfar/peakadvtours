import type { ComponentType } from 'react';
import { Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Container } from '@/components/ui/Container';
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  WhatsappIcon,
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

/**
 * Thin utility bar above the header: quick contact + positioning lines on the
 * left, social links on the right. Server component — every value comes from
 * `site.config.ts`.
 */
export function AnnouncementBar() {
  const { contact, social, name, topBarHighlights } = siteConfig;

  const socialEntries = (Object.keys(SOCIAL_ICONS) as Array<keyof typeof social>)
    .map((key) => ({ key, href: social[key], Icon: SOCIAL_ICONS[key] }))
    .filter((entry): entry is { key: keyof typeof social; href: string; Icon: IconType } =>
      Boolean(entry.href && entry.Icon),
    );

  return (
    <div className="bg-slate-700 text-slate-100 dark:bg-slate-800">
      <Container className="flex h-10 items-center justify-between gap-4 text-xs">
        {/* Left: phone + short positioning lines */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            className="inline-flex shrink-0 items-center gap-1.5 hover:text-white"
          >
            <Phone aria-hidden className="size-3.5" />
            <span>{contact.phone}</span>
          </a>
          {topBarHighlights.map((highlight) => (
            <span key={highlight} className="hidden items-center gap-3 sm:inline-flex sm:gap-4">
              <span aria-hidden className="text-slate-100/30">
                |
              </span>
              <span className="truncate">{highlight}</span>
            </span>
          ))}
        </div>

        {/* Right: social links */}
        <ul className="flex shrink-0 items-center gap-3">
          {socialEntries.map(({ key, href, Icon }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${key}`}
                className="inline-flex hover:text-white"
              >
                <Icon aria-hidden className="size-4" />
              </a>
            </li>
          ))}
          <li>
            <a
              href={buildWhatsAppUrl(contact.whatsapp, `Hi ${name}, I'd like to plan a trip.`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Message ${name} on WhatsApp`}
              className="inline-flex hover:text-white"
            >
              <WhatsappIcon aria-hidden className="size-4" />
            </a>
          </li>
        </ul>
      </Container>
    </div>
  );
}
