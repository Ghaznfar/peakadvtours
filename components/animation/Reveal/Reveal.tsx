'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface RevealProps {
  children: ReactNode;
  /** Element/tag to render (defaults to `div`). */
  as?: ElementType;
  /** Stagger delay in ms — used for sequential entrances in a grid/list. */
  delayMs?: number;
  className?: string;
}

/**
 * Fades + translates children up as they enter the viewport, using a single
 * shared IntersectionObserver instance (not one listener per element) and
 * plain CSS transitions (`transform`/`opacity` only — no layout properties).
 * Renders children fully visible immediately if JS hasn't hydrated yet or the
 * user prefers reduced motion, so content is never gated behind animation.
 */
export function Reveal({ children, as: Tag = 'div', delayMs = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={visible ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={cn(
        'transition-all duration-700 ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
