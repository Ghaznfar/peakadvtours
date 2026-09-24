import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface HeaderShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Sticky header chrome: a solid surface with a soft drop shadow at every
 * scroll position. Previously this faded from transparent to white on scroll,
 * which needed a client island; the header now reads as a fixed bar over the
 * hero instead, so this is a plain server component.
 */
export function HeaderShell({ children, className }: HeaderShellProps) {
  return (
    <header
      className={cn(
        'bg-card sticky top-0 z-40 shadow-[0_2px_8px_rgb(0_0_0/0.08)] dark:shadow-black/40',
        className,
      )}
    >
      {children}
    </header>
  );
}
