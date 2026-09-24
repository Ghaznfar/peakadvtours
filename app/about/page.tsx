import { getCredentials, getStats, getTeamMembers, getValueProps } from '@/lib/content';
import { buildMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/site.config';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Stats } from '@/components/sections/Stats';
import { Team } from '@/components/sections/Team';
import { Credentials } from '@/components/sections/Credentials';

export const metadata = buildMetadata({
  title: 'About Us',
  description: `The story, values and local team behind ${siteConfig.name} — small-group tours, treks and expeditions.`,
  path: '/about',
});

export default async function AboutPage() {
  const [valueProps, stats, team, credentials] = await Promise.all([
    getValueProps(),
    getStats(),
    getTeamMembers(),
    getCredentials(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={`Since ${siteConfig.foundedYear}`}
        title={`About ${siteConfig.name}`}
        heroImage={{
          src: '/images/stock/destination-lakes-district.jpg',
          alt: 'PLACEHOLDER — replace with a client photograph of the team or an office',
        }}
      />

      <Section spacing="sm" ariaLabel="About">
        <Container>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          <div className="mt-4 max-w-2xl">
            <p className="text-slate-600 dark:text-slate-400">{siteConfig.description}</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-h3">How we started</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                We started with one vehicle and one rule: never sell a route we haven&rsquo;t walked
                ourselves. Every itinerary on this site has been checked in person by our own
                guides, across the seasons we actually run departures in.
              </p>
            </div>
            <div>
              <h2 className="font-display text-h3">How we work</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Small groups, one inclusive price and local guides who live in the regions you
                visit. If a scheduled departure doesn&rsquo;t fit your dates or group size, our
                planners build a custom itinerary around them instead.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Stats stats={stats} />
      <WhyChooseUs valueProps={valueProps} />
      <Team members={team} />
      <Credentials credentials={credentials} />

      <CtaBanner
        heading="Ready to start planning?"
        body="Tell us your dates and destination and we'll take it from there."
        primary={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  );
}
