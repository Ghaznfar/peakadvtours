'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme context — no external dependency, matching the codebase's existing
 * "small custom primitive over a library" pattern (see `Reveal`/`useScrolled`).
 * Light is always the default for a first-time visitor (OS preference is
 * intentionally not used to pick the initial theme — see `THEME_INIT_SCRIPT`
 * in `app/layout.tsx`); dark only applies once the user explicitly toggles
 * it, and that choice is then persisted.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Matches whatever the blocking inline script already set on <html>, so
  // there's no mismatch between this state and the DOM at mount time.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage can throw in some privacy modes — theme still applies for this visit.
      }
      return next;
    });
  }, []);

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

/** Read the current theme + toggle function. Must be used within `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
