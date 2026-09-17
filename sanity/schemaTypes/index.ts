import type { SchemaTypeDefinition } from 'sanity';
import { objectTypes } from './objects';
import { category } from './category';
import { destination } from './destination';
import { testimonial } from './testimonial';
import { teamMember } from './teamMember';
import { blogPost } from './blogPost';
import { tour } from './tour';
import { siteSettings } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  tour,
  destination,
  category,
  testimonial,
  teamMember,
  blogPost,
  siteSettings,
  // Objects
  ...objectTypes,
];
