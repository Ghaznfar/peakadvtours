import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DisclosureProps {
  /** The always-visible header content (rendered inside <summary>). */
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /**
   * `onDark` is for panels that sit on a photograph or a dark band — each row
   * becomes a bordered translucent box rather than a rule-separated list.
   */
  variant?: 'default' | 'onDark';
  /** `left` puts the chevron before the label, as itinerary lists usually do. */
  chevronPosition?: 'left' | 'right';
  className?: string;
}

/**
 * Accessible accordion item built on native <details>/<summary>: full keyboard
 * support (Enter/Space toggles, focusable) and correct semantics with zero JS.
 * The chevron rotates via the `open` state.
 */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  variant = 'default',
  chevronPosition = 'right',
  className,
}: DisclosureProps) {
  const onDark = variant === 'onDark';
  const chevronLeft = chevronPosition === 'left';

  const chevron = (
    <ChevronDown
      aria-hidden
      className={cn(
        'size-5 shrink-0 transition-transform group-open:rotate-180',
        onDark ? 'text-white/70' : 'text-slate-400 dark:text-slate-500',
      )}
    />
  );

  return (
    <details
      open={defaultOpen}
      className={cn(
        'group',
        onDark
          ? 'mb-2.5 rounded-sm border border-white/25 bg-white/[0.07] px-5 backdrop-blur-[2px] last:mb-0 open:bg-white/[0.12]'
          : 'border-b border-slate-200 dark:border-slate-800',
        className,
      )}
    >
      <summary
        className={cn(
          'focus-visible:ring-ring flex cursor-pointer list-none items-center gap-4 py-4 text-left focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden',
          // Left-chevron rows read as a list, so the label takes the remaining
          // width instead of being pushed apart from the icon.
          chevronLeft ? 'justify-start' : 'justify-between',
          onDark ? 'font-semibold text-white' : 'font-medium text-slate-900 dark:text-slate-100',
        )}
      >
        {chevronLeft && chevron}
        <span className={cn(chevronLeft && 'min-w-0 flex-1')}>{summary}</span>
        {!chevronLeft && chevron}
      </summary>
      <div className={cn('pb-4', onDark ? 'text-slate-200' : 'text-muted-foreground')}>
        {children}
      </div>
    </details>
  );
}
