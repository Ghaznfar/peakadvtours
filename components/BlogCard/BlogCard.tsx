import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import type { BlogPost } from '@/types/content';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Badge } from '@/components/ui/Badge';

export interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
  className?: string;
}

/** Image-led card for a blog listing tile. Pure/presentational. */
export function BlogCard({ post, priority = false, className }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group rounded-card focus-visible:ring-ring bg-card flex flex-col overflow-hidden border border-slate-200 shadow-sm transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-slate-800 dark:shadow-black/30 dark:hover:border-slate-700',
        className,
      )}
    >
      <OptimizedImage
        image={post.coverImage}
        aspectRatio="16 / 10"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        priority={priority}
        className="transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <Badge>{post.category}</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDate(post.publishedAt)}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
        <span className="text-brand-700 dark:text-brand-400 mt-auto inline-flex items-center gap-1 text-sm font-medium">
          Read more
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
