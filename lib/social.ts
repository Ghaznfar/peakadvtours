import type { ComponentType } from 'react';
import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TiktokIcon,
  WhatsappIcon,
  XIcon,
  YoutubeIcon,
} from '@/components/ui/icons/SocialIcons';

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

export interface SocialLink {
  key: string;
  label: string;
  Icon: IconType;
  /** Tailwind background class in the platform's own brand colour. */
  bg: string;
  /** Empty until the client supplies the URL. */
  href: string;
}

/**
 * The one definition of which social platforms the site shows, in what order,
 * and in which colour. Both the top bar and the footer read it, so the two can
 * never drift apart — they previously kept separate lists and had already
 * diverged (the top bar had no Pinterest).
 *
 * WhatsApp is derived from `contact.whatsapp` rather than `social`, since it is
 * a phone number everywhere else in the config.
 */
export function getSocialLinks(): SocialLink[] {
  const { social, contact } = siteConfig;

  return [
    { key: 'facebook', label: 'Facebook', Icon: FacebookIcon, bg: 'bg-[#1877F2]' },
    {
      key: 'instagram',
      label: 'Instagram',
      Icon: InstagramIcon,
      bg: 'bg-[linear-gradient(45deg,#F58529,#DD2A7B_50%,#8134AF_75%,#515BD4)]',
    },
    { key: 'youtube', label: 'YouTube', Icon: YoutubeIcon, bg: 'bg-[#FF0000]' },
    { key: 'tiktok', label: 'TikTok', Icon: TiktokIcon, bg: 'bg-[#010101]' },
    { key: 'x', label: 'X', Icon: XIcon, bg: 'bg-[#010101]' },
    { key: 'pinterest', label: 'Pinterest', Icon: PinterestIcon, bg: 'bg-[#E60023]' },
  ]
    .map((s) => ({ ...s, href: social[s.key as keyof typeof social] ?? '' }))
    .concat({
      key: 'whatsapp',
      label: 'WhatsApp',
      Icon: WhatsappIcon,
      bg: 'bg-[#25D366]',
      // Keeps the prefilled message the top bar always had, so the chat opens
      // with context instead of a blank thread.
      href: contact.whatsapp
        ? buildWhatsAppUrl(contact.whatsapp, `Hi ${siteConfig.name}, I'd like to plan a trip.`)
        : '',
    });
}
