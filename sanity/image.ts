import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { dataset, safeProjectId } from './env';

const builder = createImageUrlBuilder({ projectId: safeProjectId, dataset });

/** Build a Sanity image URL (for cases needing explicit sizing/transforms). */
export function urlForImage(source: Image) {
  return builder.image(source);
}
