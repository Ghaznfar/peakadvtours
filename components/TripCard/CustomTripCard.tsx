import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * The "build your own" card that closes a trip listing. Shares `TripCard`'s
 * shape so it sits in the grid without looking bolted on, but is a fixed
 * component rather than a CMS document: it has no duration or price (a trip
 * requires both), its CTA goes to the enquiry funnel instead of a detail page,
 * and counting it as a trip would make every "N trips" figure on the site wrong.
 */
export function CustomTripCard() {
  return (
    <article className="bg-card relative flex h-full flex-col overflow-hidden rounded-md border border-slate-200 shadow-[0_2px_10px_rgb(0_0_0/0.06)] transition-[box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_26px_rgb(0_0_0/0.13)] motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:shadow-black/30">
      <div className="relative h-[210px] overflow-hidden">
        <Image
          src="/images/stock/trip-valley-tour.jpg"
          alt="PLACEHOLDER — replace with a client photograph of travellers on the road"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-[22px] pt-5 pb-[22px]">
        <p className="text-brand-500 text-[15px] font-extrabold">Your dates, your route</p>

        <h3 className="text-[17px] leading-[1.35] font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-slate-50">
          Create your own Pakistan holiday
        </h3>

        <p className="text-[13.5px] text-slate-600 dark:text-slate-400">
          Tell us where and when — we&rsquo;ll build a custom day-by-day itinerary with fully
          inclusive pricing.
        </p>

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1.5">
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

        <Button
          asChild
          fullWidth
          className="mt-3.5 text-[12.5px] tracking-[0.07em] after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          <Link href="/custom-trips">Build your itinerary</Link>
        </Button>
      </div>
    </article>
  );
}
