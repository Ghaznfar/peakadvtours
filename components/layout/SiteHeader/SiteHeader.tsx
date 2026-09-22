import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Phone } from 'lucide-react';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MobileNav } from '@/components/layout/MobileNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { HeaderShell } from './HeaderShell';

/**
 * Sticky site header. Server component — the desktop dropdowns are pure CSS
 * (open on hover and on keyboard focus of the trigger), so no client JS ships
 * for the desktop nav. Only the mobile drawer (`MobileNav`) and the scroll-based
 * background transition (`HeaderShell`) are client islands.
 */
export function SiteHeader() {
  const { nav, contact, logo } = siteConfig;

  return (
    <HeaderShell>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Home" className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={56}
            height={56}
            priority
            className="size-14 rounded-full object-cover"
          />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      aria-hidden
                      className="size-4 text-slate-400 transition-transform group-focus-within:rotate-180 group-hover:rotate-180 dark:text-slate-500"
                    />
                  )}
                </Link>

                {item.children && (
                  <div className="invisible absolute top-full left-0 z-50 w-64 translate-y-1 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="bg-card overflow-hidden rounded-xl border border-slate-200 p-2 shadow-lg dark:border-slate-800">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-slate-500 dark:text-slate-400">
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
        <div className="flex items-center gap-1">
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
            className="hover:text-brand-700 hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 xl:inline-flex dark:text-slate-300 dark:hover:text-brand-400"
          >
            <Phone aria-hidden className="size-4" />
            <span>{contact.phone}</span>
          </a>
          <ThemeToggle className="hidden lg:inline-flex" />
          <Button asChild size="sm" className="ml-1 hidden sm:inline-flex">
            <Link href="/contact">Enquire</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </HeaderShell>
  );
}
