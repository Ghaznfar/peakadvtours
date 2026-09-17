import Link from 'next/link';
import { siteConfig } from '@/site.config';
import type { Departure } from '@/types/content';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { Badge, type BadgeProps } from '@/components/ui/Badge';

const STATUS: Record<Departure['status'], { label: string; tone: BadgeProps['tone'] }> = {
  available: { label: 'Available', tone: 'success' },
  limited: { label: 'Limited', tone: 'warning' },
  guaranteed: { label: 'Guaranteed', tone: 'brand' },
  full: { label: 'Full', tone: 'neutral' },
};

export interface DeparturesProps {
  departures: Departure[];
  tripSlug: string;
}

/** Scheduled departures table with dates, price, status and an enquiry link. */
export function Departures({ departures, tripSlug }: DeparturesProps) {
  return (
    <div className="rounded-card overflow-x-auto border border-slate-200">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Start
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              End
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Price
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Enquire</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {departures.map((d) => {
            const status = STATUS[d.status];
            return (
              <tr key={d.start} className="text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {formatDate(d.start, siteConfig.locale)}
                </td>
                <td className="px-4 py-3">{formatDate(d.end, siteConfig.locale)}</td>
                <td className="px-4 py-3">
                  {formatCurrency(d.price.amount, d.price.currency, siteConfig.locale)}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  {d.status !== 'full' ? (
                    <Link
                      href={`/custom-trips?trip=${tripSlug}`}
                      className="text-brand-700 font-medium hover:underline"
                    >
                      Enquire
                    </Link>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
