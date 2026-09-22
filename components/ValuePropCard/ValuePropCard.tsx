import { cn } from '@/lib/utils/cn';
import type { ValueProp } from '@/types/content';
import { DynamicIcon } from '@/components/ui/icons/iconMap';

export interface ValuePropCardProps {
  valueProp: ValueProp;
  className?: string;
}

/** A single "why choose us" trust card: icon, title, sub-head and body. */
export function ValuePropCard({ valueProp, className }: ValuePropCardProps) {
  return (
    <div
      className={cn(
        'rounded-card bg-card flex h-full flex-col border border-slate-200 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:shadow-black/30 dark:hover:border-slate-700',
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400 inline-flex size-12 items-center justify-center rounded-xl"
      >
        <DynamicIcon name={valueProp.icon} className="size-6" />
      </span>
      <h3 className="font-display mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {valueProp.title}
      </h3>
      {valueProp.subhead && (
        <p className="text-brand-700 dark:text-brand-400 text-sm font-medium">
          {valueProp.subhead}
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{valueProp.body}</p>
    </div>
  );
}
