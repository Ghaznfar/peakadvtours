import Link from 'next/link';
import { siteConfig } from '@/site.config';
import type { ImageRef, Trip, TripCategory } from '@/types/content';
import { CATEGORY_LABEL } from '@/lib/trips/href';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PhotoStack, type ShowcaseSlide } from './PhotoStack';

/**
 * The homepage's opening statement: who the operator is and what they sell, set
 * beside three photographs drawn from the catalogue itself.
 *
 * The three photo columns are tours / treks / expeditions in that order, each
 * cycling the featured trips of its category — so the strip refreshes as the
 * client flags different trips, with no edit here.
 */

/** Which categories fill the three photo cards, top to bottom. */
const SHOWCASE_CATEGORIES: TripCategory[] = ['tour', 'trek', 'expedition'];

/** How many photos one card will cycle through, at most. */
const MAX_SLIDES_PER_CARD = 5;

/**
 * A trip with no uploaded photograph resolves to this shared grey SVG. Three
 * identical grey boxes is worse than a stock photo, so these are filtered out
 * and the per-category fallback below is used instead.
 */
const PLACEHOLDER_SRC = '/images/placeholder-trip.svg';

/**
 * Shown until the client uploads photography to their trips. These are the same
 * licensed stock photos the category tiles already use, so the homepage is
 * consistent while it waits.
 */
const FALLBACK_SLIDES: Record<TripCategory, ShowcaseSlide> = {
  tour: {
    image: {
      src: '/images/stock/trip-valley-tour.jpg',
      alt: 'Green valley with trees between mountains',
      width: 1200,
      height: 800,
    },
    title: 'Guided tour packages',
    subtitle: 'Karakoram · Hindu Kush · Punjab',
  },
  trek: {
    image: {
      src: '/images/stock/trip-trek-hikers.jpg',
      alt: 'Trekkers walking a high mountain trail',
      width: 1200,
      height: 800,
    },
    title: 'Trekking with full camp support',
    subtitle: 'Porters, cooks and camp crews',
  },
  expedition: {
    image: {
      src: '/images/stock/trip-expedition-climbers.jpg',
      alt: 'Climbers roped together on a snow slope',
      width: 1200,
      height: 800,
    },
    title: 'Mountaineering expeditions',
    subtitle: '6,000 m peaks to the 8,000ers',
  },
  corporate: {
    image: {
      src: '/images/stock/trip-valley-tour.jpg',
      alt: 'Green valley with trees between mountains',
      width: 1200,
      height: 800,
    },
    title: 'Corporate retreats',
    subtitle: 'Planned around your team',
  },
};

function isRealPhoto(image: ImageRef | undefined): image is ImageRef {
  return Boolean(image?.src) && image!.src !== PLACEHOLDER_SRC;
}

/**
 * Pick the photos for all three cards at once.
 *
 * Two things make this more than a filter per card. Photographs are claimed
 * across the whole set, not per card — several trips can carry the same
 * uploaded image, and without that the same photo appears in two of the three
 * cards stacked next to each other. And claiming runs in two passes, featured
 * trips first, so a featured trip always wins its own photo rather than losing
 * it to a non-featured trip in the card above.
 *
 * A category with no usable photo falls back to its stock image, so the strip
 * is never empty and never shows the grey placeholder.
 */
function buildColumns(trips: Trip[]): ShowcaseSlide[][] {
  const claimed = new Set<string>();
  const columns: ShowcaseSlide[][] = SHOWCASE_CATEGORIES.map(() => []);

  const claimPass = (featuredOnly: boolean) => {
    SHOWCASE_CATEGORIES.forEach((category, i) => {
      const column = columns[i]!;
      for (const trip of trips) {
        if (column.length === MAX_SLIDES_PER_CARD) break;
        if (trip.category !== category) continue;
        if (featuredOnly && !trip.featured) continue;
        if (!isRealPhoto(trip.heroImage) || claimed.has(trip.heroImage.src)) continue;
        claimed.add(trip.heroImage.src);
        column.push({
          image: trip.heroImage,
          title: trip.title,
          subtitle: `${CATEGORY_LABEL[category]} · ${trip.durationDays} days`,
        });
      }
    });
  };

  claimPass(true);
  claimPass(false);

  return columns.map((slides, i) =>
    slides.length > 0 ? slides : [FALLBACK_SLIDES[SHOWCASE_CATEGORIES[i]!]],
  );
}

