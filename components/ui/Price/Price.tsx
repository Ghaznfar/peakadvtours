import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format';
import type { Price as PriceType } from '@/types/content';

export interface PriceProps {
  price: PriceType;
  locale?: string;
  /** Show the "From … per person" framing used on cards. */
  showFrom?: boolean;
  className?: string;
}

/**
 * Displays a price with an optional struck-through original amount and a
 * "From / per person" framing. Uses locale-aware currency formatting.
 */
export function Price({ price, locale, showFrom = true, className }: PriceProps) {
  const { current, original } = formatPrice(price, locale);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      {showFrom && <span className="text-xs text-slate-500">From</span>}
      {original && (
        <span className="text-sm text-slate-400 line-through" aria-label={`Was ${original}`}>
          {original}
        </span>
      )}
      <span className="text-lg font-semibold text-slate-900">{current}</span>
      <span className="text-xs text-slate-500">/ person</span>
    </div>
  );
}
