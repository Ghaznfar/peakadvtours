export { TripCard } from './TripCard';
export type { TripCardProps } from './TripCard';
export { TripCardSkeleton } from './TripCardSkeleton';

// `TourCard` is the same reusable card — the "Trip" model unifies tours, treks
// and expeditions, so both names resolve to one implementation.
export { TripCard as TourCard } from './TripCard';
export type { TripCardProps as TourCardProps } from './TripCard';
