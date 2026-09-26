'use client';

import { CircleMarker, GeoJSON, MapContainer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Feature, GeoJsonObject } from 'geojson';
import 'leaflet/dist/leaflet.css';
import type { TripPoint } from './points';
import { CATEGORY_COLOUR, radiusForAltitude } from './points';
import regionGeo from './region.geo.json';

export interface TripMapCanvasProps {
  points: TripPoint[];
}

/**
 * The frame. The trips span lat 27.7–36.6 and lng 71.7–86.9, so this leaves a
 * margin on every side without stranding them in empty space. Its 16°×30° shape
 * is also roughly the panel's aspect ratio — Leaflet fits bounds to whichever
 * axis is tighter, so a frame much taller than the panel would letterbox the
 * map and shrink every dot.
 *
 * Locked to it: with no tile layer there is nothing outside the region to pan
 * to, so dragging and zooming would only reveal blank background.
 */
const BOUNDS = L.latLngBounds([23, 61], [40, 91]);

/** The two countries the operator actually runs trips in, picked out in blue. */
const OPERATING = new Set(['Pakistan', 'Nepal']);

/**
 * Country labels. Positioned by hand rather than by centroid: a centroid puts
 * "Nepal" on top of the Khumbu dots and "China" out in the Taklamakan.
 */
const LABELS: Array<{ name: string; lat: number; lng: number; strong?: boolean }> = [
  { name: 'Pakistan', lat: 27.8, lng: 68.6, strong: true },
  { name: 'Nepal', lat: 27.35, lng: 84.2, strong: true },
  { name: 'Afghanistan', lat: 33.6, lng: 65.2 },
  { name: 'Tajikistan', lat: 38.4, lng: 71.4 },
  { name: 'China', lat: 37.6, lng: 85.5 },
  { name: 'India', lat: 25.6, lng: 78.5 },
];

/**
 * Pakistani cities, as orientation for the dots.
 *
 * `labelLat`/`labelLng` place the NAME separately from the pin. The four
 * northern cities sit inside the Karakoram cluster, where a label centred on
 * its own dot would be unreadable under the trips; each is pushed into the
 * nearest empty direction. The southern cities have room, so they take the
 * default position below their pin.
 */
const CITIES: Array<{
  name: string;
  lat: number;
  lng: number;
  labelLat?: number;
  labelLng?: number;
}> = [
  // North — inside or beside the trip cluster, so hand-offset.
  { name: 'Gilgit', lat: 35.9208, lng: 74.3083, labelLat: 35.98, labelLng: 72.95 },
  { name: 'Skardu', lat: 35.2971, lng: 75.6333, labelLat: 34.72, labelLng: 76.1 },
  { name: 'Karimabad', lat: 36.3167, lng: 74.6667, labelLat: 37.25, labelLng: 73.3 },
  { name: 'Chitral', lat: 35.8518, lng: 71.7864, labelLat: 35.45, labelLng: 70.7 },
  // South — open space, default placement.
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249, labelLat: 34.3, labelLng: 70.5 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lng: 66.975 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
];

function countryStyle(feature?: Feature) {
  const name = (feature?.properties as { name?: string } | undefined)?.name ?? '';
  const isOperating = OPERATING.has(name);
  return {
    // Pale blue where the trips are, near-white everywhere else: the eye should
    // land on Pakistan and Nepal before it reads the neighbours.
    fillColor: isOperating ? '#dbe6f2' : '#eef0f4',
    fillOpacity: 1,
    color: isOperating ? '#b9cce0' : '#dfe3ea',
    weight: 1,
  };
}

function labelIcon(name: string, strong?: boolean) {
  return L.divIcon({
    className: '',
    html: `<span class="trip-map-label${strong ? ' is-strong' : ''}">${name}</span>`,
    iconSize: [0, 0],
  });
}

function cityLabelIcon(name: string) {
  return L.divIcon({
    className: '',
    html: `<span class="trip-map-city">${name}</span>`,
    iconSize: [0, 0],
  });
}

/** Escapes a trip title before it goes into `divIcon`'s raw HTML string. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

/**
 * The single highest trip, called out by name — the one dot worth naming on a
 * map where the rest are anonymous until you click them.
 */
