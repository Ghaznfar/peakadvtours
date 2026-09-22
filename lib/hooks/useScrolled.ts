'use client';

import { useEffect, useState } from 'react';

/**
 * True once the page has scrolled past `thresholdPx`. Uses a single passive
 * scroll listener (no per-frame work, no layout reads beyond `window.scrollY`)
 * so it's safe for a persistent element like the site header.
 */
export function useScrolled(thresholdPx = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > thresholdPx);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [thresholdPx]);

  return scrolled;
}
