import type { SlugOptions, SlugRule } from 'sanity';

/**
 * Shared slug rules for every document type that owns a URL.
 *
 * A slug becomes a path segment, so it has to survive a round trip through a
 * URL. One that does not is not a cosmetic problem: on 2026-10-27 the slugs
 * `hunza valley` and `northern- areas- trekking` made their pages unreachable —
 * the site prerenders a file with a literal space in the name, the browser asks
 * for `%20`, and nothing matches, so both answered 404. Nothing in the Studio
 * stopped an editor typing them, because `options.source` only slugifies the
 * value that the "Generate" button produces; typed input was passed through
 * untouched.
 *
 * So the pattern is enforced as validation (blocks publish) as well as applied
 * on generate.
 */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Lowercase, strip accents, collapse everything else to single hyphens. */
export function slugify(input: string, maxLength = 96): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, maxLength)
    .replace(/^-+|-+$/g, '');
}

/** `options` for a slug field: generate from `source`, slugified properly. */
export function slugOptions(source: string, maxLength = 96): SlugOptions {
  return { source, maxLength, slugify: (input) => slugify(input, maxLength) };
}

/**
 * `validation` for a slug field. Rejects anything that is not already a clean
 * path segment, so a hand-typed slug cannot be published.
 */
export const slugValidation = (rule: SlugRule) =>
  rule.required().custom((value) => {
    const current = value?.current;
    if (!current) return 'A slug is required — click Generate, or type one.';
    if (!SLUG_PATTERN.test(current)) {
      return `"${current}" cannot be used in a URL. Use lowercase letters, numbers and single hyphens, with no spaces — for example "${slugify(current) || 'hunza-valley'}".`;
    }
    return true;
  });
