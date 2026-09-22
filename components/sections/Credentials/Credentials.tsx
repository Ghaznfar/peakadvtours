import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/animation/Reveal';
import type { Credential } from '@/types/content';

export interface CredentialsProps {
  credentials: Credential[];
}

/**
 * Certifications / partners strip. Uses neutral placeholder "logo" chips — the
 * client supplies real, verifiable accreditation logos at handoff. Never invent
 * credentials (CLAUDE.md §2).
 */
export function Credentials({ credentials }: CredentialsProps) {
  if (credentials.length === 0) return null;
  return (
    <Section
      spacing="sm"
      ariaLabel="Accreditations and partners"
      className="border-y border-slate-200"
    >
      <Container>
        <p className="text-center text-sm font-semibold tracking-wider text-slate-500 uppercase">
          Licensed, accredited &amp; trusted
        </p>
        <Reveal as="ul" className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {credentials.map((c) => (
            <li key={c.id}>
              <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                <span
                  aria-hidden
                  className="inline-flex size-8 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-500"
                >
                  {c.abbr ?? c.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-slate-600">{c.name}</span>
              </span>
            </li>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
