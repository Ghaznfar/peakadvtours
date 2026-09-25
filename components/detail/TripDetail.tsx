import { Check, MapPin, Route, X } from 'lucide-react';
import type { Trip } from '@/types/content';
import { CATEGORY_LABEL, categoryPath } from '@/lib/trips/href';
import { touristTripSchema, faqSchema } from '@/lib/seo/tripJsonLd';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Disclosure } from '@/components/ui/Disclosure';
import { CtaBanner } from '@/components/ui/CtaBanner';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { JsonLd } from '@/lib/seo/JsonLd';
import { TripCard } from '@/components/TripCard';
import { Enquiry } from '@/components/sections/Enquiry';
import { QuickFacts } from './QuickFacts';
import { BookingPanel } from './BookingPanel';
import { Departures } from './Departures';
import { Gallery } from './Gallery';
import { RouteMap } from './RouteMap';
import { StickyMobileCta } from './StickyMobileCta';

const MEAL_LABEL: Record<string, string> = { B: 'Breakfast', L: 'Lunch', D: 'Dinner' };

export interface TripDetailProps {
  trip: Trip;
  relatedTrips: Trip[];
  destinationNames: Record<string, string>;
  destinationOptions: { value: string; label: string }[];
}

/**
 * Reusable trip detail page — one template for tours, treks, expeditions and
 * festivals. Sections render only when the trip has the relevant content, so
 * minimal and fully-detailed trips both look right. Heading hierarchy: a single
 * <h1> in the hero, <h2> per section, <h3> for highlight cards.
 */
