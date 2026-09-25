'use client';

import { useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RouteWaypoint } from '@/types/content';
import { cn } from '@/lib/utils/cn';

/**
 * Tile sources chosen for having no API key and a usage policy that permits
 * this. The reference site's map shows "API KEY REQUIRED" watermarks across it
 * because it points at CARTO basemaps without a key — worth not copying.
 */
const LAYERS = {
  map: {
    label: 'Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  terrain: {
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
} as const;

type LayerKey = keyof typeof LAYERS;

/** Start is green, finish amber, everything between brand blue. */
function markerColour(index: number, total: number): string {
  if (index === 0) return '#16a34a';
  if (index === total - 1) return '#f59e0b';
  return '#2d83be';
}

/**
 * A numbered pin. Built with `divIcon` rather than an image marker so the
 * number is real text — it scales with zoom, stays crisp, and screen readers
 * can reach it through the marker's alt text.
 */
function numberedIcon(index: number, total: number) {
  const colour = markerColour(index, total);
  return L.divIcon({
    className: '',
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:9999px;
      background:${colour};color:#fff;
      font:700 13px/1 system-ui,sans-serif;
      border:2px solid #fff;box-shadow:0 1px 4px rgb(0 0 0/.4);
    ">${index + 1}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

/** Fits the viewport to the whole route whenever the points change. */
function FitToRoute({ points }: { points: [number, number][] }) {
  const map = useMap();
  useMemo(() => {
    const first = points[0];
    if (points.length === 1 && first) map.setView(first, 9);
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [44, 44] });
  }, [map, points]);
  return null;
}

export interface RouteMapCanvasProps {
  waypoints: RouteWaypoint[];
  className?: string;
}

export function RouteMapCanvas({ waypoints, className }: RouteMapCanvasProps) {
  const [layer, setLayer] = useState<LayerKey>('map');
  const points = useMemo<[number, number][]>(
    () => waypoints.map((w) => [w.lat, w.lng]),
    [waypoints],
  );

  if (points.length === 0) return null;
  const tiles = LAYERS[layer];

  return (
    <div className={cn('relative', className)}>
      <MapContainer
        center={points[0] as [number, number]}
        zoom={7}
        scrollWheelZoom={false}
        className="h-[360px] w-full lg:h-[460px]"
        // Keyboard users can still pan/zoom; only the scroll hijack is off, so
        // the page doesn't trap the wheel as you scroll past the map.
      >
        <TileLayer
          key={layer}
          url={tiles.url}
          attribution={tiles.attribution}
          maxZoom={tiles.maxZoom}
        />

        <Polyline positions={points} pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.9 }} />

        {waypoints.map((w, i) => (
          <Marker
            key={`${w.name}-${i}`}
            position={[w.lat, w.lng]}
            icon={numberedIcon(i, waypoints.length)}
            alt={`Stop ${i + 1}: ${w.name}`}
          >
            <Popup>
              <strong>
                {i + 1}. {w.name}
              </strong>
              {w.note && <div className="mt-1">{w.note}</div>}
            </Popup>
          </Marker>
        ))}

        <FitToRoute points={points} />
      </MapContainer>

      {/* Layer switch */}
      <div className="absolute top-3 right-3 z-[1000] flex overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
        {(Object.keys(LAYERS) as LayerKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setLayer(key)}
            aria-pressed={layer === key}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold transition-colors',
              layer === key ? 'bg-brand-500 text-white' : 'text-slate-700 hover:bg-slate-100',
            )}
          >
            {LAYERS[key].label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute top-14 right-3 z-[1000] rounded-md border border-slate-300 bg-white/95 p-3 text-xs shadow-sm">
        <p className="font-bold tracking-wider text-slate-500 uppercase">Route</p>
        <ul className="mt-2 space-y-1.5">
          {[
            { colour: '#16a34a', label: 'Start', n: '1' },
            { colour: '#2d83be', label: 'Stop in order', n: '2' },
            { colour: '#f59e0b', label: 'Finish', n: String(waypoints.length) },
          ].map((row) => (
            <li key={row.label} className="flex items-center gap-2 text-slate-700">
              <span
                aria-hidden
                className="inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ background: row.colour }}
              >
                {row.n}
              </span>
              {row.label}
            </li>
          ))}
          <li className="flex items-center gap-2 text-slate-700">
            <span
              aria-hidden
              className="inline-block h-1 w-5 rounded"
              style={{ background: '#f59e0b' }}
            />
            Road travelled
          </li>
        </ul>
      </div>
    </div>
  );
}
