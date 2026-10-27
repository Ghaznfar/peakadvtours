'use client';

import { useSearchParams } from 'next/navigation';
import { TripBuilder, type TripBuilderProps } from './TripBuilder';

/** slug -> what the page needs to show and preselect for that trip. */
export type TripContextIndex = Record<string, { title: string; destination?: string }>;

/**
 * `/custom-trips?trip=<slug>` arrives from a trip page's "ask about this trip"
 * button and preselects that trip in the builder.
 *
 * The slug is resolved in the browser against an index passed from the server,
 * rather than with a `getTripBySlug` call driven by the page's `searchParams`.
 * That is what keeps `/custom-trips` statically prerenderable — an awaited
 * `searchParams` makes the route dynamic, and a dynamic route has to render on
 * every request, which the Workers Free plan's 10 ms CPU limit cannot do (see
 * `sanity/client.ts`). The index is slug/title/destination only, so it costs a
 * couple of KB in the payload.
 *
 * Both halves live here because both need the resolved trip, but they render in
 * different sections of the page, so each is mounted separately below.
 */
function useContextTrip(tripIndex: TripContextIndex) {
  const slug = useSearchParams().get('trip') ?? '';
  const trip = slug ? tripIndex[slug] : undefined;
  return trip ? { slug, ...trip } : undefined;
}

/** The "Enquiring about X" badge under the page intro. Renders nothing without `?trip=`. */
export function CustomTripNotice({ tripIndex }: { tripIndex: TripContextIndex }) {
  const trip = useContextTrip(tripIndex);
  if (!trip) return null;

  return (
    <p className="bg-brand-50 text-brand-800 dark:text-brand-400 mt-4 inline-block rounded-lg px-4 py-2 text-sm">
      Enquiring about <span className="font-semibold">{trip.title}</span> — mention any changes
      you&rsquo;d like below.
    </p>
  );
}

/** The builder itself, with the trip from `?trip=` attached when there is one. */
export function CustomTripBuilder({
  tripIndex,
  ...props
}: { tripIndex: TripContextIndex } & Pick<TripBuilderProps, 'destinationOptions' | 'className'>) {
  const trip = useContextTrip(tripIndex);

  return (
    <TripBuilder
      {...props}
      defaultDestination={trip?.destination}
      tripSlug={trip?.slug}
      tripTitle={trip?.title}
      source={trip ? `custom-trips:${trip.slug}` : 'custom-trips'}
    />
  );
}
