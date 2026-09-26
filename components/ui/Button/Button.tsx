import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export const buttonVariants = cva(
  // Base — includes accessible focus ring and disabled handling. Min height
  // keeps tap targets >= 44px on touch (CLAUDE.md §7).
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-[color,background-color,transform] duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'active:scale-[0.97] motion-reduce:active:scale-100 ' +
    'disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-600 dark:bg-brand-500 dark:hover:bg-brand-400 dark:focus-visible:ring-brand-400',
        secondary:
          'bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:ring-slate-300',
        outline:
          'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-brand-600 dark:border-slate-700 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-brand-400',
        // For bands that are dark in BOTH themes (the enquiry band, the
        // footer). `outline` cannot be reused there: it sets `bg-white` in
        // light mode, so white label text on it is invisible until hover
        // repaints the background. This variant carries no `dark:` classes on
        // purpose — the surface does not change with the theme.
        outlineOnDark:
          'border border-white/30 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        ghost:
          'text-slate-800 hover:bg-slate-100 focus-visible:ring-brand-600 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-brand-400',
        accent: 'bg-accent-500 text-slate-950 hover:bg-accent-600 focus-visible:ring-accent-500',
        whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark focus-visible:ring-whatsapp',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. a Next.js `<Link>`) while keeping styles. */
  asChild?: boolean;
}

/**
 * Primary interactive control. Use `asChild` to style a link as a button:
 * `<Button asChild><Link href="/tours">Browse</Link></Button>`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, fullWidth, asChild = false, type, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      // Only set a default `type` on real buttons, not slotted links.
      type={asChild ? undefined : (type ?? 'button')}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
});
