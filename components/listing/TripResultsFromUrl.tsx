'use client';

import { useSearchParams } from 'next/navigation';
import { TripResults, type TripResultsProps } from './TripResults';

/**
 * Applies the live URL query to a listing's results in the browser.
 *
 * Reading the query here rather than from the page's `searchParams` prop is
 * what keeps these routes statically prerenderable. A server component that
 * awaits `searchParams` is dynamic by definition, and a dynamic page has to
 * render on every request — which the Workers Free plan's 10 ms CPU limit
 * cannot do (see `sanity/client.ts`). The filtering itself is pure and runs
 * identically in both places, so nothing about the output changes.
 *
 * Must be rendered inside a `<Suspense>` boundary whose fallback is the
 * server-rendered default list: that fallback is what lands in the static HTML
 * and what crawlers read.
 */
export function TripResultsFromUrl(props: Omit<TripResultsProps, 'searchParams'>) {
  // Copied into a plain URLSearchParams: Next's ReadonlyURLSearchParams throws
  // on mutation, and the filter helpers build new params from what they're given.
  const searchParams = new URLSearchParams(useSearchParams().toString());
  return <TripResults {...props} searchParams={searchParams} />;
}
