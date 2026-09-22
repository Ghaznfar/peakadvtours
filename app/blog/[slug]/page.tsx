import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { formatDate } from '@/lib/utils/format';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CtaBanner } from '@/components/ui/CtaBanner';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return buildMetadata({ title: 'Post not found', noindex: true });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article>
      <Section spacing="sm" ariaLabel="Blog post">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge>{post.category}</Badge>
              <span className="text-sm text-slate-500 dark:text-slate-500">{formatDate(post.publishedAt)}</span>
              {post.readingTimeMin && (
                <span className="text-sm text-slate-500 dark:text-slate-500">· {post.readingTimeMin} min read</span>
              )}
            </div>
            <h1 className="text-h1 mt-3">{post.title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">By {post.author}</p>
          </div>

          <div className="mt-8 max-w-3xl">
            <OptimizedImage image={post.coverImage} aspectRatio="16 / 9" priority />
          </div>

          {post.body && (
            <div
              className="[&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-slate-600 mt-10 max-w-3xl"
              // Body is our own local/CMS placeholder HTML — never raw user input.
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          )}
        </Container>
      </Section>

      <CtaBanner
        heading="Have a trip in mind?"
        body="Tell us your dates and destination and we'll build an itinerary around them."
        primary={{ label: 'Start planning', href: '/custom-trips' }}
      />
    </article>
  );
}
