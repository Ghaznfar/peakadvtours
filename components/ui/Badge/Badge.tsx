import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium leading-none',
  {
    variants: {
      tone: {
        neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
        brand: 'bg-brand-600 text-white dark:bg-brand-500',
        accent: 'bg-accent-500 text-slate-950',
        outline:
          'border border-slate-300 bg-white/80 text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
        warning: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

/** Small status/label pill (trip type, promo, difficulty, etc.). */
export function Badge({ children, tone, size, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)}>{children}</span>;
}
