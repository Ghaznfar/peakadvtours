import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Bed,
  CalendarDays,
  Clock,
  Compass,
  Footprints,
  Headset,
  MapPin,
  MapPinned,
  Mountain,
  MountainSnow,
  Route,
  ShieldCheck,
  Users,
  Wallet,
} from 'lucide-react';

/**
 * Maps string icon keys (stored in serialisable content) to lucide components,
 * so content stays CMS-friendly and the icon set lives in the UI layer.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  route: Route,
  wallet: Wallet,
  users: Users,
  compass: Compass,
  headset: Headset,
  map: MapPinned,
  mountain: Mountain,
  'mountain-snow': MountainSnow,
  footprints: Footprints,
  // Added for trip-card fact pills (duration, region, lodging, season).
  clock: Clock,
  pin: MapPin,
  bed: Bed,
  calendar: CalendarDays,
};

/** Every key above, for building Sanity's icon dropdowns from one source. */
export const ICON_KEYS = Object.keys(ICON_MAP);

/** Resolve an icon key to a component, falling back to a neutral default. */
export function resolveIcon(key: string): LucideIcon {
  return ICON_MAP[key] ?? Compass;
}

/**
 * Renders a content-driven icon by key. Uses `createElement` so callers don't
 * assign a dynamic component to a capitalized variable during render.
 */
export function DynamicIcon({ name, className }: { name: string; className?: string }) {
  return createElement(resolveIcon(name), { className, 'aria-hidden': true });
}
