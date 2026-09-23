import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { WhatsappIcon } from '@/components/ui/icons/SocialIcons';

/**
 * Persistent floating WhatsApp CTA (bottom-right on every page). Server
 * component — it's a plain link. Number and default message come from config.
 */
export function WhatsAppButton() {
  const href = buildWhatsAppUrl(
    siteConfig.contact.whatsapp,
    `Hi ${siteConfig.name}, I'd like to plan a trip.`,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="bg-whatsapp hover:bg-whatsapp-dark focus-visible:ring-whatsapp fixed right-5 bottom-5 z-30 inline-flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <WhatsappIcon aria-hidden className="size-7" />
    </a>
  );
}
