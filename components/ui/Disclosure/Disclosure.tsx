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
    <details open={defaultOpen} className={cn('group border-b border-slate-200', className)}>
      <summary className="focus-visible:ring-brand-600 flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-slate-900 focus-visible:ring-2 focus-visible:outline-none [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <ChevronDown
          aria-hidden
          className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pb-4 text-slate-600">{children}</div>
    </details>
  );
}
