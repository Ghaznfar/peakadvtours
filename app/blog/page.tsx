import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BlogCard } from '@/components/BlogCard';

export const metadata = buildMetadata({
  title: 'Blog & News',
  description:
    'Trip-planning guides, destination notes and booking explainers from our own trip planners and guides.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="Guides &amp; news"
        title="Blog &amp; news"
        heroImage={{
          src: '/images/stock/trip-trek-hikers.jpg',
          alt: 'PLACEHOLDER — replace with a client photograph',
        }}
      />

      <Section spacing="sm" ariaLabel="Blog">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
          <div className="mt-4 max-w-2xl">
            <p className="text-slate-600 dark:text-slate-400">
              Trip-planning guides, destination notes and booking explainers, written by the people
              who plan and guide our trips.
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
