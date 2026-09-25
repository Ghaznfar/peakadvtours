import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Row-shaped sibling of `CustomTripCard`, closing the `/tours` list. Same
 * reasoning for not being a CMS document: no duration, no price, a CTA that
 * goes to the enquiry funnel, and it must not count as a trip anywhere.
 */
export function CustomTripRow() {
  return (
    <article className="bg-card relative grid overflow-hidden rounded-md border border-slate-200 shadow-[0_2px_10px_rgb(0_0_0/0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[2px] hover:shadow-[0_10px_26px_rgb(0_0_0/0.13)] motion-reduce:transform-none md:grid-cols-[250px_1fr_190px] dark:border-slate-800">
      <div className="relative min-h-[180px]">
        <Image
          src="/images/stock/trip-valley-tour.jpg"
          alt="PLACEHOLDER — replace with a client photograph of travellers on the road"
          fill
          sizes="(max-width: 768px) 100vw, 250px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-2.5 px-[22px] py-[18px]">
        <h3 className="text-[16.5px] leading-[1.35] font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-slate-50">
          Create your own Pakistan holiday
        </h3>
        <p className="text-[13.5px] text-slate-600 dark:text-slate-400">
          Tell us where and when — we&rsquo;ll build a custom day-by-day itinerary with fully
          inclusive pricing.
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {[
            { Icon: Compass, label: 'Custom itinerary' },
            { Icon: CalendarDays, label: 'Any month' },
          ].map(({ Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-[5px] rounded-[3px] border border-slate-200 bg-slate-50 px-[9px] py-1 text-[11.5px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            >
              <Icon aria-hidden className="size-3.5 shrink-0" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 border-slate-200 px-4 py-[18px] text-center md:border-l dark:border-slate-800">
        <p className="text-brand-500 text-[16px] leading-tight font-extrabold">
          Your dates, your route
        </p>
        <Button
          asChild
          fullWidth
          className="text-[12.5px] tracking-[0.07em] after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          <Link href="/custom-trips">Build your itinerary</Link>
        </Button>
      </div>
    </article>
  );
}
