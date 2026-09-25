import type { Metadata } from 'next';
import { TripDetailPage } from '@/components/detail/TripDetailPage';
import { tripMetadata, tripStaticParams } from '@/lib/detail/meta';

type Params = { slug: string };

// Only slugs from generateStaticParams are valid; anything else (unknown slug
// or a slug from another category) returns a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return tripStaticParams('corporate');
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return tripMetadata('corporate', params);
}

export default function CorporateRetreatDetailPage({ params }: { params: Promise<Params> }) {
  return <TripDetailPage category="corporate" params={params} />;
}
