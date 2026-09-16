import { type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

const sizeMap = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
} as const;

export interface ContainerProps {
  children: ReactNode;
  /** Max content width. Defaults to `xl` (1280px). */
  size?: keyof typeof sizeMap;
  /** Render as a different element (e.g. `section`, `header`). */
  as?: ElementType;
  className?: string;
}

/**
 * Centres content and applies consistent responsive horizontal padding.
 * Every full-width section should wrap its content in a Container.
 */
export function Container({ children, size = 'xl', as: Tag = 'div', className }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeMap[size], className)}>
      {children}
    </Tag>
  );
}
