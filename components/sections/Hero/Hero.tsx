import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Star, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export interface HeroChip {
  label: string;
  href: string;
}

export interface HeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  chips?: HeroChip[];
}

/**
 * Cinematic hero. Full-bleed priority background (LCP image) with a legibility
 * gradient, headline, dual CTAs, quick category chips and a trust strip.
 * Fixed min-heights per breakpoint prevent layout shift.
 */
export function Hero({ eyebrow, title, subtitle, primary, secondary, chips = [] }: HeroProps) {
  return (
    <section
      aria-label="Introduction"
      className="bg-brand-950 relative flex min-h-[36rem] items-center overflow-hidden lg:min-h-[42rem]"
    >
      {/* Background image (LCP) */}
      <Image src="/images/hero.svg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20"
      />

      <Container className="relative py-16 lg:py-24">
        <div className="max-w-2xl text-white">
          <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wider text-white uppercase ring-1 ring-white/20 backdrop-blur ring-inset">
            {eyebrow}
          </p>
          <h1 className="text-display mt-5 text-white">{title}</h1>
          <p className="text-lead mt-5 max-w-xl text-white/90">{subtitle}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="lg">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight aria-hidden className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white/10 text-white ring-1 ring-white/30 backdrop-blur ring-inset hover:bg-white/20"
            >
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          </div>

          {chips.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <li key={chip.href}>
                  <Link
                    href={chip.href}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 transition-colors ring-inset hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Trust strip */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Star aria-hidden className="fill-accent-400 text-accent-400 size-4" />
              4.9/5 traveller rating
            </li>
            <li className="flex items-center gap-2">
              <Users aria-hidden className="size-4 text-white/70" />
              Small groups, max 12–14
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden className="size-4 text-white/70" />
              Licensed operator
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
