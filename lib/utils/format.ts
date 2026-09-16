import type { Price } from '@/types/content';

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
