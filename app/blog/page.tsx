import Link from 'next/link';
import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BlogCard } from '@/components/BlogCard';

export const metadata = buildMetadata({
  title: 'Pakistan Travel Guides',
  description:
    'Trip-planning guides, destination notes and booking explainers from our own trip planners and guides.',
  path: '/blog',
});

/**
 * The five sections, in reading order: where to go, then how to get there,
 * then the harder trips, then the practical detail, then news. Keys match the
 * `category` options on the `blogPost` schema, so a post lands in its section
 * automatically. A section with no posts is skipped.
 */
const SECTIONS: Array<{ key: string; title: string; intro: string }> = [
  {
    key: 'guide',
    title: 'Destination guides',
    intro:
      'The long reads. The question each answered for us — where to go, when, and what the trip is actually like.',
  },
  {
    key: 'route',
    title: 'Routes & road conditions',
    intro:
      'What the Karakoram Highway and the side valleys are doing right now, and what that means for a drive.',
  },
  {
    key: 'trekking',
    title: 'Trekking & high altitude',
    intro:
      'Choosing a trek, training for one, and what the altitude asks of you before you commit to either.',
  },
  {
    key: 'planning',
    title: 'Planning & practical advice',
    intro:
      'Visas, deposits, packing, connectivity and the small things that decide whether a trip runs smoothly.',
  },
  {
    key: 'news',
    title: 'News & insights',
    intro: 'What is changing in Pakistani tourism, from the people watching it change.',
  },
];

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const grouped = SECTIONS.map((section) => ({
    ...section,
    posts: posts.filter((p) => p.category === section.key),
  })).filter((section) => section.posts.length > 0);

  // Anything whose category is unset or no longer in the list would otherwise
  // vanish from the page entirely — collect it rather than lose it.
  const uncategorised = posts.filter((p) => !SECTIONS.some((s) => s.key === p.category));

  return (
    <>
      <PageHero
        eyebrow="Written by the people who drive the roads"
        title="Pakistan Travel Guides"
        heroImage={{
          src: '/images/banners/bannerpost.avif',
          alt: 'Autumn foliage framing a snow-capped peak, with golden poplars along the valley floor',
        }}
      />

      <Section spacing="sm" ariaLabel="Blog">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
          {/* No second heading here: the client supplied a banner eyebrow and
              title only, then this intro. Styled to match a display heading's
              description so the page still reads like the others. */}
          <div className="mx-auto mt-6 max-w-[66ch] space-y-3 text-center text-[14.5px] text-slate-600 dark:text-slate-400">
            <p>
              Everything below is written by the people who run the trips — the planners in the{' '}
              {siteConfig.contact.address.city} office and the guides and drivers on the road.
              Nothing here is written to fill a page. Each guide answers one question we are asked
              often enough on the phone that it deserved a proper answer, and the answers are the
              ones we give when someone asks us directly, including the parts that are inconvenient.
            </p>
            <p>
              If you are still deciding where to go, start with the best time to visit Pakistan and
              the honest answer on safety. If you have chosen and are getting ready, the visa guide
              and the packing list are the two that save the most trouble. For the trips themselves,
              see our{' '}
              <Link href="/tours" className="text-brand-600 hover:text-brand-700 font-medium">
                Pakistan tour packages
              </Link>
              ,{' '}
              <Link href="/treks" className="text-brand-600 hover:text-brand-700 font-medium">
                guided treks
              </Link>{' '}
              and{' '}
              <Link href="/expeditions" className="text-brand-600 hover:text-brand-700 font-medium">
                expeditions
              </Link>
              .
            </p>
          </div>

          {posts.length === 0 && (
            <p className="rounded-card mt-10 border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-400">
              No guides published yet — check back soon.
            </p>
          )}

          {[
            ...grouped,
            ...(uncategorised.length > 0
              ? [{ key: 'other', title: 'More guides', intro: '', posts: uncategorised }]
              : []),
          ].map((section, si) => (
            <section key={section.key} aria-labelledby={`${section.key}-h`} className="mt-14">
              <h2
                id={`${section.key}-h`}
                className="text-[clamp(20px,2.4vw,26px)] font-extrabold tracking-[0.04em] text-slate-900 uppercase dark:text-slate-50"
              >
                {section.title}
              </h2>
              <span aria-hidden className="bg-brand-500 mt-3 block h-[3px] w-14" />
              {section.intro && (
                <p className="mt-3 max-w-[70ch] text-[14.5px] text-slate-600 dark:text-slate-400">
                  {section.intro}
                </p>
              )}
              <ul className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.posts.map((post, i) => (
                  <li key={post.slug}>
                    <BlogCard post={post} priority={si === 0 && i === 0} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Container>
      </Section>
    </>
  );
}
