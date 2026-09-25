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

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.4A9.6 9.6 0 0 0 3.7 16.8L2.4 21.6l4.9-1.3A9.6 9.6 0 1 0 12 2.4zm0 1.9a7.7 7.7 0 1 1-4 14.3l-.3-.2-2.6.7.7-2.5-.2-.3A7.7 7.7 0 0 1 12 4.3zm-3.3 4a.8.8 0 0 0-.6.3 2.4 2.4 0 0 0-.8 1.8c0 1 .8 2.1 .9 2.2a8.4 8.4 0 0 0 3.4 3c1.6.7 1.9.5 2.3.5a2 2 0 0 0 1.4-.9 1.7 1.7 0 0 0 .1-.9c0-.1-.2-.2-.4-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.7c-.1.2-.2.2-.4.1a6.3 6.3 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.3.1-.4l.4-.5a1 1 0 0 0 .2-.3.4.4 0 0 0 0-.4L8.9 8.6c-.1-.3-.2-.3-.4-.3z" />
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

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2.01.04-2.88.18-.76 1.17-4.97 1.17-4.97s-.3-.6-.3-1.49c0-1.39.81-2.43 1.81-2.43.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.81 1.49 1.81 1.78 0 3.15-1.88 3.15-4.59 0-2.4-1.72-4.08-4.19-4.08-2.85 0-4.53 2.14-4.53 4.35 0 .86.33 1.79.75 2.29a.3.3 0 0 1 .07.29c-.08.32-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.47 0 6.16 2.47 6.16 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.29-1.15l-.63 2.38c-.23.87-.84 1.97-1.25 2.63.94.29 1.94.45 2.98.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}
