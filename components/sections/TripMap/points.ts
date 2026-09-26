import type { Trip, TripCategory } from '@/types/content';
import { TRIP_LOCATIONS } from '@/lib/trips/locations';

/** A trip reduced to what the map needs. Shared by the server and client halves. */
export interface TripPoint {
  slug: string;
  title: string;
  category: TripCategory;
  lat: number;
  lng: number;
  place: string;
  maxAltitudeM?: number;
}

export const CATEGORY_COLOUR: Record<TripCategory, string> = {
  tour: '#334155',
  trek: '#2d83be',
  expedition: '#f59e0b',
  corporate: '#16a34a',
};

export const CATEGORY_PLURAL: Record<TripCategory, string> = {
  tour: 'Tours',
  trek: 'Treks',
  expedition: 'Expeditions',
  corporate: 'Retreats',
};

/** Altitudes the dot scale spans, and the pixel radii they map to. */
const MIN_ALTITUDE = 3500;
const MAX_ALTITUDE = 8611;
const MIN_RADIUS = 5;
const MAX_RADIUS = 12;

/**
 * Dot radius from altitude. Trips with no recorded altitude (9 of 42 — mostly
 * valley tours) get the minimum rather than disappearing: absent data should
 * read as "low", not as "not a trip".
 */
export function radiusForAltitude(altitude?: number): number {
  if (!altitude) return MIN_RADIUS;
  const clamped = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, altitude));
  const ratio = (clamped - MIN_ALTITUDE) / (MAX_ALTITUDE - MIN_ALTITUDE);
  return MIN_RADIUS + ratio * (MAX_RADIUS - MIN_RADIUS);
}

/** Trips that have a coordinate, as map points. Trips without one are dropped. */
export function toPoints(trips: Trip[]): TripPoint[] {
  return trips.flatMap((trip) => {
    const location = TRIP_LOCATIONS[trip.slug];
    if (!location) return [];
    return [
      {
        slug: trip.slug,
        title: trip.title,
        category: trip.category,
        lat: location.lat,
        lng: location.lng,
        place: location.place,
        maxAltitudeM: trip.maxAltitudeM,
      },
    ];
  });
}
