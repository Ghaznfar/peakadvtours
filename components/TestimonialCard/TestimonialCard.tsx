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
        'rounded-card flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm',
        className,
      )}
    >
      <Quote aria-hidden className="text-brand-200 size-8" />

      {typeof rating === 'number' && (
        <div className="mt-3 flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden
              className={cn(
                'size-4',
                i < rating ? 'fill-accent-500 text-accent-500' : 'text-slate-300',
              )}
            />
          ))}
        </div>
      )}

      <blockquote className="mt-3 flex-1 text-slate-700">
        <p>“{quote}”</p>
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
        <span
          aria-hidden
          className="bg-brand-100 text-brand-800 inline-flex size-10 items-center justify-center rounded-full text-sm font-semibold"
        >
          {getInitials(author)}
        </span>
        <span className="text-sm">
          <span className="block font-semibold text-slate-900">{author}</span>
          <span className="block text-slate-500">
            {[tripLabel, location, date].filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