/** Quick links under the copy. An empty `href` renders as plain text — the same
 *  rule the footer uses for destinations that do not exist yet. */
const QUICK_LINKS: Array<Array<{ label: string; href: string }>> = [
  [
    { label: 'Festival tours', href: '/festivals' },
    { label: 'Bike tours', href: '' },
    { label: 'Corporate retreats', href: '/corporate-retreats' },
  ],
  [
    { label: 'Booking & visa information', href: '/booking-info' },
    { label: 'Travel guides', href: '/blog' },
    { label: 'Our licences & team', href: '/about' },
  ],
];

const linkClasses =
  'text-brand-700 underline underline-offset-4 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300';

export interface BrandIntroProps {
  /** Every trip — the photo cards select from these by category. */
  trips: Trip[];
}

export function BrandIntro({ trips }: BrandIntroProps) {
  const { name, foundedYear } = siteConfig;
  const columns = buildColumns(trips);

  return (
    <Section ariaLabel={`About ${name}`}>
      <Container>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: the statement */}
          <div>
            <p className="text-brand-700 dark:text-brand-400 text-[13px] font-bold tracking-[0.18em] uppercase">
              Since {foundedYear}
            </p>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,42px)] leading-[1.15] font-extrabold tracking-[0.01em] text-slate-900 uppercase dark:text-white">
              Pakistan &amp; Asia tour packages, treks &amp;{' '}
              <span className="text-brand-600 dark:text-brand-400">expeditions</span>
            </h2>

            <div className="mt-6 flex flex-col gap-5 text-[16px] leading-[1.75] text-slate-700 dark:text-slate-300">
              <p>
                Every trip we sell, we have walked. Guided tours, treks and expeditions across
                Pakistan and Asia — from a seven-day valley tour to K2 and the 8,000ers. One printed
                price with internal flights, hotels, breakfast and your guide included. No surcharge
                after you land.
              </p>
              <p>
                {name} is a{' '}
                <Link href="/about" className={linkClasses}>
                  licensed Pakistan tour operator
                </Link>{' '}
                running guided holidays across Asia. Pakistan is where we are based and the country
                we cover end to end — the Karakoram and Gilgit-Baltistan, the Hindu Kush and the
                Khyber, the Mughal cities of Punjab, and the Indus down to Sindh and the Arabian Sea
                — and we plan journeys through the rest of the continent on the same terms. Our{' '}
                <Link href="/tours" className={linkClasses}>
                  Pakistan tour packages
                </Link>{' '}
                put internal flights, hotels with breakfast, sightseeing and an English-speaking
                guide into one printed price — no surcharges added once you have arrived.
              </p>
              <p>
                Beyond the cultural routes through Hunza, Skardu, Lahore and the Kalash valleys we
                run the mountains themselves:{' '}
                <Link href="/treks" className={linkClasses}>
                  guided treks
                </Link>{' '}
                to K2 Base Camp, Gondogoro La and Snow Lake with porters and full camp crews, and{' '}
                <Link href="/expeditions" className={linkClasses}>
                  mountaineering expeditions
                </Link>{' '}
                from first 6,000 m summits to Gasherbrum II, Broad Peak, Nanga Parbat and K2 —
                permits, liaison officer and high-altitude porters handled end to end.
              </p>
              <p>
                Outside Pakistan, Everest, Annapurna and Manaslu run with our partner crews in
                Nepal, and trips elsewhere in Asia are planned to order — the same office, the same
                planners, the same all-in pricing. Tell us where in Asia you want to go and we will
                cost it.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              {QUICK_LINKS.map((row, i) => (
                <ul key={i} className="flex flex-wrap gap-x-8 gap-y-2">
                  {row.map((link) => (
                    <li key={link.label} className="text-[15px] font-medium">
                      {link.href ? (
                        <Link href={link.href} className={linkClasses}>
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

          {/* Right: photographs from the catalogue */}
          <PhotoStack columns={columns} />
        </div>
      </Container>
    </Section>
  );
}
