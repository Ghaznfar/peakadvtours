import type { TeamMember } from '@/types/content';

/** PLACEHOLDER team. Replace names, roles, bios and photos at handoff. */
export const team: TeamMember[] = [
  {
    id: 'm1',
    name: 'Placeholder Founder',
    role: 'Founder & Lead Guide',
    bio: 'Stand-in bio: started the company with one vehicle and one rule — walk every route before selling it.',
    languages: ['English', 'Local language'],
    order: 1,
  },
  {
    id: 'm2',
    name: 'Placeholder Planner',
    role: 'Trip Planning Lead',
    bio: 'Stand-in bio: builds every custom itinerary and has stayed in the hotels she books.',
    languages: ['English'],
    order: 2,
  },
  {
    id: 'm3',
    name: 'Placeholder Guide',
    role: 'Senior Mountain Guide',
    bio: 'Stand-in bio: dozens of high-season departures across the highland region.',
    languages: ['English', 'Local language'],
    order: 3,
  },
  {
    id: 'm4',
    name: 'Placeholder Operations',
    role: 'Operations Manager',
    bio: 'Stand-in bio: runs the fleet, the drivers and the daily road-condition checks.',
    languages: ['English'],
    order: 4,
  },
];
