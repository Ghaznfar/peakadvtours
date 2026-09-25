import Link from 'next/link';
import { Compass, MessageCircle, ShieldCheck } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { buildWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Button } from '@/components/ui/Button';

/**
 * The rail beside the `/tours` listing: enquiry CTAs, reassurance and the
 * links people look for before booking.
 *
 * Content is fixed rather than CMS-driven — it is the same on every listing and
 * is page furniture, not trip content. `site.config.ts` still supplies the
 * contact details so nothing is duplicated.
 *
 * Deliberately omits the reference's "Awards & recognition" and star-rating
 * panels: CLAUDE.md §2 forbids presenting awards or ratings the client has not
 * actually earned, and none are recorded yet.
 */

const CONFIDENCE = [
  'Deposit holds your place',
  'Balance due before departure',
  'Written receipt for every payment',
  'Free date changes where dates allow',
  '24/7 support while you travel',
];

const BEFORE_YOU_BOOK: Array<{ label: string; href: string }> = [
  { label: 'How booking and deposits work', href: '/booking-info' },
  { label: 'Booking terms in full', href: '/terms' },
  { label: 'Build a custom itinerary', href: '/custom-trips' },
  { label: 'Talk to a trip planner', href: '/contact' },
];

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof ShieldCheck;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card rounded-md border border-slate-200 p-[22px] shadow-[0_2px_10px_rgb(0_0_0/0.05)] dark:border-slate-800 dark:shadow-black/20">
      <h2 className="mb-3 flex items-center gap-2.5 text-[14px] font-extrabold tracking-[0.05em] text-slate-700 uppercase dark:text-slate-200">
        {Icon && <Icon aria-hidden className="text-brand-600 size-4" />}
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ListingSidebar() {
  const { contact, name } = siteConfig;

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
      <section className="bg-card rounded-md border border-slate-200 p-[22px] text-center shadow-[0_2px_10px_rgb(0_0_0/0.05)] dark:border-slate-800">
        <p className="font-script text-brand-600 dark:text-brand-400 text-[22px]">
          Planning your dates?
        </p>
        <div className="mt-3 flex flex-col gap-2.5">
          <Button asChild fullWidth className="text-[12.5px] tracking-[0.07em]">
            <Link href="/contact">Enquire now</Link>
          </Button>
          <Button
            asChild
            fullWidth
            className="bg-[#25D366] text-[12.5px] tracking-[0.07em] hover:bg-[#1da851]"
          >
            <a
              href={buildWhatsAppUrl(contact.whatsapp, `Hi ${name}, I'd like to plan a trip.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden className="size-4" />
              Chat on WhatsApp
            </a>
          </Button>
        </div>
        <p className="mt-3 text-[13px] text-slate-500 dark:text-slate-400">
          A trip planner replies personally — {contact.hours}.
        </p>
      </section>

      <Card title="Book with confidence" icon={ShieldCheck}>
        <ul className="flex flex-col gap-2">
          {CONFIDENCE.map((item) => (
            <li
              key={item}
              className="relative pl-5 text-[13px] text-slate-700 before:absolute before:left-0 before:font-extrabold before:text-green-600 before:content-['✓'] dark:text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Before you book" icon={Compass}>
        <ul className="flex flex-col gap-2">
          {BEFORE_YOU_BOOK.map((link) => (
            <li
              key={link.href}
              className="text-brand-600 before:text-brand-600 relative pl-5 text-[13px] before:absolute before:left-0 before:content-['→']"
            >
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
