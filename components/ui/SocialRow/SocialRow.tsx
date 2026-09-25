import { getSocialLinks } from '@/lib/social';
import { cn } from '@/lib/utils/cn';

export interface SocialRowProps {
  /** Circle diameter. `sm` for the top bar, `md` for the footer. */
  size?: 'sm' | 'md';
  className?: string;
}

const SIZES = {
  sm: { circle: 'size-7', icon: 'size-[15px]', gap: 'gap-1.5' },
  md: { circle: 'size-9', icon: 'size-[18px]', gap: 'gap-2' },
} as const;

/**
 * The coloured social circles, shared by the top bar and the footer so both
 * stay identical in colour, order and content — only the diameter differs.
 *
 * A platform with no URL yet still renders, dimmed and non-interactive, rather
 * than being hidden or given a dead `href="#"`. That keeps the row visually
 * complete while the client supplies the links.
 */
export function SocialRow({ size = 'md', className }: SocialRowProps) {
  const links = getSocialLinks();
  const s = SIZES[size];

  return (
    <ul className={cn('flex flex-nowrap items-center', s.gap, className)}>
      {links.map(({ key, label, href, Icon, bg }) => (
        <li key={key}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={cn(
                'inline-flex items-center justify-center rounded-full text-white transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none motion-reduce:transform-none',
                s.circle,
                bg,
              )}
            >
              <Icon aria-hidden className={s.icon} />
            </a>
          ) : (
            <span
              role="img"
              aria-label={`${label} — link coming soon`}
              className={cn(
                'inline-flex items-center justify-center rounded-full text-white opacity-60',
                s.circle,
                bg,
              )}
            >
              <Icon aria-hidden className={s.icon} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
