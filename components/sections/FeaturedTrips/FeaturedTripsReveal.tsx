'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FeaturedTripsRevealProps {
  /** The cards shown straight away (server-rendered `<li>` elements). */
  initial: ReactNode[];
  /** The rest, revealed on click. Not mounted until then. */
  more: ReactNode[];
}

/**
 * "Read more" for the featured grid.
 *
 * The hidden cards are kept OUT of the DOM until the button is pressed, rather
 * than rendered and hidden with CSS — that is what stops their photographs
 * being downloaded on page load, which is the whole point of the control.
 *
 * Both halves arrive as already-rendered server elements, so `TripCard` stays a
 * server component and none of it reaches the client bundle: this island owns
 * one boolean and nothing else.
 */
export function FeaturedTripsReveal({ initial, more }: FeaturedTripsRevealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasMore = more.length > 0;

  return (
    <>
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {initial}
        {isOpen && more}
      </ul>

      {hasMore && !isOpen && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={() => setIsOpen(true)}>
            Read more
            <ChevronDown aria-hidden className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}