export function TripDetail({
  trip,
  relatedTrips,
  destinationNames,
  destinationOptions,
}: TripDetailProps) {
  const hasRoute = (trip.routeWaypoints?.length ?? 0) >= 2;
  const location = trip.destinationSlugs.map((s) => destinationNames[s] ?? s).join(', ');

  return (
    <>
      {/* Breadcrumb */}
      <Container className="pt-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: `${CATEGORY_LABEL[trip.category]}s`, href: categoryPath(trip.category) },
            { label: trip.title },
          ]}
        />
      </Container>

      {/* Hero */}
      <div className="bg-brand-950 relative mt-4 flex min-h-[22rem] items-end overflow-hidden sm:min-h-[26rem] lg:min-h-[30rem]">
        <OptimizedImage
          image={trip.heroImage}
          fill
          aspectRatio="21 / 9"
          sizes="100vw"
          priority
          wrapperClassName="absolute inset-0 h-full"
          className="h-full"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/10"
        />
        <Container className="relative pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{CATEGORY_LABEL[trip.category]}</Badge>
            {trip.earlyBird && <Badge tone="accent">Early bird</Badge>}
            {trip.badge && <Badge tone="outline">{trip.badge}</Badge>}
          </div>
          <h1 className="text-display mt-3 max-w-3xl text-white">{trip.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/90">
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden className="size-4" />
                {location}
              </span>
            )}
            <span>
              {trip.durationDays} days · {trip.startCity} to {trip.endCity}
            </span>
          </p>
        </Container>
      </div>

      {/* Main content + sticky booking aside */}
      <Section spacing="md" ariaLabel={`${trip.title} details`}>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-12 lg:col-span-2">
              <QuickFacts trip={trip} destinationNames={destinationNames} />

              {/* Overview */}
              {(trip.description || trip.summary) && (
                <section aria-labelledby="overview-h">
                  <h2 id="overview-h" className="text-h2">
                    Overview
                  </h2>
                  <p className="mt-4 text-slate-600">{trip.description ?? trip.summary}</p>
                </section>
              )}

              {/* Highlights */}
              {trip.highlights && trip.highlights.length > 0 && (
                <section aria-labelledby="highlights-h">
                  <h2 id="highlights-h" className="text-h2">
                    Highlights
                  </h2>
                  <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {trip.highlights.map((h) => (
                      <li
                        key={h.title}
                        className="rounded-card border border-slate-200 bg-white p-5"
                      >
                        <h3 className="font-display text-base font-semibold text-slate-900">
                          {h.title}
                        </h3>
                        {h.body && <p className="mt-1 text-sm text-slate-600">{h.body}</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* No visible heading by client request — the map speaks for
                  itself. `aria-label` keeps the landmark named for screen
                  readers, which a bare <section> would otherwise lose. */}
              <section aria-label="Where you'll go">
                <div className="rounded-card overflow-hidden border border-slate-200 dark:border-slate-800">
                  {hasRoute ? (
                    <>
                      <RouteMap waypoints={trip.routeWaypoints ?? []} />
                      <p className="flex items-start gap-2 border-t border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        <Route aria-hidden className="text-brand-600 mt-0.5 size-4 shrink-0" />
                        The road as it runs, numbered in travel order. Driving times are in the
                        day-by-day below.
                      </p>
                    </>
                  ) : (
                    <div className="relative">
                      {/* No waypoints set: fall back to the static route image
                          (Tour → Media), then to the placeholder graphic. */}
                      <OptimizedImage
                        image={
                          trip.routeMap ?? {
                            src: '/images/placeholder-trip.svg',
                            alt: 'Illustrative location graphic — add route stops in the CMS',
                            width: 1200,
                            height: 500,
                          }
                        }
                        fill
                        aspectRatio="21 / 9"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </div>
                  )}
                  <dl className="grid grid-cols-1 gap-3 border-t border-slate-200 p-5 text-sm sm:grid-cols-3 dark:border-slate-800">
                    <div>
                      <dt className="text-slate-500">Start</dt>
                      <dd className="font-medium text-slate-900">{trip.startCity}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">End</dt>
                      <dd className="font-medium text-slate-900">{trip.endCity}</dd>
                    </div>
                    {location && (
                      <div>
                        <dt className="text-slate-500">Regions</dt>
                        <dd className="font-medium text-slate-900">{location}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </section>

              {/* Departures & pricing */}
              {trip.departures && trip.departures.length > 0 && (
                <section aria-labelledby="departures-h">
                  <h2 id="departures-h" className="text-h2">
                    Departure dates &amp; pricing
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Prices are per person, twin share. Private departures on request.
                  </p>
                  <div className="mt-4">
                    <Departures departures={trip.departures} tripSlug={trip.slug} />
                  </div>
                </section>
              )}

              {/* Itinerary */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <section aria-labelledby="itinerary-h">
                  <h2 id="itinerary-h" className="text-h2">
                    Day-by-day itinerary
                  </h2>
                  <div className="mt-4 border-t border-slate-200">
                    {trip.itinerary.map((day, i) => (
                      <Disclosure
                        key={day.day}
                        defaultOpen={i === 0}
                        summary={
                          <span className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-brand-700">Day {day.day}</span>
                            <span>{day.title}</span>
                          </span>
                        }
                      >
                        {day.description && <p>{day.description}</p>}
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                          {typeof day.altitudeM === 'number' && (
                            <li>Altitude: {day.altitudeM.toLocaleString()} m</li>
                          )}
                          {typeof day.hours === 'number' && <li>Approx. {day.hours} hrs</li>}
                          {day.meals && day.meals.length > 0 && (
                            <li>Meals: {day.meals.map((m) => MEAL_LABEL[m]).join(', ')}</li>
                          )}
                          {day.accommodation && <li>Stay: {day.accommodation}</li>}
                        </ul>
                      </Disclosure>
                    ))}
                  </div>
                </section>
              )}

              {/* Included / Excluded */}
              {(trip.included?.length || trip.excluded?.length) && (
                <section aria-labelledby="inclusions-h">
                  <h2 id="inclusions-h" className="text-h2">
                    What&rsquo;s included
                  </h2>
                  <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {trip.included && trip.included.length > 0 && (
                      <ul className="space-y-2">
                        {trip.included.map((item) => (
                          <li key={item} className="flex gap-2 text-sm text-slate-700">
                            <Check
                              aria-hidden
                              className="mt-0.5 size-4 shrink-0 text-emerald-600"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {trip.excluded && trip.excluded.length > 0 && (
                      <div>
                        <h3 className="font-display mb-2 text-base font-semibold text-slate-900">
                          Not included
                        </h3>
                        <ul className="space-y-2">
                          {trip.excluded.map((item) => (
                            <li key={item} className="flex gap-2 text-sm text-slate-600">
                              <X aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Accommodation */}
              {trip.accommodationNote && (
                <section aria-labelledby="accommodation-h">
                  <h2 id="accommodation-h" className="text-h2">
                    Accommodation
                  </h2>
                  <p className="mt-4 text-slate-600">{trip.accommodationNote}</p>
                </section>
              )}

              {/* Gallery */}
              {trip.gallery && trip.gallery.length > 0 && (
                <section aria-labelledby="gallery-h">
                  <h2 id="gallery-h" className="text-h2">
                    Gallery
                  </h2>
                  <div className="mt-6">
                    <Gallery images={trip.gallery} />
                  </div>
                </section>
              )}

              {/* Location */}
              {/* Important information */}
              {trip.goodToKnow && trip.goodToKnow.length > 0 && (
                <section aria-labelledby="info-h">
                  <h2 id="info-h" className="text-h2">
                    Important information
                  </h2>
                  <dl className="mt-6 space-y-4">
                    {trip.goodToKnow.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-card border border-slate-200 bg-slate-50 p-5"
                      >
                        <dt className="font-display text-base font-semibold text-slate-900">
                          {item.title}
                        </dt>
                        <dd className="mt-1 text-sm text-slate-600">{item.body}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              {/* FAQs */}
              {trip.faqs && trip.faqs.length > 0 && (
                <section aria-labelledby="faq-h">
                  <h2 id="faq-h" className="text-h2">
                    Frequently asked questions
                  </h2>
                  <div className="mt-4 border-t border-slate-200">
                    {trip.faqs.map((faq) => (
                      <Disclosure key={faq.question} summary={faq.question}>
                        <p>{faq.answer}</p>
                      </Disclosure>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky booking aside (desktop) */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingPanel trip={trip} />
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* Related trips */}
      {relatedTrips.length > 0 && (
        <Section spacing="md" ariaLabel="Related trips" className="bg-slate-50">
          <Container>
            <h2 className="text-h2">You might also like</h2>
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((related) => (
                <li key={related.slug}>
                  <TripCard trip={related} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Enquiry form + WhatsApp + contact */}
      <Enquiry
        destinationOptions={destinationOptions}
        defaultDestination={trip.destinationSlugs[0]}
        tripSlug={trip.slug}
        tripTitle={trip.title}
        source={`trip-detail:${trip.slug}`}
        eyebrow="Enquire"
        title={`Enquire about the ${trip.title}`}
      />

      {/* Final CTA */}
      <CtaBanner
        heading="Prefer a private or custom version?"
        body="We can run this trip on your own dates, or build something different around your plans."
        primary={{ label: 'Plan a custom trip', href: '/custom-trips' }}
        whatsAppMessage={`Hi, I'd like to customise the ${trip.title}.`}
      />

      {/* Spacer so the mobile sticky bar never covers the footer content */}
      <div aria-hidden className="h-20 lg:hidden" />
      <StickyMobileCta trip={trip} />

      {/* Structured data */}
      <JsonLd data={touristTripSchema(trip)} />
      {trip.faqs && trip.faqs.length > 0 && <JsonLd data={faqSchema(trip.faqs)} />}
    </>
  );
}
