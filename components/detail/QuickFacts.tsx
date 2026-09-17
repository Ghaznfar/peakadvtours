import { CalendarDays, Gauge, MapPin, Mountain, Sun, Tag, Users } from 'lucide-react';
import type { Trip } from '@/types/content';
import { CATEGORY_LABEL } from '@/lib/trips/href';

const DIFFICULTY_LABEL = {
  easy: 'Easy',
  moderate: 'Moderate',
  strenuous: 'Strenuous',
  technical: 'Technical',
} as const;

const SEASON_LABEL = {
  spring: 'Spring',
  summer: 'Summer',
  autumn: 'Autumn',
  winter: 'Winter',
} as const;

export interface QuickFactsProps {
  trip: Trip;
  /** slug → display name for destinations. */
  destinationNames: Record<string, string>;
}

/** Quick-facts strip: location, category, duration, difficulty, altitude, etc. */
export function QuickFacts({ trip, destinationNames }: QuickFactsProps) {
  const location =
    trip.destinationSlugs.map((s) => destinationNames[s] ?? s).join(', ') || trip.startCity;
  const seasonText = trip.seasonNote ?? trip.season.map((s) => SEASON_LABEL[s]).join(', ');
  const groupSize =
    trip.groupSizeMin && trip.groupSizeMax
      ? `${trip.groupSizeMin}–${trip.groupSizeMax}`
      : trip.groupSizeMax
        ? `Up to ${trip.groupSizeMax}`
        : undefined;

  const facts: { icon: typeof MapPin; label: string; value: string }[] = [
    { icon: MapPin, label: 'Location', value: location },
    { icon: Tag, label: 'Type', value: CATEGORY_LABEL[trip.category] },
    { icon: CalendarDays, label: 'Duration', value: `${trip.durationDays} days` },
    { icon: Gauge, label: 'Difficulty', value: DIFFICULTY_LABEL[trip.difficulty] },
  ];
  if (typeof trip.maxAltitudeM === 'number') {
    facts.push({
      icon: Mountain,
      label: 'Max altitude',
      value: `${trip.maxAltitudeM.toLocaleString()} m`,
    });
  }
  if (seasonText) facts.push({ icon: Sun, label: 'Season', value: seasonText });
  if (groupSize) facts.push({ icon: Users, label: 'Group size', value: groupSize });

  return (
    <dl className="rounded-card grid grid-cols-2 gap-x-4 gap-y-5 border border-slate-200 bg-white p-5 sm:grid-cols-3 lg:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="flex items-start gap-3">
          <fact.icon aria-hidden className="text-brand-600 mt-0.5 size-5 shrink-0" />
          <div>
            <dt className="text-xs text-slate-500">{fact.label}</dt>
            <dd className="text-sm font-medium text-slate-900">{fact.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
