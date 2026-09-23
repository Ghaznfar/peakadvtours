'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useTheme } from '@/components/theme/ThemeProvider';

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Sun/moon theme toggle. A fixed-size icon button so toggling never shifts
 * layout; both icons are always in the DOM (cross-faded via opacity) rather
 * than conditionally rendered, avoiding any hydration mismatch between
 * server-rendered and client-hydrated icon state.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'focus-visible:ring-ring relative inline-flex size-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:outline-none dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800',
        className,
      )}
    >
      <Sun
        aria-hidden
        className={cn(
          'absolute size-5 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-50 opacity-0' : 'scale-100 opacity-100',
        )}
      />
      <Moon
        aria-hidden
        className={cn(
          'absolute size-5 transition-all duration-300 motion-reduce:transition-none',
          isDark ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
      />
    </button>
  );
}
