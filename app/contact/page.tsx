import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { getCategories, getDestinations } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Enquiry } from '@/components/sections/Enquiry';

export const metadata = buildMetadata({
  title: `Contact ${siteConfig.name}`,
  description: `Phone, email, WhatsApp and office hours for ${siteConfig.name}, plus a form to start planning your trip.`,
  path: '/contact',
});

export default async function ContactPage() {
  const [categories, destinations] = await Promise.all([getCategories(), getDestinations()]);

  const { contact } = siteConfig;
  const { address } = contact;

  const destinationOptions = [
    ...categories.map((c) => ({ value: c.key, label: c.pluralLabel })),
    ...destinations.map((d) => ({ value: d.slug, label: d.name })),
  ];

  return (
    <>
      <PageHero
        eyebrow="We answer, seven days a week"
        title={`Contact ${siteConfig.name}`}
        heroImage={{
          src: '/images/banners/bannerpost.avif',
          alt: 'Autumn foliage framing a snow-capped peak, with golden poplars along the valley floor',
        }}
      />

      <Section spacing="sm" ariaLabel="Contact">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
          <SectionHeading
            variant="display"
            align="center"
            eyebrow="Get in touch"
            title="Our Office & How to Reach Us"
            description={`A trip planner answers — not a call centre. Most enquiries are replied to within three hours during office hours, with a day-by-day itinerary and the full price per person. WhatsApp is how most people reach us and is usually the fastest.`}
            className="mt-6"
          />

          {/* Office details come from site.config so the address, numbers and
              hours cannot drift out of step with the header, footer and
              enquiry form. */}
          <div className="rounded-card bg-card mx-auto mt-10 max-w-2xl border border-slate-200 p-6 sm:p-8 dark:border-slate-800">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Head office
            </h3>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd className="text-slate-700 dark:text-slate-300">
                    {address.line1}
                    <br />
                    {address.city}, {address.country}
                  </dd>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <div className="flex flex-col">
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="hover:text-brand-700 text-slate-700 dark:text-slate-300"
                    >
                      {contact.phone}
                    </a>
                  </dd>
                  {contact.phoneSecondary && (
                    <dd>
                      <a
                        href={`tel:${contact.phoneSecondary.replace(/\s/g, '')}`}
                        className="hover:text-brand-700 text-slate-700 dark:text-slate-300"
                      >
                        {contact.phoneSecondary}
                      </a>
                    </dd>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <MessageCircle aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <div>
                  <dt className="sr-only">WhatsApp</dt>
                  <dd>
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand-700 text-slate-700 dark:text-slate-300"
                    >
                      Chat on WhatsApp
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <div className="flex flex-col">
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-brand-700 text-slate-700 dark:text-slate-300"
                    >
                      {contact.email}
                    </a>
                  </dd>
                  {contact.emailSecondary && (
                    <dd>
                      <a
                        href={`mailto:${contact.emailSecondary}`}
                        className="hover:text-brand-700 text-slate-700 dark:text-slate-300"
                      >
                        {contact.emailSecondary}
                      </a>
                    </dd>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Clock aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
                <div>
                  <dt className="sr-only">Office hours</dt>
                  <dd className="text-slate-700 dark:text-slate-300">{contact.hours}</dd>
                </div>
              </div>
            </dl>
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
