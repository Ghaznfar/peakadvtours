import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { cn } from '@/lib/utils/cn';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export interface CtaBannerProps {
  heading: string;
  body?: string;
  /** Primary action. */
  primary: { label: string; href: string };
  /** Show a WhatsApp secondary action (number comes from site config). */
  showWhatsApp?: boolean;
  /** Prefilled WhatsApp message. */
  whatsAppMessage?: string;
  className?: string;
}

/**
 * Reusable call-to-action band. Content is passed in by the page — the only
 * config it reads is the WhatsApp number, so it stays client-agnostic.
 */
export function CtaBanner({
  heading,
  body,
  primary,
  showWhatsApp = true,
  whatsAppMessage,
  className,
}: CtaBannerProps) {
  return (
    <div className={cn('bg-brand-700 text-white', className)}>
      <Container className="flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-2xl">
          <h2 className="text-h2 text-white">{heading}</h2>
          {body && <p className="text-brand-50/90 mt-3">{body}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="accent" size="lg">
            <Link href={primary.href}>{primary.label}</Link>
          </Button>
          {showWhatsApp && (
            <Button asChild variant="whatsapp" size="lg">
              <a
                href={buildWhatsAppUrl(siteConfig.contact.whatsapp, whatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden className="size-5" />
                Chat on WhatsApp
              </a>
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}
