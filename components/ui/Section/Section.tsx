import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const spacingMap = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16 lg:py-20',
  lg: 'py-16 md:py-24 lg:py-28',
} as const;

export interface SectionProps {
  children: ReactNode;
  /** Vertical rhythm. Defaults to `md`. */
  spacing?: keyof typeof spacingMap;
  as?: ElementType;
  id?: string;
  className?: string;
  /** Optional accessible label for the section landmark. */
  ariaLabel?: string;
}

/**
 * A full-width page section that enforces consistent vertical spacing.
 * Pair with `Container` for horizontal bounds.
 */
export function Section({
  children,
  spacing = 'md',
  as: Tag = 'section',
  id,
  className,
  ariaLabel,
}: SectionProps) {
  return (
    <Tag id={id} aria-label={ariaLabel} className={cn(spacingMap[spacing], className)}>
      {children}
    </Tag>
  );
}
