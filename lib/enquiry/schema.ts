import { z } from 'zod';

/**
 * Shared enquiry schema — the single source of truth validated on BOTH the
 * client (React Hook Form via zodResolver) and the server (route handler).
 * Keeping one schema guarantees the browser and API agree on what's valid.
 */

export const HOTEL_OPTIONS = [
  { value: 'luxury', label: 'Luxury (best available)' },
  { value: 'deluxe', label: 'Deluxe (four-star)' },
  { value: 'comfort', label: 'Comfort (three-star)' },
  { value: 'basic', label: 'Basic (guesthouses)' },
  { value: 'mixed', label: 'Mix (comfort on the road, better in cities)' },
  { value: 'unsure', label: 'Not sure — advise me' },
] as const;

const HOTEL_VALUES = HOTEL_OPTIONS.map((o) => o.value) as [string, ...string[]];

/**
 * The three option sets below are only used by the step-by-step trip builder on
 * /custom-trips. They live here, next to the schema, so the chips a visitor can
 * pick and the values the server will accept can never drift apart.
 */

export const TRIP_TYPE_OPTIONS = [
  { value: 'tour', label: 'Guided tour' },
  { value: 'trek', label: 'Trekking' },
  { value: 'expedition', label: 'Expedition' },
  { value: 'corporate', label: 'Corporate retreat' },
  { value: 'culture', label: 'Culture & heritage' },
  { value: 'photography', label: 'Photography' },
  { value: 'family', label: 'Family friendly' },
  { value: 'honeymoon', label: 'Honeymoon' },
] as const;

export const DURATION_OPTIONS = [
  { value: '1-5', label: 'Up to 5 days' },
  { value: '6-9', label: '6 – 9 days' },
  { value: '10-14', label: '10 – 14 days' },
  { value: '15-21', label: '15 – 21 days' },
  { value: '22+', label: 'Three weeks or more' },
  { value: 'unsure', label: 'Not decided yet' },
] as const;

export const FLEXIBILITY_OPTIONS = [
  { value: 'fixed', label: 'These dates only' },
  { value: 'few-days', label: 'Give or take a few days' },
  { value: 'month', label: 'Anywhere that month' },
  { value: 'open', label: 'Completely open' },
] as const;

const TRIP_TYPE_VALUES = TRIP_TYPE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const DURATION_VALUES = DURATION_OPTIONS.map((o) => o.value) as [string, ...string[]];
const FLEXIBILITY_VALUES = FLEXIBILITY_OPTIONS.map((o) => o.value) as [string, ...string[]];

// Permissive international phone check: digits, spaces and + ( ) -
const PHONE_RE = /^[+()\-\s0-9]{6,20}$/;

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.').max(120),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email.')
    .email('Please enter a valid email address.'),
  whatsapp: z
    .string()
    .trim()
    .min(1, 'Please enter a contact number.')
    .regex(PHONE_RE, 'Please enter a valid phone number (include your country code).'),

  country: z.string().trim().max(80).optional().or(z.literal('')),
  destination: z.string().trim().max(120).optional().or(z.literal('')),
  startDate: z.string().trim().max(40).optional().or(z.literal('')),

  adults: z.coerce.number().int('Enter a whole number.').min(1, 'At least one adult.').max(40),
  children: z.coerce.number().int('Enter a whole number.').min(0).max(40).default(0),

  hotel: z.enum(HOTEL_VALUES).optional().or(z.literal('')),
  budget: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),

  // Trip-builder extras (/custom-trips). Optional everywhere else, so the plain
  // enquiry form stays valid without them.
  tripTypes: z.array(z.enum(TRIP_TYPE_VALUES)).max(TRIP_TYPE_OPTIONS.length).optional(),
  duration: z.enum(DURATION_VALUES).optional().or(z.literal('')),
  flexibility: z.enum(FLEXIBILITY_VALUES).optional().or(z.literal('')),

  consent: z.boolean().refine((v) => v === true, {
    message: 'Please confirm we can contact you about this enquiry.',
  }),

  // Tracking (hidden) — which trip/page produced the lead.
  tripSlug: z.string().trim().max(160).optional().or(z.literal('')),
  tripTitle: z.string().trim().max(200).optional().or(z.literal('')),
  source: z.string().trim().max(120).optional().or(z.literal('')),

  // Anti-spam (hidden). `company` is a honeypot; `elapsedMs` is a time-trap.
  company: z.string().max(0).optional().or(z.literal('')),
  elapsedMs: z.coerce.number().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

/**
 * Turn a stored option value into the wording the visitor actually saw, so the
 * enquiry that reaches a planner reads "10 – 14 days", not "10-14".
 */
export function labelFor(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label ?? value;
}

/** Client-side default values for the form. */
export const enquiryDefaults: Partial<EnquiryInput> = {
  fullName: '',
  email: '',
  whatsapp: '',
  country: '',
  destination: '',
  startDate: '',
  adults: 2,
  children: 0,
  hotel: '',
  budget: '',
  message: '',
  consent: false,
  company: '',
  tripTypes: [],
  duration: '',
  flexibility: '',
};
