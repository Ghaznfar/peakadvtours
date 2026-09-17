import type { Price } from '@/types/content';

/** Format an ISO date (YYYY-MM-DD) as e.g. "12 Apr 2026". */
export function formatDate(iso: string, locale = 'en-US'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Format a currency amount with no fractional digits (e.g. "$1,800"). */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a `Price` object, returning both current and (optional) original. */
export function formatPrice(
  price: Price,
  locale = 'en-US',
): {
  current: string;
  original?: string;
} {
  return {
    current: formatCurrency(price.amount, price.currency, locale),
    original:
      price.originalAmount !== undefined
        ? formatCurrency(price.originalAmount, price.currency, locale)
        : undefined,
  };
}
