import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MobileNav } from '@/components/layout/MobileNav';
import { MegaMenu, type MegaMenuItem } from '@/components/layout/MegaMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { HeaderShell } from './HeaderShell';

export interface SiteHeaderProps {
  /** Nav + mega-menu tiles, built by the root layout from the CMS. */
  menu: MegaMenuItem[];
}

/**
 * Sticky site header. Server component; the client islands are the mobile
 * drawer (`MobileNav`), the desktop mega menu (`MegaMenu`) and the scroll-based
 * background transition (`HeaderShell`).
 */
export function SiteHeader({ menu }: SiteHeaderProps) {
  const { logo } = siteConfig;

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

        <MegaMenu items={menu} />

        {/* Utility actions — phone lives in the top utility bar */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:inline-flex" />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/contact">Enquire</Link>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </HeaderShell>
  );
}
