import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MobileNav } from '@/components/layout/MobileNav';

/**
 * Sticky site header. Server component — the desktop dropdowns are pure CSS
 * (open on hover and on keyboard focus of the trigger), so no client JS ships
 * for the desktop nav. Only the mobile drawer (`MobileNav`) is a client island.
 */
export function SiteHeader() {
  const { nav, contact, name } = siteConfig;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo — text-based placeholder; swap for an <OptimizedImage> logo. */}
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <span
            aria-hidden
            className="bg-brand-600 inline-flex size-8 items-center justify-center rounded-md text-sm font-bold text-white"
          >
            PA
          </span>
          <span>{name}</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      aria-hidden
                      className="size-4 text-slate-400 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute top-full left-0 z-50 w-64 translate-y-1 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-3 py-2 hover:bg-slate-50"
                          >
                            <span className="block text-sm font-medium text-slate-800">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-slate-500">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Utility actions */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            className="hover:text-brand-700 hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 xl:inline-flex"
          >
            <Phone aria-hidden className="size-4" />
            <span>{contact.phone}</span>
          </a>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Enquire</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
