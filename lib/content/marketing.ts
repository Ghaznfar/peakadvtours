import type { Credential, Stat, ValueProp } from '@/types/content';
import {
  credentials as localCredentials,
  stats as localStats,
  valueProps as localValueProps,
} from './marketing.data';

/**
 * "Why choose us" value props, company stats and credentials. These remain
 * local marketing content for now (not modelled in Sanity); they can be moved
 * into the `siteSettings` document later if the client wants to edit them.
 */
export async function getValueProps(): Promise<ValueProp[]> {
  return localValueProps;
}

export async function getStats(): Promise<Stat[]> {
  return localStats;
}

export async function getCredentials(): Promise<Credential[]> {
  return localCredentials;
}
