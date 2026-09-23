import type { StructureResolver } from 'sanity/structure';

/**
 * Desk structure for a friendly editor experience. Site settings is pinned as a
 * single editable document (singleton); everything else is a normal list.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('tour').title('Tours / Treks / Expeditions'),
      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('teamMember').title('Team'),
      S.documentTypeListItem('blogPost').title('Blog posts'),
      S.documentTypeListItem('page').title('Pages'),
    ]);
