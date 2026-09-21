import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { JsonLd } from '@/lib/seo/JsonLd';
import { faqSchema } from '@/lib/seo/tripJsonLd';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Disclosure } from '@/components/ui/Disclosure';
import { CtaBanner } from '@/components/ui/CtaBanner';

export const metadata = buildMetadata({
  title: 'Booking Info',
  description:
    'How booking, deposits, payment and cancellations work when you book a tour, trek or expedition with us.',
  path: '/booking-info',
});

const STEPS = [
  {
    title: 'Choose a departure or ask us to build one',
    body: 'Pick a scheduled trip, or send your dates and group size and a trip planner will design one around them.',
  },
  {
    title: 'Pay a deposit to hold your place',
    body: 'Each trip page shows the deposit required (typically a percentage of the total price). You get written confirmation once it clears.',
  },
  {
    title: 'Settle the balance before departure',
    body: 'The remaining balance is due by the date on your confirmation — no surprise charges on the day.',
  },
  {
    title: 'Travel',
    body: 'Your guide meets you at the start point listed on the trip page. Everything marked "included" is already paid for.',
  },
];

const FAQS = [
  {
    question: 'How much deposit do I need to pay?',
    answer:
      'It varies by trip and is shown on each trip page (commonly around 20–30% of the total price). The exact figure is confirmed when you book.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'PLACEHOLDER — list your accepted methods (bank transfer, card, etc.) once your payment provider is set up.',
  },
  {
    question: 'Can I change my dates after booking?',
    answer:
      'Often, subject to availability and how close to departure the request is made. Contact us as early as possible — see our booking terms for the full policy.',
  },
  {
    question: 'What happens if I need to cancel?',
    answer:
      'Cancellation charges depend on how far ahead of departure you cancel. Full detail is in our booking terms.',
  },
  {
    question: 'Do I need travel insurance?',
    answer:
      'Yes — comprehensive travel insurance covering medical treatment, evacuation and cancellation is required for every traveller on every trip.',
  },
];

export default function BookingInfoPage() {
  return (
    <>
      <Section spacing="sm" ariaLabel="Booking info">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Booking info' }]} />
          <div className="mt-4 max-w-2xl">
            <h1 className="text-h1 mt-2">Booking info</h1>
            <p className="mt-3 text-slate-600">
              How booking, payment and cancellations work when you travel with{' '}
              {siteConfig.name}.
            </p>
          </div>

          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-card border border-slate-200 bg-white p-5">
                <span className="font-display text-sm font-semibold text-slate-400">
                  Step {i + 1}
                </span>
                <h2 className="font-display mt-2 text-base font-semibold text-slate-900">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-14 max-w-3xl">
            <h2 className="text-h3">Frequently asked questions</h2>
            <div className="mt-4">
              {FAQS.map((faq) => (
                <Disclosure key={faq.question} summary={faq.question}>
                  <p>{faq.answer}</p>
                </Disclosure>
              ))}
            </div>
          </div>
          <JsonLd data={faqSchema(FAQS)} />
        </Container>
      </Section>

      <CtaBanner
        heading="Still have questions?"
        body="A trip planner can walk you through the details before you book."
        primary={{ label: 'Contact us', href: '/contact' }}
      />
    </>
  );
}
