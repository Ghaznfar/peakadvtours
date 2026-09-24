'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Container } from '@/components/ui/Container';

/** An image tile in a mega-menu panel (a trip or a blog post). */
export interface MegaMenuTile {
  title: string;
  href: string;
  src: string;
  alt: string;
}

export interface MegaMenuLink {
  label: string;
  href: string;
}

export interface MegaMenuItem {
  label: string;
  href: string;
  /** Image tiles shown on hover. Sourced from the CMS by the container. */
  tiles?: MegaMenuTile[];
  /** Secondary text links shown under the tiles. */
  links?: MegaMenuLink[];
}

export interface MegaMenuProps {
  items: MegaMenuItem[];
}

const CLOSE_DELAY_MS = 120;

/**
 * Desktop primary navigation with full-width image mega-menu panels.
 *
 * Client island: the panels open on hover *and* keyboard focus, close on
 * Escape, and use a short close delay so moving the pointer between a nav
 * item and its panel doesn't flicker. Panel contents mount on first open, so
 * menu imagery isn't fetched on initial page load.
 */
export function MegaMenu({ items }: MegaMenuProps) {
  const pathname = usePathname();
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [mountedLabels, setMountedLabels] = useState<string[]>([]);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const open = useCallback(
    (label: string) => {
      cancelClose();
      setOpenLabel(label);
      setMountedLabels((current) => (current.includes(label) ? current : [...current, label]));
    },
    [cancelClose],
  );

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenLabel(null), CLOSE_DELAY_MS);
  }, [cancelClose]);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!openLabel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenLabel(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openLabel]);

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:block"
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenLabel(null);
      }}
    >
      {/* Spacing between items comes from each <li>'s horizontal padding, so the
          active underline sits under the label only — not under the gap. */}
      <ul className="flex items-center">
        {items.map((item) => {
          const hasPanel = Boolean(item.tiles?.length || item.links?.length);
          const isOpen = hasPanel && openLabel === item.label;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const highlighted = isOpen || isActive;

          return (
            <li key={item.href} className="px-[clamp(9px,1.25vw,20px)]">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={hasPanel ? isOpen : undefined}
                onMouseEnter={() => (hasPanel ? open(item.label) : scheduleClose())}
                onFocus={() => (hasPanel ? open(item.label) : setOpenLabel(null))}
                className={cn(
                  'relative inline-flex items-center gap-[7px] py-[25px] text-[clamp(13px,1.02vw,16px)] font-normal whitespace-nowrap transition-colors',
                  'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:transition-colors',
                  highlighted
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'hover:text-brand-500 dark:hover:text-brand-400 text-slate-700 dark:text-slate-300',
                  isActive ? 'after:bg-brand-500' : 'after:bg-transparent',
                )}
              >
                {item.label}
                {hasPanel && (
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      // Square, not the reference's 9x6: theirs is a filled
                      // triangle drawn in a 10:6 viewBox, ours is a stroked
                      // chevron that distorts if the aspect ratio is forced.
                      'size-[18px] shrink-0 transition-transform duration-150',
                      isOpen && 'rotate-180',
                    )}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {items.map((item) => {
        const hasPanel = Boolean(item.tiles?.length || item.links?.length);
        if (!hasPanel || !mountedLabels.includes(item.label)) return null;
        const isOpen = openLabel === item.label;

        return (
          <div
            key={`panel-${item.href}`}
            onMouseEnter={cancelClose}
            className={cn(
              'bg-card absolute inset-x-0 top-full z-50 border-b border-slate-200 shadow-xl transition-opacity duration-150 dark:border-slate-800',
              isOpen ? 'visible opacity-100' : 'invisible opacity-0',
            )}
          >
            {item.tiles && item.tiles.length > 0 && (
              <ul className="grid grid-cols-3 gap-1.5 p-1.5 xl:grid-cols-6">
                {item.tiles.map((tile) => (
                  <li key={tile.href}>
                    <Link
                      href={tile.href}
                      tabIndex={isOpen ? undefined : -1}
                      className="group focus-visible:ring-ring relative block aspect-4/3 overflow-hidden focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <Image
                        src={tile.src}
                        alt={tile.alt}
                        fill
                        sizes="(max-width: 1280px) 33vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"
                      />
                      <span className="absolute inset-x-0 bottom-0 p-3 text-xs font-bold tracking-wide text-white uppercase">
                        {tile.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {item.links && item.links.length > 0 && (
              <Container>
                <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4">
                  {item.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        tabIndex={isOpen ? undefined : -1}
                        className="hover:text-brand-700 dark:hover:text-brand-400 text-sm font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Container>
            )}
          </div>
        );
      })}
    </nav>
  );
}
