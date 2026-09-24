import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  /**
   * A string renders as one paragraph. Pass JSX (several `<p>`s) for a longer
   * intro — it is wrapped in a spaced container rather than a `<p>`, so the
   * markup stays valid.
   */
  description?: ReactNode;
  /** Optional "view all" style link shown beside the heading. */
  action?: { label: string; href: string };
  /** Center the heading block (used for full-width marketing sections). */
  align?: 'left' | 'center';
  /**
   * `default` — small uppercase eyebrow, sentence-case title.
   * `display` — script eyebrow, heavy uppercase title and a short rule under
   * it. Used at the top of listing pages.
   */
  variant?: 'default' | 'display';
  /** Heading level for correct document outline. Defaults to h2. */
  as?: 'h2' | 'h3';
  className?: string;
}

/** Consistent section heading: eyebrow, title, description and optional action. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  variant = 'default',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  if (variant === 'display') {
    return (
      <div className={cn(centered ? 'text-center' : 'text-left', className)}>
        {eyebrow && (
          <span className="font-script block text-[26px] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </span>
        )}
        <Heading className="mt-0.5 text-[clamp(24px,3vw,34px)] font-extrabold tracking-[0.03em] text-slate-900 uppercase dark:text-slate-50">
          {title}
        </Heading>
        <span
          aria-hidden
          className={cn('bg-brand-500 mt-3.5 block h-[3px] w-14', centered ? 'mx-auto' : 'mr-auto')}
        />
        {description && (
          <div
            className={cn(
              'mt-3 max-w-[66ch] space-y-3 text-[14.5px] text-slate-600 dark:text-slate-400',
              centered && 'mx-auto',
            )}
          >
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        centered && 'sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'text-center')}>
        {eyebrow && (
          <p className="text-brand-700 dark:text-brand-400 text-sm font-semibold tracking-wider uppercase">
            {eyebrow}
          </p>
        )}
        <Heading className="text-h2 mt-2">{title}</Heading>
        {description && (
          <div className="mt-3 space-y-3 text-slate-600 dark:text-slate-400">
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          {action.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </div>
  );
}
