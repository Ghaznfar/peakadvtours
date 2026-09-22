import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { cn } from '@/lib/utils/cn';
import { JsonLd } from '@/lib/seo/JsonLd';

export interface Crumb {
  label: string;
  /** Omit href for the current page (last crumb). */
  href?: string;
}

export interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Accessible breadcrumb trail. Emits BreadcrumbList structured data
 * (see docs/SEO_PLAN.md §3). The current page is marked with aria-current.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-slate-500 dark:text-slate-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-700 dark:hover:text-brand-400 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-slate-700 dark:text-slate-200"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  aria-hidden
                  className="size-4 shrink-0 text-slate-400 dark:text-slate-600"
                />
              )}
            </li>
          );
        })}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
