import type { ReactNode } from 'react';
import { Dancing_Script, Inter, Sora } from 'next/font/google';
import { defaultMetadata } from '@/lib/seo/metadata';
import { JsonLd, organizationSchema, websiteSchema } from '@/lib/seo/JsonLd';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { buildMegaMenu } from '@/lib/nav/megaMenu';
import './globals.css';

// Runs before hydration so the correct theme is applied on first paint — no
// light→dark (or dark→light) flash. Kept tiny and dependency-free. Light is
// the default for a first-time visitor; dark only applies once the user has
// explicitly chosen it (persisted in localStorage) — OS preference is not
// used to pick the initial theme.
const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

// Script accent used only for the hero eyebrow line — one weight, latin only.
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata = defaultMetadata;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const menu = await buildMegaMenu();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${dancingScript.variable}`}
      // The theme init script mutates this element's class before hydration
      // (by design — see THEME_INIT_SCRIPT), which would otherwise trigger a
      // false-positive hydration warning.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          {/* Skip link — first focusable element for keyboard/screen-reader users. */}
          <a
            href="#main-content"
            className="focus:bg-brand-700 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>

          <AnnouncementBar />
          <SiteHeader menu={menu} />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <WhatsAppButton />

          <JsonLd data={organizationSchema()} />
          <JsonLd data={websiteSchema()} />
        </ThemeProvider>
      </body>
    </html>
  );
}
