/**
 * Import tours from content/tours.csv into Sanity.
 *
 *   node --env-file=.env.local scripts/import-tours.mjs [--dry]
 *
 * Documents are keyed by slug (`tour-<slug>`), so the script is idempotent:
 * edit the sheet, run again, documents update rather than duplicate.
 *
 * Each tour is written as createIfNotExists + patch rather than
 * createOrReplace. That matters because `orderRank` (the drag-to-reorder
 * position set in Studio) is seeded on creation only — a re-import updates
 * content without resetting an order the client arranged by hand.
 *
 * Images are NOT set here — upload those in Studio, where you also get
 * hotspot cropping and the alt-text field.
 *
 * NOTE: writing through the API bypasses Studio's validation rules entirely.
 * After importing, open a few documents in Studio to surface anything the
 * sheet got wrong (missing hero image, bad enum value, etc).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');

const PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/** Minimal RFC-4180 parser: handles quoted fields, commas and "" escapes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') field += ch;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ''));
  return body.map((cells) => Object.fromEntries(header.map((h, i) => [h.trim(), cells[i] ?? ''])));
}

const str = (v) => (v && v.trim() !== '' ? v.trim() : undefined);
const num = (v) => (str(v) === undefined ? undefined : Number(v));
const bool = (v) => str(v)?.toUpperCase() === 'TRUE';
const list = (v) =>
  str(v)
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * Card pills, written in one cell as `icon:text|icon:text|…`. Only the first
 * colon splits, so labels may contain colons. Each entry needs a `_key` or
 * Sanity's array editor cannot reorder them in Studio.
 */
const facts = (v, slug) =>
  str(v)
    ?.split('|')
    .map((chunk, i) => {
      const at = chunk.indexOf(':');
      if (at === -1) throw new Error(`Fact "${chunk}" on ${slug} is missing an "icon:" prefix.`);
      const icon = chunk.slice(0, at).trim();
      const label = chunk.slice(at + 1).trim();
      if (!icon || !label) throw new Error(`Fact "${chunk}" on ${slug} is incomplete.`);
      return { _type: 'tripFact', _key: `fact${i}`, icon, label };
    })
    .filter(Boolean);

/** Drop undefined keys so Sanity stores an absent field rather than null. */
const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

/**
 * A LexoRank-shaped rank for a brand-new document, spaced out so Studio can
 * always find a midpoint when a row is dragged between two others. Row order
 * in the sheet becomes the initial order on the site.
 */
function initialRank(index) {
  return `0|${(100000 + index * 1000).toString(36).padStart(6, '0')}:`;
}

function toDocument(row, index) {
  const slug = str(row.slug);
  if (!slug) throw new Error(`Row is missing a slug: ${JSON.stringify(row)}`);

  const amount = num(row.priceAmount);

  return compact({
    // Hyphen, never a dot: Sanity treats any document ID containing a "." as
    // private, so `tour.<slug>` documents are invisible to unauthenticated
    // reads — including the public CDN the site builds against.
    _id: `tour-${slug}`,
    _type: 'tour',
    orderRank: initialRank(index),
    title: str(row.title),
    slug: { _type: 'slug', current: slug },
    category: str(row.category) ?? 'tour',
    tags: list(row.tags),
    summary: str(row.summary),
    durationDays: num(row.durationDays),
    startCity: str(row.startCity),
    endCity: str(row.endCity),
    difficulty: str(row.difficulty),
    effort: str(row.effort),
    maxAltitudeM: num(row.maxAltitudeM),
    season: list(row.season),
    seasonNote: str(row.seasonNote),
    groupSizeMin: num(row.groupSizeMin),
    groupSizeMax: num(row.groupSizeMax),
    accommodationNote: str(row.accommodationNote),
    cardFacts: facts(row.cardFacts, slug),
    price:
      amount === undefined
        ? undefined
        : compact({
            // No `unit` here: the app's `Price` type has one, but the GROQ
            // projection synthesises it ("unit": "per_person"). Writing it to
            // the document adds a field `priceType` does not define, which
            // Studio flags as "Unknown field found".
            _type: 'priceType',
            amount,
            currency: str(row.priceCurrency) ?? 'USD',
            originalAmount: num(row.priceOriginalAmount),
          }),
    priceOnRequest: amount === undefined ? true : undefined,
    earlyBird: bool(row.earlyBird) || undefined,
    featured: bool(row.featured) || undefined,
  });
}

function readToken() {
  if (process.env.SANITY_API_WRITE_TOKEN) return process.env.SANITY_API_WRITE_TOKEN;
  // Fall back to the logged-in CLI token so `sanity login` is enough.
  const cfg = join(process.env.HOME ?? '', '.config/sanity/config.json');
  const json = JSON.parse(readFileSync(cfg, 'utf8'));
  return json.authToken ?? json.authTokens?.[0]?.token;
}

async function main() {
  if (!PROJECT_ID) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set.');

  const rows = parseCsv(readFileSync(join(ROOT, 'content/tours.csv'), 'utf8'));
  const docs = rows.map(toDocument);

  // createIfNotExists seeds a new document (including its orderRank); the patch
  // then updates content on every run WITHOUT touching orderRank — so a re-import
  // never destroys an order the client set by dragging rows in Studio.
  const mutations = docs.flatMap((doc) => {
    const { orderRank, ...content } = doc;
    return [
      { createIfNotExists: doc },
      // `set` refreshes content every run; `setIfMissing` backfills a rank for
      // documents that predate ordering, without disturbing one already set.
      { patch: { id: doc._id, set: content, setIfMissing: { orderRank } } },
    ];
  });

  console.log(`Parsed ${docs.length} tours from content/tours.csv`);
  for (const d of docs) {
    const price = d.price ? `${d.price.currency} ${d.price.amount}` : 'on request';
    const pills = `${d.cardFacts?.length ?? 0} pills`;
    console.log(
      `  ${d.slug.current.padEnd(30)} ${String(d.durationDays).padStart(2)}d  ${price.padEnd(10)} ${pills}`,
    );
  }

  if (DRY) {
    console.log('\n--dry: nothing written.');
    return;
  }

  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify({ mutations }),
    },
  );

  const body = await res.json();
  if (body.error) throw new Error(JSON.stringify(body.error, null, 2));
  console.log(
    `\nApplied ${body.results?.length ?? 0} operations across ${docs.length} tours. Transaction ${body.transactionId}`,
  );
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
