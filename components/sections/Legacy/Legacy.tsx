import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';

/**
 * The family archive: letters written to the founder's father by the
 * expeditions he cooked and carried for, between 1986 and 1993.
 *
 * These are the only genuinely verifiable credentials on the site — real
 * documents, signed by named expedition leaders, which the client holds. They
 * are worth more than the placeholder accreditation chips the `Credentials`
 * strip still shows, and they are the reason this section sits immediately
 * after the team.
 *
 * Each letter links to its own full-resolution file rather than opening a
 * lightbox. The point of a letter is that it can be read, and a plain link
 * does that with no JavaScript, works on any device, and survives the page
 * being printed or saved.
 */

interface Letter {
  src: string;
  /** Who wrote it and when — the caption under the image. */
  caption: string;
  /** Year shown as the eyebrow on the card. */
  year: string;
  /** Describes the document for anyone who cannot see it. */
  alt: string;
}

const LETTERS: Letter[] = [
  {
    src: '/images/legacy/1986-club-alpin-francais.jpg',
    year: '1986',
    caption:
      'Club Alpin Français, Section de Provence — Skardu to Karimabad over the Biafo and Hispar glaciers',
    alt: 'Typed letter on Club Alpin Français letterhead, summer 1986, recommending Youssouf Mohamad after a crossing from Skardu to Karimabad via the Biafo and Hispar glaciers, signed by Jacques Kelle, president of the Provence section, with the club stamp.',
  },
  {
    src: '/images/legacy/1990-exodus-batura-trek.jpg',
    year: '1990',
    caption: 'Exodus Expeditions, London — Batura Trek, signed by the tour leader',
    alt: 'Handwritten letter on Exodus Expeditions letterhead dated 23 August 1990, recommending Mohamid Jousef as an excellent cook and guide who produced wonderful food and was always cheerful and reliable.',
  },
  {
    src: '/images/legacy/1990-trekking-group-card.jpg',
    year: '1990',
    caption:
      'A card signed by an entire trekking group — "your cooking was much appreciated by all of us"',
    alt: 'A postcard dated 23 August 1990 addressed to Mohammed Youssuf, reading "Your cooking was much appreciated by all of us", signed in ink by around a dozen members of the trekking group.',
  },
  {
    src: '/images/legacy/1991-swiss-gasherbrum-ii.jpg',
    year: '1991',
    caption: 'Swiss Gasherbrum II Expedition — signed by expedition leader Nicole Niquille',
    alt: 'Handwritten letter on graph paper dated 6 July 1991 from the Swiss Gasherbrum II Expedition, certifying Youssouf of Khane as their base camp cook, noting the cookies and chapatis he prepared for the high camps, and recommending him strongly, signed by expedition leader Nicole Niquille.',
  },
  {
    src: '/images/legacy/1991-focus-baltoro-trek.jpg',
    year: '1991',
    caption: 'Focus Agency, Italy — Baltoro Trekking, signed at Skardu by the whole group',
    alt: 'Letter on Focus agency letterhead written at Skardu on 21 August 1991, in which the Italian Baltoro Trekking group thank their cook Yusuf Janjonga for his skill and good temper in very difficult conditions, signed by nine group members.',
  },
  {
    src: '/images/legacy/1993-dutch-k2-expedition.jpg',
    year: '1993',
    caption: 'Dutch–International K2 Expedition — reached 7,000 m on the Abruzzi Spur',
    alt: 'Typed letter on Dutch International K2 Expedition 1993 letterhead recommending Yousouf Janjungpa as a strong and kind high-altitude porter who reached 7,000 metres on the Abruzzi Spur in very bad weather, signed by expedition leader Wim van Harskamp.',
  },
];

export interface LegacyProps {
  /**
   * Show only the first N letters. The homepage runs a three-letter taster; the
   * About page, where someone has actively gone looking, shows all six.
   */
  limit?: number;
  /** When set, a link to the full archive appears below the grid. */
  moreHref?: string;
  /** DOM id, so the nav can deep-link straight to the archive. */
  id?: string;
}

export function Legacy({ limit, moreHref, id }: LegacyProps = {}) {
  const shown = limit ? LETTERS.slice(0, limit) : LETTERS;
  const hasMore = shown.length < LETTERS.length;

  return (
    <Section
      id={id}
      ariaLabel="A legacy that started generations ago"
      className="scroll-mt-24 bg-slate-50 dark:bg-[#0d1117]"
    >
      <Container>
        <SectionHeading
          variant="display"
          align="center"
          eyebrow="Our family archive"
          title="A Legacy That Started Generations Ago"
          description={
            <>
              <p>
                Long before our own tourism company took shape, our family was already serving
                international travellers visiting Pakistan. Our father worked alongside foreign
                groups, providing cooking and hospitality services during their journeys across the
                country.
              </p>
              <p>
                These original handwritten letters, received decades ago, are a treasured part of
                our family archive and a reminder of the hospitality and service values that
                continue to guide us today.
              </p>
            </>
          }
        />

        <ul className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((letter) => (
            <li key={letter.src}>
              <figure className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_2px_14px_rgb(0_0_0/0.07)] dark:border-slate-800 dark:bg-slate-900">
                <a
                  href={letter.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-visible:ring-brand-600 group relative block overflow-hidden bg-slate-100 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset dark:bg-slate-800"
                >
                  <Image
                    src={letter.src}
                    alt={letter.alt}
                    width={1200}
                    height={1600}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="h-[280px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  <span className="bg-brand-700/90 absolute top-3 left-3 rounded px-2 py-1 text-[11px] font-bold tracking-[0.1em] text-white">
                    {letter.year}
                  </span>
                </a>
                <figcaption className="flex grow flex-col gap-2 p-5">
                  <p className="text-[14px] leading-[1.6] text-slate-700 dark:text-slate-300">
                    {letter.caption}
                  </p>
                  <a
                    href={letter.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 mt-auto text-[13px] font-semibold underline underline-offset-4"
                  >
                    Read the full letter
                  </a>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {hasMore && moreHref && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href={moreHref}>
                See all {LETTERS.length} letters
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
