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
};
