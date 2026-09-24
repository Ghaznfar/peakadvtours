import type { StructureResolver } from 'sanity/structure';
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list';

/**
 * Desk structure for a friendly editor experience.
 *
 * Trips are one document type (CLAUDE.md §4) but appear here as four separate
 * drag-to-reorder lists, so an editor sees "Tours", "Trekking", "Expeditions"
 * and "Corporate retreats" as distinct sections without the site carrying four
 * parallel schemas. Dragging a row writes `orderRank`, and the `TOURS_*`
 * queries sort on it — so the order set here is the order on the site.
 *
 * Caveat: `orderRank` is a single field on the shared type. The first three
 * lists are disjoint (one `category` each) so they never fight, but a trip
 * tagged "corporate" also appears in its category's list and shares one rank
 * between them. Give corporate retreats their own category if that becomes a
 * problem.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),

      orderableDocumentListDeskItem({
        type: 'tour',
        title: 'Tours',
        id: 'orderable-tours',
        filter: 'category == "tour"',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'tour',
        title: 'Trekking',
        id: 'orderable-treks',
        filter: 'category == "trek"',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'tour',
        title: 'Expeditions',
        id: 'orderable-expeditions',
        filter: 'category == "expedition"',
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: 'tour',
        title: 'Corporate retreats',
        id: 'orderable-corporate',
        filter: '"corporate" in tags',
        S,
        context,
      }),
      S.divider(),

      // Every trip regardless of category — useful for search and for spotting
      // a trip whose category was left unset, which would hide it above.
      S.documentTypeListItem('tour').title('All trips'),
      S.divider(),

      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('blogPost').title('Blog posts'),
      S.documentTypeListItem('page').title('Pages'),
    ]);
