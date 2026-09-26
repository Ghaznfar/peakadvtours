'use client';

import dynamic from 'next/dynamic';
import type { TripPoint } from './points';

/**
 * Thin client wrapper whose only job is the dynamic import.
 *
 * Two reasons it exists rather than living in `TripMap`: Leaflet touches
 * `window` at import time so the canvas must load with `ssr: false`, and Next
 * rejects `ssr: false` inside a Server Component. Same split as
 * `components/detail/RouteMap`.
 */
const TripMapCanvas = dynamic(() => import('./TripMapCanvas').then((m) => m.TripMapCanvas), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="h-[420px] w-full animate-pulse bg-slate-100 lg:h-[520px] dark:bg-slate-800"
    />
  ),
});

export function TripMapLoader({ points }: { points: TripPoint[] }) {
  return <TripMapCanvas points={points} />;
}
