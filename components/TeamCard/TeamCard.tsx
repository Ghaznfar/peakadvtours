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
        'rounded-card bg-card flex flex-col border border-slate-200 p-5 text-center shadow-sm dark:border-slate-800 dark:shadow-black/30',
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
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>

      {member.languages && member.languages.length > 0 && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
          {member.languages.join(' · ')}
        </p>
      )}
    </article>
  );
}
