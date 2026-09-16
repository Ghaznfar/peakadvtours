import { cn } from '@/lib/utils/cn';

/** Loading placeholder matching TripCard's dimensions to avoid layout shift. */
export function TripCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-card overflow-hidden border border-slate-200 bg-white shadow-sm',
        className,
      )}
      aria-hidden
    >
      <div className="aspect-[16/10] w-full animate-pulse bg-slate-200" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="mt-4 flex justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
