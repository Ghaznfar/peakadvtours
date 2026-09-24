/**
 * GROQ queries + projections. Projections output objects already shaped to the
 * app's content types (see `types/content.ts`), so the repository does almost
 * no mapping. Images resolve to a CDN `src`, `alt`, dimensions and an `lqip`
 * blur placeholder. Kept out of UI components — only `lib/content/*` imports these.
 */

const imageFrag = `{
  "src": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "blurDataURL": asset->metadata.lqip
}`;

const tourProjection = `{
  "slug": slug.current,
  title,
  category,
  "tags": coalesce(tags, []),
  "destinationSlugs": coalesce(destinations[]->slug.current, []),
  summary,
  description,
  "heroImage": heroImage ${imageFrag},
  "gallery": coalesce(gallery[] ${imageFrag}, []),
  "routeMap": routeMap ${imageFrag},
  durationDays,
  startCity,
  endCity,
  maxAltitudeM,
  difficulty,
  effort,
  groupSizeMin,
  groupSizeMax,
  "season": coalesce(season, []),
  seasonNote,
  accommodationNote,
  "cardFacts": coalesce(cardFacts[]{icon, label}, []),
  "price": {
    "amount": coalesce(price.amount, 0),
    "currency": coalesce(price.currency, "USD"),
    "originalAmount": price.originalAmount,
    "unit": "per_person"
  },
  earlyBird,
  priceOnRequest,
  depositPercent,
  badge,
  "highlights": coalesce(highlights, []),
  "itinerary": coalesce(itinerary, []),
  "included": coalesce(included, []),
  "excluded": coalesce(excluded, []),
  "goodToKnow": coalesce(goodToKnow, []),
  "faqs": coalesce(faqs, []),
  "departures": coalesce(departures[]{
    start,
    end,
    lengthDays,
    "price": { "amount": coalesce(price, 0), "currency": coalesce(currency, "USD"), "unit": "per_person" },
    status,
    depositPercent
  }, []),
  "relatedSlugs": coalesce(relatedTours[]->slug.current, []),
  featured,
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex },
  "updatedAt": coalesce(_updatedAt, "")
}`;

export const TOURS_ALL = `*[_type == "tour"] | order(orderRank asc, title asc) ${tourProjection}`;
export const TOUR_BY_SLUG = `*[_type == "tour" && slug.current == $slug][0] ${tourProjection}`;
export const TOURS_BY_CATEGORY = `*[_type == "tour" && category == $category] | order(orderRank asc, title asc) ${tourProjection}`;
export const TOURS_FEATURED = `*[_type == "tour" && featured == true] | order(orderRank asc, title asc) ${tourProjection}`;
export const TOURS_BY_TAG = `*[_type == "tour" && $tag in tags] | order(orderRank asc, title asc) ${tourProjection}`;
export const TOUR_SLUGS_BY_CATEGORY = `*[_type == "tour" && category == $category].slug.current`;
export const TOURS_RELATED = `*[_type == "tour" && slug.current in $slugs] ${tourProjection}`;

export const DESTINATIONS_ALL = `*[_type == "destination"] | order(name asc) {
  "slug": slug.current,
  name,
  region,
  "heroImage": heroImage ${imageFrag},
  intro,
  featured,
  "tripCount": count(*[_type == "tour" && references(^._id)]),
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex }
}`;

export const DESTINATION_BY_SLUG = `*[_type == "destination" && slug.current == $slug][0] {
  "slug": slug.current,
  name,
  region,
  "heroImage": heroImage ${imageFrag},
  intro,
  featured,
  "tripCount": count(*[_type == "tour" && references(^._id)]),
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex }
}`;

export const CATEGORIES_ALL = `*[_type == "category"] {
  key, label, pluralLabel, "slug": slug.current, intro
}`;

export const TESTIMONIALS_ALL = `*[_type == "testimonial" && consentGiven == true] {
  "id": _id, author, location, tripLabel, date, rating, quote, consentGiven
}`;

export const TEAM_ALL = `*[_type == "teamMember"] | order(order asc) {
  "id": _id, name, role, bio,
  "photo": photo ${imageFrag},
  "languages": coalesce(languages, []),
  order
}`;

export const BLOG_ALL = `*[_type == "blogPost"] | order(publishedAt desc) {
  "slug": slug.current, title, excerpt, category,
  "tags": coalesce(tags, []),
  "coverImage": coverImage ${imageFrag},
  author, publishedAt,
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex }
}`;

export const BLOG_BY_SLUG = `*[_type == "blogPost" && slug.current == $slug][0] {
  "slug": slug.current, title, excerpt, category,
  "tags": coalesce(tags, []),
  "coverImage": coverImage ${imageFrag},
  author, publishedAt,
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex }
}`;

export const PAGE_BY_SLUG = `*[_type == "page" && slug.current == $slug][0] {
  "slug": slug.current,
  title, eyebrow, intro,
  "features": coalesce(features[]{ icon, title, body }, []),
  "seo": seo{ title, description, "ogImage": ogImage ${imageFrag}, noindex }
}`;

export const SITE_SETTINGS = `*[_type == "siteSettings"][0] {
  name, tagline, description,
  "heroSlides": heroSlides[] {
    "image": image ${imageFrag},
    eyebrow,
    title,
    ctaLabel,
    ctaHref,
    "tourTitle": tour->title,
    "tourCategory": tour->category,
    "tourSlug": tour->slug.current
  },
  "contact": {
    phone, whatsapp, email, hours,
    "address": { "line1": addressLine1, "city": addressCity, "country": addressCountry }
  },
  "social": { facebook, instagram, youtube, x }
}`;
