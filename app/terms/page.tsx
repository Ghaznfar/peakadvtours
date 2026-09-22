import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = buildMetadata({
  title: 'Booking Terms',
  description: `Booking, payment, cancellation and liability terms for trips booked with ${siteConfig.name}.`,
  path: '/terms',
});

const SECTIONS = [
  {
    heading: '1. These terms',
    body: `These booking terms govern any tour, trek or expedition booked with ${siteConfig.name} ("we", "us"). By paying a deposit or full payment you accept them. PLACEHOLDER — replace with your reviewed, jurisdiction-specific terms before launch.`,
  },
  {
    heading: '2. Booking and payment',
    body: 'A booking is confirmed once we receive your deposit (shown on each trip page) and issue written confirmation. The remaining balance is due on the date stated in your confirmation; unpaid balances may result in cancellation of your place.',
  },
  {
    heading: '3. Prices',
    body: 'Prices are per person, quoted in the currency shown, and include everything listed as "included" on the trip page. Prices may change before a deposit is paid; once confirmed, your price is held for the departure booked.',
  },
  {
    heading: '4. Cancellations by you',
    body: 'Cancellation charges are calculated from the date we receive written notice, as a percentage of the total price, increasing closer to departure. PLACEHOLDER — insert your actual cancellation scale (e.g. 60+ days: deposit only; 30–59 days: 50%; under 30 days: 100%).',
  },
  {
    heading: '5. Changes or cancellation by us',
    body: 'We may occasionally need to change or cancel a departure (e.g. insufficient numbers, local conditions). Where we cancel, you may transfer to another departure or receive a full refund of amounts paid to us.',
  },
  {
    heading: '6. Travel insurance',
    body: 'Comprehensive travel insurance covering medical treatment, evacuation, cancellation and personal belongings is required for every traveller and is not included in the trip price.',
  },
  {
    heading: '7. Health and fitness',
    body: 'You are responsible for confirming that you meet the fitness and health requirements stated on the trip page, and for informing us of any relevant medical condition before booking.',
  },
  {
    heading: '8. Liability',
    body: 'We are responsible for arranging your trip with reasonable skill and care. We are not liable for events outside our reasonable control (weather, strikes, political events, natural disasters) or for services not supplied by us or our agents.',
  },
  {
    heading: '9. Complaints',
    body: 'Any problem should be reported to your guide or trip leader immediately so it can be addressed on the ground. If unresolved, write to us within 28 days of your return.',
  },
  {
    heading: '10. Governing law',
    body: 'PLACEHOLDER — insert the governing jurisdiction with your legal advisor before launch.',
  },
];

export default function TermsPage() {
  return (
    <Section spacing="sm" ariaLabel="Booking terms">
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Booking terms' }]} />
        <div className="mt-4 max-w-3xl">
          <h1 className="text-h1 mt-2">Booking terms</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            These are placeholder booking terms provided as a starting structure. Have them
            reviewed by a qualified lawyer for your jurisdiction before this site goes live.
          </p>
        </div>

        <div className="mt-10 max-w-3xl space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {section.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
