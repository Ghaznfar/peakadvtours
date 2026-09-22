import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

/** Custom 404 page. */
export default function NotFound() {
  return (
    <Section spacing="lg" ariaLabel="Page not found">
      <Container size="sm" className="text-center">
        <p className="text-brand-700 dark:text-brand-400 text-sm font-semibold">404</p>
        <h1 className="text-h1 mt-3">We could not find that page</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          The page may have moved. Try browsing our trips or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/trips">Browse trips</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
