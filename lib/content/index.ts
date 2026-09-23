/**
 * CONTENT REPOSITORY (the CMS seam).
 *
 * UI and pages import ONLY from here — never from `@/sanity/*` or the raw data
 * files. Each entity lives in its own module and reads from Sanity when
 * configured, falling back to local seed data otherwise. See docs/DATA_MODEL.md.
 */

// Tours / treks / expeditions (unified `Trip`)
export {
  getTours,
  getAllTrips,
  getFeaturedTours,
  getFeaturedTrips,
  getToursByCategory,
  getTripsByCategory,
  getToursByTag,
  getTripsByTag,
  getTourBySlug,
  getTripBySlug,
  getAllTripSlugs,
  getTripSlugsByCategory,
  getRelatedTrips,
} from './tours';

// Destinations
export { getDestinations, getFeaturedDestinations, getDestinationBySlug } from './destinations';

// Categories
export { getCategories, getCategoryByKey } from './categories';

// Testimonials / team / blog / site settings
export { getTestimonials } from './testimonials';
export { getTeamMembers, getTeam } from './team';
export { getBlogPosts, getBlogPostBySlug } from './blog';
export { getSiteSettings, getHeroSlides } from './site';
export { getPageBySlug } from './pages';

// Marketing (local)
export { getValueProps, getStats, getCredentials } from './marketing';
