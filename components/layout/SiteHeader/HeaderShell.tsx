'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { useScrolled } from '@/lib/hooks/useScrolled';

export interface HeaderShellProps {
  children: ReactNode;
}

/**
 * Thin client wrapper around the header element so the scroll-based
 * background/shadow transition can hydrate without making the whole header
 * (nav links, logo, etc.) a client component. Everything passed as
 * `children` stays server-rendered.
 */
export function HeaderShell({ children }: HeaderShellProps) {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-slate-200 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85'
          : 'border-transparent bg-white/70 backdrop-blur-sm',
      )}
    >
      {children}
    </header>
  );
}
