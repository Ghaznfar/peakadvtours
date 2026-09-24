import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
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
      <Container size="nav" className="flex min-h-[74px] items-center justify-between gap-[18px]">
        <Link href="/" aria-label="Home" className="flex flex-none items-center">
          {/* 48px, not the reference's 34px: theirs is a wide wordmark that
              reads at that height, ours is a square mark that would look lost.
              Leaves 13px of breathing room inside the 74px bar. */}
          <Image
            src={logo.src}
            alt={logo.alt}
            width={96}
            height={96}
            priority
            className="size-12 rounded-full object-cover"
          />
        </Link>

        <MegaMenu items={menu} />

        {/* Utility actions — phone lives in the top utility bar */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden lg:inline-flex" />
          <MobileNav />
        </div>
      </Container>
    </HeaderShell>
  );
}