function highestPoint(points: TripPoint[]): TripPoint | undefined {
  return points
    .filter((p) => p.maxAltitudeM)
    .sort((a, b) => (b.maxAltitudeM ?? 0) - (a.maxAltitudeM ?? 0))[0];
}

/** Strips the trip's marketing words down to the peak it is named for. */
function peakName(title: string): string {
  return title
    .replace(/\s*\d[\d.,]*\s*m\b.*$/i, '')
    .replace(/\b(expedition|trek|tour|double header)\b.*$/i, '')
    .trim();
}

/**
 * The overview map: country shapes drawn from geometry, with one dot per trip
 * on top — coloured by category, sized by altitude.
 *
 * There is NO tile layer. Tiles carry roads, towns and labels the section does
 * not need, and muting them to grey still reads as a road map. Drawing the
 * countries from a 19 KB clipped Natural Earth extract (public domain) gives
 * the flat look the design asks for, needs no API key, and loads nothing at
 * runtime.
 *
 * `CircleMarker` rather than `Marker`: radius is data here, and a circle scales
 * cleanly where a pin icon would need regenerating at every size.
 */
export function TripMapCanvas({ points }: TripMapCanvasProps) {
  const highest = highestPoint(points);

  return (
    <MapContainer
      bounds={BOUNDS}
      maxBounds={BOUNDS}
      // Pins the view to the region: zooming in is useful (the Karakoram dots
      // overlap heavily at the default zoom), but panning off into blank
      // background is not, since there is no tile layer behind the countries.
      maxBoundsViscosity={1}
      minZoom={4}
      maxZoom={8}
      zoomControl
      dragging
      // Left off deliberately: the map is mid-page, and a wheel that zooms it
      // instead of scrolling the page traps the reader.
      scrollWheelZoom={false}
      doubleClickZoom
      touchZoom
      attributionControl={false}
      className="trip-map h-[420px] w-full lg:h-[540px]"
    >
      <GeoJSON data={regionGeo as GeoJsonObject} style={countryStyle} interactive={false} />

      {LABELS.map((label) => (
        <Marker
          key={label.name}
          position={[label.lat, label.lng]}
          icon={labelIcon(label.name, label.strong)}
          interactive={false}
          keyboard={false}
        />
      ))}

      {/* Cities go UNDER the trip dots: they orient the reader, they are not
          the subject. Small hollow squares so they never read as a trip. */}
      {CITIES.map((city) => (
        <CircleMarker
          key={city.name}
          center={[city.lat, city.lng]}
          radius={2.5}
          interactive={false}
          pathOptions={{ color: '#94a3b8', weight: 1, fillColor: '#ffffff', fillOpacity: 1 }}
        />
      ))}
      {CITIES.map((city) => (
        <Marker
          key={`${city.name}-label`}
          position={[city.labelLat ?? city.lat - 0.55, city.labelLng ?? city.lng]}
          icon={cityLabelIcon(city.name)}
          interactive={false}
          keyboard={false}
        />
      ))}

      {highest?.maxAltitudeM && (
        <Marker
          // Offset north-west of the dot so the text clears the Karakoram
          // cluster instead of sitting on top of it.
          position={[highest.lat + 0.55, highest.lng - 1.4]}
          icon={L.divIcon({
            className: '',
            html: `<span class="trip-map-peak">${escapeHtml(peakName(highest.title))} · ${highest.maxAltitudeM.toLocaleString()} m</span>`,
            iconSize: [0, 0],
          })}
          interactive={false}
          keyboard={false}
        />
      )}

      {/* Biggest dots first so a small one is never buried under a large one. */}
      {[...points]
        .sort((a, b) => (b.maxAltitudeM ?? 0) - (a.maxAltitudeM ?? 0))
        .map((point) => (
          <CircleMarker
            key={point.slug}
            center={[point.lat, point.lng]}
            radius={radiusForAltitude(point.maxAltitudeM)}
            pathOptions={{
              color: '#ffffff',
              weight: 1.5,
              fillColor: CATEGORY_COLOUR[point.category],
              fillOpacity: 0.9,
            }}
          >
            <Popup>
              <span className="block text-[13px] font-bold">{point.title}</span>
              <span className="block text-[12px] text-slate-600">{point.place}</span>
              {point.maxAltitudeM && (
                <span className="block text-[12px] text-slate-600">
                  Up to {point.maxAltitudeM.toLocaleString()} m
                </span>
              )}
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
