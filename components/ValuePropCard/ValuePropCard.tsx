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
        'rounded-card flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <span
        aria-hidden
        className="bg-brand-50 text-brand-700 inline-flex size-12 items-center justify-center rounded-xl"
      >
        <DynamicIcon name={valueProp.icon} className="size-6" />
      </span>
      <h3 className="font-display mt-4 text-lg font-semibold text-slate-900">{valueProp.title}</h3>
      {valueProp.subhead && (
        <p className="text-brand-700 text-sm font-medium">{valueProp.subhead}</p>
      )}
      <p className="mt-2 text-sm text-slate-600">{valueProp.body}</p>
    </div>
  );
}
