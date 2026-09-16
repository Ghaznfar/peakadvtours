import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional "view all" style link shown beside the heading. */
  action?: { label: string; href: string };
  /** Center the heading block (used for full-width marketing sections). */
  align?: 'left' | 'center';
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
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
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
          <p className="text-brand-700 text-sm font-semibold tracking-wider uppercase">{eyebrow}</p>
        )}
        <Heading className="text-h2 mt-2">{title}</Heading>
        {description && <p className="mt-3 text-slate-600">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-brand-700 hover:text-brand-800 inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          {action.label}
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      )}
    </div>
  );
}
