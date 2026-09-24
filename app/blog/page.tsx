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

export default async function BlogPage() {
  const posts = await getBlogPosts();

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

          {posts.length === 0 ? (
            <p className="rounded-card mt-10 border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-[#0d1117] dark:text-slate-400">
              No posts published yet — check back soon.
            </p>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <BlogCard post={post} priority={i === 0} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
