import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses and protects the personal information you share with us.`,
  path: '/privacy',
});

const SECTIONS = [
  {
    heading: '1. What this covers',
    body: `This policy explains how ${siteConfig.name} collects and uses personal information submitted through this website (enquiry forms, WhatsApp, email and phone). PLACEHOLDER — replace with your reviewed, jurisdiction-specific policy before launch.`,
  },
  {
    heading: '2. What we collect',
    body: 'Name, email, phone number, and any trip preferences, dates or messages you enter into an enquiry form. We do not collect payment card details through this website.',
  },
  {
    heading: '3. How we use it',
    body: 'To respond to your enquiry, prepare a quote or itinerary, and, if you book, to arrange your trip. With your consent, we may also send occasional trip-planning updates — you can opt out at any time.',
  },
  {
    heading: '4. Who we share it with',
    body: 'Only the local guides, drivers and accommodation partners needed to deliver a trip you book, and any service provider we use to send email or manage enquiries (e.g. our email delivery provider). We do not sell personal information.',
  },
  {
    heading: '5. How long we keep it',
    body: 'Enquiry details are kept only as long as needed to respond to you and, if you book, to deliver and account for your trip, after which they are deleted or anonymised. PLACEHOLDER — set a specific retention period with your legal advisor.',
  },
  {
    heading: '6. Your rights',
    body: 'You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it, by emailing the address on our Contact page.',
  },
  {
    heading: '7. Cookies',
    body: 'This site may use basic analytics to understand which pages are useful. PLACEHOLDER — list the specific analytics/cookie tools in use once selected, with a cookie consent banner if required in your jurisdiction.',
  },
  {
    heading: '8. Contact',
    body: `Questions about this policy can be sent to ${siteConfig.contact.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <Section spacing="sm" ariaLabel="Privacy policy">
      <Container>
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy policy' }]} />
        <div className="mt-4 max-w-3xl">
          <h1 className="text-h1 mt-2">Privacy policy</h1>
          <p className="mt-3 text-slate-600">
            This is a placeholder policy provided as a starting structure. Have it reviewed by a
            qualified lawyer for your jurisdiction (e.g. GDPR, CCPA) before this site goes live.
          </p>
        </div>

        <div className="mt-10 max-w-3xl space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {section.heading}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-600">{section.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
