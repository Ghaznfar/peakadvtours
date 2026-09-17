import type { TeamMember } from '@/types/content';
import { isSanityConfigured } from '@/sanity/env';
import { sanityFetch } from '@/sanity/client';
import { TEAM_ALL } from '@/sanity/queries';
import { team as localTeam } from './team.data';

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!isSanityConfigured) return [...localTeam].sort((a, b) => a.order - b.order);
  return sanityFetch<TeamMember[]>(TEAM_ALL);
}

/** Back-compat alias used across the app. */
export const getTeam = getTeamMembers;
