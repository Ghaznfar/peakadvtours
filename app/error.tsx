'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/** Route error boundary. Must be a client component. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for logging; wire to an error reporter in production.
    console.error(error);
  }, [error]);

  return (
    <Section spacing="lg" ariaLabel="Error">
      <Container size="sm" className="text-center">
        <p className="text-brand-700 text-sm font-semibold">Something went wrong</p>
        <h1 className="text-h1 mt-3">We hit an unexpected error</h1>
        <p className="mt-4 text-slate-600">
          Please try again. If the problem continues, get in touch and we will help.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
