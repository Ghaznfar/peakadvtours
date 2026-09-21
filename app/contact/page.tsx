import { getCategories, getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Enquiry } from '@/components/sections/Enquiry';

export const metadata = buildMetadata({
  title: 'Contact Us',
  description: `Phone, email, WhatsApp and office hours for ${siteConfig.name}, plus a form to start planning your trip.`,
  path: '/contact',
});

export default async function ContactPage() {
  const [categories, destinations] = await Promise.all([getCategories(), getDestinations()]);

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <>
      <Section spacing="sm" ariaLabel="Contact">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <div className="mt-4 max-w-2xl">
            <p className="text-brand-700 text-sm font-semibold tracking-wider uppercase">
              We&rsquo;re here to help
            </p>
            <h1 className="text-h1 mt-2">Contact us</h1>
            <p className="mt-3 text-slate-600">
              Call, WhatsApp or send the form below — a trip planner replies personally, usually
              within one business day.
            </p>
          </div>
        </Container>
      </Section>

      <Enquiry
        destinationOptions={destinationOptions}
        source="contact"
        eyebrow="Get in touch"
        title="Send us your trip details"
      />
    </>
  );
}
