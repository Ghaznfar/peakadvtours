import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/initials';
import type { TeamMember } from '@/types/content';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

export interface TeamCardProps {
  member: TeamMember;
  className?: string;
}

/** Team member card. Falls back to an initials avatar when no photo is set. */
export function TeamCard({ member, className }: TeamCardProps) {
  return (
    <article
      className={cn(
        // `h-full` matters: grid cells stretch to the tallest in the row, but
        // the card only took its content height, so a short bio left a card
        // ending well above its neighbours. Filling the cell makes every card
        // in a row the same height.
        'rounded-card bg-card flex h-full flex-col border border-slate-200 p-5 text-center shadow-sm dark:border-slate-800 dark:shadow-black/30',
        className,
      )}
    >
      {member.photo ? (
        <OptimizedImage
          image={member.photo}
          fill
          aspectRatio="1 / 1"
          sizes="(max-width: 768px) 50vw, 200px"
          className="rounded-full"
          wrapperClassName="mx-auto size-24 rounded-full"
        />
      ) : (
        <span
          aria-hidden
          className="bg-brand-100 font-display text-brand-800 dark:bg-brand-900 dark:text-brand-300 mx-auto inline-flex size-24 items-center justify-center rounded-full text-2xl font-bold"
        >
          {getInitials(member.name)}
        </span>
      )}

      <h3 className="font-display mt-4 text-lg font-semibold text-slate-900 dark:text-white">
        {member.name}
      </h3>
      <p className="text-brand-700 dark:text-brand-400 text-sm font-medium">{member.role}</p>
      {/* `grow` lets the bio absorb the height difference between a one-line
          and a two-line bio, so everything below it stays on the same line
          across the row. */}
      <p className="mt-2 grow text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>

      {/* The footer band is reserved either way so all four cards end on the
          same line. A spacer rather than an empty <p>: there is no paragraph
          here, so nothing should announce one. */}
      {member.languages && member.languages.length > 0 ? (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
          {member.languages.join(' · ')}
        </p>
      ) : (
        <span aria-hidden className="mt-3 block h-4" />
      )}
    </article>
  );
}
