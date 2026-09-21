import { getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
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
    <Section spacing="sm" ariaLabel="Blog">
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog' }]} />
        <div className="mt-4 max-w-2xl">
          <p className="text-brand-700 text-sm font-semibold tracking-wider uppercase">
            Guides & news
          </p>
          <h1 className="text-h1 mt-2">Blog &amp; news</h1>
          <p className="mt-3 text-slate-600">
            Trip-planning guides, destination notes and booking explainers, written by the people
            who plan and guide our trips.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="mt-10 rounded-card border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
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
  );
}
