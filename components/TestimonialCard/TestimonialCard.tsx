import { Quote, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/initials';
import type { Testimonial } from '@/types/content';

export interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

/** A single review card with an accessible star rating and attribution. */
export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const { author, location, tripLabel, quote, rating, date } = testimonial;

  return (
    <figure
      className={cn(
        'rounded-card bg-card flex h-full flex-col border border-slate-200 p-6 shadow-sm dark:border-slate-800 dark:shadow-black/30',
        className,
      )}
    >
      <Quote aria-hidden className="text-brand-200 dark:text-brand-800 size-8" />

      {typeof rating === 'number' && (
        <div className="mt-3 flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden
              className={cn(
                'size-4',
                i < rating
                  ? 'fill-accent-500 text-accent-500'
                  : 'text-slate-300 dark:text-slate-700',
              )}
            />
          ))}
        </div>
      )}

      <blockquote className="mt-3 flex-1 text-slate-700 dark:text-slate-300">
        <p>“{quote}”</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <span
          aria-hidden
          className="bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300 inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
        >
          {getInitials(author)}
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-slate-900 dark:text-white">{author}</span>
          <span className="block text-slate-500 dark:text-slate-500">
            {[tripLabel, location, date].filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
