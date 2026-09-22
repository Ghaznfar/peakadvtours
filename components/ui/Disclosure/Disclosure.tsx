import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface DisclosureProps {
  /** The always-visible header content (rendered inside <summary>). */
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/**
 * Accessible accordion item built on native <details>/<summary>: full keyboard
 * support (Enter/Space toggles, focusable) and correct semantics with zero JS.
 * The chevron rotates via the `open` state.
 */
export function Disclosure({ summary, children, defaultOpen = false, className }: DisclosureProps) {
  return (
    <details
      open={defaultOpen}
      className={cn('group border-b border-slate-200 dark:border-slate-800', className)}
    >
      <summary className="focus-visible:ring-ring flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-slate-900 focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden dark:text-slate-100">
        <span>{summary}</span>
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180 dark:text-slate-500"
        />
      </summary>
      <div className="text-muted-foreground pb-4">{children}</div>
    </details>
  );
}
