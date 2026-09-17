/**
 * Sanity connection smoke test.
 *
 * Usage (loads your local env):
 *   node --env-file=.env.local scripts/sanity-check.mjs
 *
 * Verifies the project id/dataset are set, connects, and reports document
 * counts per type. Uses only public read access — no token required.
 */
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

if (!projectId) {
  console.error('✗ NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Fill in .env.local first.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01',
  useCdn: false,
  perspective: 'published',
});

try {
  const counts = await client.fetch(`{
    "tours": count(*[_type == "tour"]),
    "destinations": count(*[_type == "destination"]),
    "categories": count(*[_type == "category"]),
    "testimonials": count(*[_type == "testimonial"]),
    "team": count(*[_type == "teamMember"]),
    "blogPosts": count(*[_type == "blogPost"]),
    "siteSettings": count(*[_type == "siteSettings"])
  }`);
  console.log(`✓ Connected to Sanity project "${projectId}" (dataset: ${dataset}).`);
  console.log('Published document counts:', counts);

  const firstTour = await client.fetch(`*[_type == "tour"][0]{ title, "slug": slug.current }`);
  console.log('First tour:', firstTour ?? '(none yet — create one in /studio)');
} catch (error) {
  console.error('✗ Connection failed:', error.message);
  console.error('  Check the project id/dataset and that CORS allows this origin.');
  process.exit(1);
}
