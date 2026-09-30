#!/usr/bin/env node
/**
 * Import the long-form detail of a trip — highlights, day-by-day itinerary,
 * included/excluded, "good to know", FAQs, departures and route waypoints —
 * from a per-trip JSON file in `content/trips/`.
 *
 * WHY NOT THE CSV: `content/tours.csv` carries one row per trip and is the right
 * shape for the card-level fields (price, duration, pills). A 21-day itinerary
 * does not fit in a spreadsheet cell, so the deep content lives in its own file
 * per trip, and this script merges it onto the existing document.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-trip-details.mjs k2-base-camp-trek
 *   node --env-file=.env.local scripts/import-trip-details.mjs --all
 *   node --env-file=.env.local scripts/import-trip-details.mjs k2-base-camp-trek --dry
 *
 * Needs SANITY_API_WRITE_TOKEN (Editor or above) in the environment.
 *
 * Only the keys present in the JSON are written — a file with just `highlights`
 * patches highlights and leaves the itinerary alone. Re-running is safe: each
 * run replaces those fields wholesale rather than appending, so the file stays
 * the source of truth.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * Falls back to the token `sanity login` already stored on this machine, so
 * the script works without minting a separate API token first. A dedicated
 * `SANITY_API_WRITE_TOKEN` still wins when set, which is what CI should use.
 */
function cliToken() {
  try {
    const config = JSON.parse(
      readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8'),
    );
    return config.authToken ?? undefined;
  } catch {
    return undefined;
  }
}

const TOKEN = process.env.SANITY_API_WRITE_TOKEN ?? cliToken();
const API = 'v2024-01-01';
const DIR = 'content/trips';

/** Fields this script owns. Anything else in the JSON is ignored. */
const FIELDS = [
  'highlights',
  'itinerary',
  'included',
  'excluded',
  'goodToKnow',
  'faqs',
  'departures',
  'routeWaypoints',
  'depositPercent',
  'groupSizeMin',
];

/** Array members need a stable `_key`; objects need their `_type`. */
const MEMBER_TYPE = {
  highlights: 'highlight',
  itinerary: 'itineraryDay',
  goodToKnow: 'infoBlock',
  faqs: 'faq',
  departures: 'departure',
  routeWaypoints: 'routeWaypoint',
};

function keyed(field, items) {
  const type = MEMBER_TYPE[field];
  return items.map((item, i) => {
    // Plain string arrays (included/excluded) take no key or type.
    if (typeof item === 'string') return item;
    return { _key: `${field}-${i}`, ...(type ? { _type: type } : {}), ...item };
  });
}

async function query(groq) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  // Published documents are readable without a token, so a dry run works
  // unauthenticated; sending `Bearer undefined` would 401 instead.
  const res = await fetch(url, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  if (!res.ok) throw new Error(`Query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

async function mutate(mutations) {
  const url = `https://${PROJECT_ID}.api.sanity.io/${API}/data/mutate/${DATASET}?returnIds=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Mutate failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const args = process.argv.slice(2);
  const isDry = args.includes('--dry');
  const wantsAll = args.includes('--all');
  const named = args.filter((a) => !a.startsWith('--'));

  if (!PROJECT_ID) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set.');
  if (!TOKEN && !isDry)
    throw new Error('No write token: set SANITY_API_WRITE_TOKEN, or run `npx sanity login`.');

  const files = wantsAll
    ? readdirSync(DIR)
        .filter((f) => f.endsWith('.json'))
        .map((f) => join(DIR, f))
    : named.map((slug) => join(DIR, `${slug.replace(/\.json$/, '')}.json`));

  if (files.length === 0) {
    console.error('Nothing to import. Pass a slug, or --all.');
    process.exit(1);
  }

  for (const file of files) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const slug = data.slug ?? basename(file, '.json');

    const doc = await query(`*[_type=="tour" && slug.current=="${slug}"][0]{_id,title}`);
    if (!doc) {
      console.error(`✗ ${slug}: no trip with that slug in Sanity — skipped.`);
      continue;
    }

    const set = {};
    for (const field of FIELDS) {
      if (!(field in data)) continue;
      set[field] = Array.isArray(data[field]) ? keyed(field, data[field]) : data[field];
    }

    const summary = Object.entries(set)
      .map(([k, v]) => `${k}${Array.isArray(v) ? `(${v.length})` : ''}`)
      .join(', ');

    if (isDry) {
      console.log(`· ${slug} → ${doc._id}\n    would set: ${summary}`);
      continue;
    }

    await mutate([{ patch: { id: doc._id, set } }]);
    console.log(`✓ ${doc.title}\n    set: ${summary}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
