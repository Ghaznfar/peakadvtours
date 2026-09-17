import type { Category, TripCategory } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { CATEGORIES_ALL } from '@/sanity/queries';
import { categories as localCategories } from './trips.data';

export async function getCategories(): Promise<Category[]> {
  if (!isSanityConfigured) return localCategories;
  const rows = await sanityFetch<Category[]>(CATEGORIES_ALL);
  // Fall back to local definitions if the dataset has no category docs yet.
  return rows.length > 0 ? rows : localCategories;
}

export async function getCategoryByKey(key: TripCategory): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.key === key);
}
