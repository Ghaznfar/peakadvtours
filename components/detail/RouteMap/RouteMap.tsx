'use client';

import dynamic from 'next/dynamic';
import type { RouteWaypoint } from '@/types/content';

/**
 * Leaflet touches `window` at import time, so the canvas is loaded with
 * `ssr: false` and only on trip pages that actually have waypoints — its ~45 KB
 * never reaches a page without a route.
 */
const RouteMapCanvas = dynamic(() => import('./RouteMapCanvas').then((m) => m.RouteMapCanvas), {
  ssr: false,
  loading: () => (
    <div
      className="h-[360px] w-full animate-pulse bg-slate-100 lg:h-[460px] dark:bg-slate-800"
      aria-hidden
    />
  ),
});

export interface RouteMapProps {
  waypoints: RouteWaypoint[];
}

/**
 * Interactive route map: numbered stops in travel order joined by the road
 * line. A plain ordered list sits alongside it, visible to screen readers and
 * to anyone the map fails for — the route is content, not decoration, so it
 * must not exist only inside a canvas.
 */
export function RouteMap({ waypoints }: RouteMapProps) {
  if (waypoints.length < 2) return null;

  return (
    <div>
      <RouteMapCanvas waypoints={waypoints} />
      <ol className="sr-only">
        {waypoints.map((w, i) => (
          <li key={`${w.name}-${i}`}>
            {i === 0 ? 'Start' : i === waypoints.length - 1 ? 'Finish' : `Stop ${i + 1}`}: {w.name}
            {w.note ? ` — ${w.note}` : ''}
          </li>
        ))}
      </ol>
    </div>
  );
}
