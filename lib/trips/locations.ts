/**
 * Where each trip sits on the overview map.
 *
 * WHY THIS FILE EXISTS: trips carry no coordinate of their own. `routeWaypoints`
 * is set on exactly one of the 42 (the Gilgit-Baltistan tour), and `startCity`
 * is useless for mapping — 36 of 42 start in Islamabad, so plotting by it would
 * stack most of the catalogue on a single dot in the Punjab.
 *
 * Keyed by SLUG rather than matched against the title. Fuzzy matching would put
 * "K2 Base Camp Trek" and "K2 Expedition" in the same place and would silently
 * mislocate anything renamed; an explicit key fails loudly instead — a trip with
 * no entry here is simply left off the map, and `unmappedTrips()` reports it.
 *
 * Coordinates are the summit, pass or valley the trip is named for. Where two
 * trips share a place (three start from Skardu, two from Hunza) they share the
 * point and their dots overlap, which is honest: they really do go to the same
 * valley.
 */

export interface TripLocation {
  lat: number;
  lng: number;
  /** The place the dot marks — shown in the marker popup. */
  place: string;
}

export const TRIP_LOCATIONS: Record<string, TripLocation> = {
  // ── Expeditions: Karakoram ──────────────────────────────────────────────
  'k2-expedition': { lat: 35.8808, lng: 76.5133, place: 'K2, Baltoro Karakoram' },
  'broad-peak-expedition': { lat: 35.8111, lng: 76.5653, place: 'Broad Peak, Baltoro' },
  'k2-broad-peak-double-header': { lat: 35.846, lng: 76.539, place: 'K2 and Broad Peak, Baltoro' },
  'gasherbrum-i-expedition': { lat: 35.7238, lng: 76.6963, place: 'Gasherbrum I (Hidden Peak)' },
  'gasherbrum-ii-expedition': { lat: 35.7583, lng: 76.6533, place: 'Gasherbrum II' },
  'gasherbrum-i-ii-double-header': { lat: 35.741, lng: 76.675, place: 'The Gasherbrum group' },
  'masherbrum-expedition': { lat: 35.6408, lng: 76.3044, place: 'Masherbrum, Hushe' },
  'trango-tower-expedition': { lat: 35.9, lng: 76.1833, place: 'Trango Towers, Baltoro' },
  'laila-peak-expedition': { lat: 35.5333, lng: 76.35, place: 'Laila Peak, Hushe' },
  'khosar-gang-expedition': { lat: 35.38, lng: 75.62, place: 'Khosar Gang, near Skardu' },
  'spantik-expedition': { lat: 36.0167, lng: 75.0833, place: 'Spantik (Golden Peak), Nagar' },
  'rakaposhi-expedition': { lat: 36.1442, lng: 74.4894, place: 'Rakaposhi, Nagar' },
  'nanga-parbat-diamer-expedition': {
    lat: 35.2375,
    lng: 74.5892,
    place: 'Nanga Parbat, Diamer face',
  },
  'nanga-parbat-rupal-expedition': { lat: 35.2, lng: 74.6, place: 'Nanga Parbat, Rupal face' },

  // ── Expeditions: Nepal ──────────────────────────────────────────────────
  'mera-peak-expedition': { lat: 27.7075, lng: 86.8717, place: 'Mera Peak, Khumbu' },

  // ── Treks: Karakoram & Himalaya (Pakistan) ──────────────────────────────
  'k2-base-camp-trek': { lat: 35.7422, lng: 76.5, place: 'Concordia and K2 Base Camp' },
  'k2-gondogoro-la-trek': { lat: 35.6667, lng: 76.3167, place: 'Gondogoro La' },
  'snow-lake-hispar-la-trek': { lat: 36.05, lng: 75.45, place: 'Snow Lake and Hispar La' },
  'shimshal-pass-trek': { lat: 36.55, lng: 75.35, place: 'Shimshal Pass' },
  'nangma-valley-trek': { lat: 35.35, lng: 76.35, place: 'Nangma Valley, Kanday' },
  'thalle-la-trek': { lat: 35.35, lng: 75.85, place: 'Thalle La' },
  'nanga-parbat-base-camp-trek': {
    lat: 35.3833,
    lng: 74.5833,
    place: 'Fairy Meadows, Nanga Parbat',
  },
  'nanga-parbat-base-camp-trek-7-days': {
    lat: 35.3733,
    lng: 74.5983,
    place: 'Fairy Meadows, Nanga Parbat',
  },

  // ── Treks: Nepal ────────────────────────────────────────────────────────
  'everest-base-camp-trek': { lat: 28.0026, lng: 86.8528, place: 'Everest Base Camp, Khumbu' },
  'island-peak-with-everest-base-camp': {
    lat: 27.9222,
    lng: 86.9356,
    place: 'Island Peak, Khumbu',
  },
  'annapurna-base-camp-trek': { lat: 28.5311, lng: 83.8781, place: 'Annapurna Sanctuary' },
  'manaslu-trek': { lat: 28.55, lng: 84.5597, place: 'Manaslu circuit' },

  // ── Tours ───────────────────────────────────────────────────────────────
  'gilgit-baltistan-tour': { lat: 35.9208, lng: 74.3083, place: 'Gilgit-Baltistan' },
  'hunza-valley-tour': { lat: 36.3167, lng: 74.6667, place: 'Karimabad, Hunza' },
  'hunza-skardu-tour': { lat: 36.3167, lng: 74.65, place: 'Hunza and Skardu' },
  'skardu-tour': { lat: 35.2971, lng: 75.6333, place: 'Skardu, Baltistan' },
  'northern-pakistan-grand-tour': { lat: 35.9208, lng: 74.3083, place: 'Northern Pakistan' },
  'classic-pakistan-tour': {
    lat: 35.9208,
    lng: 74.3083,
    place: 'Gilgit and the Karakoram Highway',
  },
  'complete-pakistan-tour': { lat: 33.6844, lng: 73.0479, place: 'Karakoram to the Arabian Sea' },
  'hindu-kush-tour': { lat: 35.8518, lng: 71.7864, place: 'Chitral, Hindu Kush' },
  'kalash-valley-tour': { lat: 35.7, lng: 71.6667, place: 'Bumburet, Kalash valleys' },
  'buddhist-pilgrimage-tour': { lat: 33.7458, lng: 72.7869, place: 'Taxila, Gandhara' },
  'helicopter-safari-pakistan': { lat: 35.2971, lng: 75.6333, place: 'Skardu and the Baltoro' },
  'jeep-safari-pakistan': { lat: 34.9667, lng: 75.4, place: 'Deosai plains' },

  // ── Corporate retreats ──────────────────────────────────────────────────
  'deosai-team-building-expedition': { lat: 34.9667, lng: 75.4, place: 'Deosai plains' },
  'hunza-leadership-retreat': { lat: 36.3167, lng: 74.65, place: 'Hunza valley' },
  'skardu-incentive-trip': { lat: 35.2971, lng: 75.6333, place: 'Skardu, Baltistan' },
};

/** Slugs with no coordinate — surfaced so a new trip is not silently dropped. */
export function unmappedTrips(slugs: string[]): string[] {
  return slugs.filter((slug) => !TRIP_LOCATIONS[slug]);
}
