import { createElement } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Compass,
  Footprints,
  Headset,
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
};

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
