import type { SVGProps } from 'react';

/**
 * Minimal, generic social glyphs. lucide-react no longer ships trademarked
 * brand icons, so these lightweight placeholders keep the footer self-contained.
 * The client can replace them with their preferred brand-icon set at handoff.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
} as const;

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.6V4.6C16.9 4.5 16 4.4 15 4.4c-2.2 0-3.7 1.3-3.7 3.8v2.1H8.6V14h2.7v8h2.2z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.3 5.2 12 5.2 12 5.2s-7.3 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.6.4 8.9.4 8.9.4s7.3 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15V9l5.2 3z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8L2.6 3h6.1l4.2 5.6zm-1 16h1.7L7.6 4.8H5.8z" />
    </svg>
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M16.5 2h-3.1v13.6a2.9 2.9 0 1 1-2.9-2.9c.2 0 .4 0 .6.1V9.7a6 6 0 0 0-.6 0A6 6 0 1 0 16.5 15.7V9.4a8.6 8.6 0 0 0 4.9 1.6V7.9a5.4 5.4 0 0 1-4.9-5.9z" />
    </svg>
  );
}
