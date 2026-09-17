'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/site.config';
import { Button } from '@/components/ui/Button';
import {
  enquirySchema,
  enquiryDefaults,
  HOTEL_OPTIONS,
  type EnquiryInput,
} from '@/lib/enquiry/schema';

const inputClasses =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500';

export interface EnquiryFormProps {
  destinationOptions?: { value: string; label: string }[];
  defaultDestination?: string;
  /** When set (e.g. on a trip detail page) the enquiry auto-attaches the trip. */
  tripSlug?: string;
  tripTitle?: string;
  /** Which page/context produced this enquiry (analytics/routing). */
  source?: string;
  className?: string;
}

/**
 * Production enquiry form. React Hook Form + Zod (the same schema the API
 * validates), with accessible errors, loading/success/failure states, honeypot
 * + time-trap spam protection, and trip/source tracking. Submits JSON to
 * /api/enquiry; no secrets touch the browser.
 */
export function EnquiryForm({
  destinationOptions = [],
  defaultDestination,
  tripSlug,
  tripTitle,
  source,
  className,
}: EnquiryFormProps) {
  const uid = useId();
  // Form-open timestamp for the spam time-trap. Lazy state (a stable number)
  // rather than a ref, so the submit handler doesn't read a ref during render.
  const [startedAt] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  // Move keyboard focus to the error summary after a failed submit. Driven by a
  // token so the ref is only read inside an effect (never during render).
  const [focusToken, setFocusToken] = useState(0);
  useEffect(() => {
    if (focusToken > 0) summaryRef.current?.focus();
  }, [focusToken]);
  const requestSummaryFocus = () => setFocusToken((t) => t + 1);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      ...enquiryDefaults,
      destination: defaultDestination ?? '',
      tripSlug: tripSlug ?? '',
      tripTitle: tripTitle ?? '',
      source: source ?? '',
    },
  });

  const fieldId = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;
  const describedBy = (name: keyof EnquiryInput) => (errors[name] ? errId(name) : undefined);

  async function onValid(values: EnquiryInput) {
    setServerError(null);

    // Enrich tracking from the URL as a fallback (e.g. ?source=enquiry&trip=…).
    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      ...values,
      // Event-time (not render) — the spam time-trap needs the current clock.
      // eslint-disable-next-line react-hooks/purity
      elapsedMs: Date.now() - startedAt,
      source: values.source || urlParams.get('source') || window.location.pathname,
      tripSlug: values.tripSlug || urlParams.get('trip') || '',
    };

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
        return;
      }

      // Map server-side field errors back onto the form when provided.
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string[]>;
      } | null;

      if (data?.fieldErrors) {
        for (const [name, messages] of Object.entries(data.fieldErrors)) {
          if (messages?.[0]) setError(name as keyof EnquiryInput, { message: messages[0] });
        }
      }
      setServerError(data?.error ?? 'Something went wrong. Please try again.');
      requestSummaryFocus();
    } catch {
      setServerError('We couldn’t reach the server. Please try again or contact us on WhatsApp.');
      requestSummaryFocus();
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-card border-brand-200 bg-brand-50 flex flex-col items-center border p-8 text-center',
          className,
        )}
        role="status"
      >
        <CheckCircle2 aria-hidden className="text-brand-600 size-10" />
        <h3 className="font-display mt-3 text-xl font-semibold text-slate-900">Enquiry sent</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thanks{tripTitle ? ` for your interest in the ${tripTitle}` : ''} — a trip planner will
          reply personally, usually within a few hours.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const errorEntries = Object.entries(errors);
  const showSummary = errorEntries.length > 0 || serverError;

  return (
    <form
      onSubmit={handleSubmit(onValid, requestSummaryFocus)}
      noValidate
      className={cn('flex flex-col gap-4', className)}
    >
      {showSummary && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
        >
          {serverError && <p className="font-semibold">{serverError}</p>}
          {errorEntries.length > 0 && (
            <>
              <p className="font-semibold">Please fix the following:</p>
              <ul className="mt-1 list-inside list-disc">
                {errorEntries.map(([name, err]) => (
                  <li key={name}>{err?.message as string}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {tripTitle && (
        <p className="bg-brand-50 text-brand-800 rounded-lg px-4 py-2 text-sm">
          Enquiring about <span className="font-semibold">{tripTitle}</span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id={fieldId('fullName')} label="Full name" required error={errors.fullName?.message}>
          <input
            id={fieldId('fullName')}
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy('fullName')}
            className={inputClasses}
            {...register('fullName')}
          />
        </Field>

        <Field id={fieldId('email')} label="Email" required error={errors.email?.message}>
          <input
            id={fieldId('email')}
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={inputClasses}
            {...register('email')}
          />
        </Field>

        <Field
          id={fieldId('whatsapp')}
          label="WhatsApp / phone"
          required
          hint="Include your country code"
          error={errors.whatsapp?.message}
        >
          <input
            id={fieldId('whatsapp')}
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={describedBy('whatsapp')}
            className={inputClasses}
            {...register('whatsapp')}
          />
        </Field>

        <Field id={fieldId('country')} label="Country of residence" error={errors.country?.message}>
          <input
            id={fieldId('country')}
            type="text"
            autoComplete="country-name"
            className={inputClasses}
            {...register('country')}
          />
        </Field>

        {!tripTitle && (
          <Field
            id={fieldId('destination')}
            label="Where do you want to go?"
            error={errors.destination?.message}
          >
            <select
              id={fieldId('destination')}
              className={cn(inputClasses, 'appearance-none')}
              {...register('destination')}
            >
              <option value="">Not sure — advise me</option>
              {destinationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field
          id={fieldId('startDate')}
          label="Preferred start date"
          error={errors.startDate?.message}
        >
          <input
            id={fieldId('startDate')}
            type="date"
            className={inputClasses}
            {...register('startDate')}
          />
        </Field>

        <Field id={fieldId('adults')} label="Adults" error={errors.adults?.message}>
          <input
            id={fieldId('adults')}
            type="number"
            min={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.adults)}
            aria-describedby={describedBy('adults')}
            className={inputClasses}
            {...register('adults', { valueAsNumber: true })}
          />
        </Field>

        <Field
          id={fieldId('children')}
          label="Children (under 12)"
          error={errors.children?.message}
        >
          <input
            id={fieldId('children')}
            type="number"
            min={0}
            inputMode="numeric"
            aria-invalid={Boolean(errors.children)}
            aria-describedby={describedBy('children')}
            className={inputClasses}
            {...register('children', { valueAsNumber: true })}
          />
        </Field>

        <Field id={fieldId('hotel')} label="Hotel preference" error={errors.hotel?.message}>
          <select
            id={fieldId('hotel')}
            className={cn(inputClasses, 'appearance-none')}
            {...register('hotel')}
          >
            <option value="">No preference</option>
            {HOTEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={fieldId('budget')}
          label="Budget per person (USD)"
          error={errors.budget?.message}
        >
          <input
            id={fieldId('budget')}
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2,000"
            className={inputClasses}
            {...register('budget')}
          />
        </Field>
      </div>

      <Field
        id={fieldId('message')}
        label="Additional requirements"
        error={errors.message?.message}
      >
        <textarea
          id={fieldId('message')}
          rows={4}
          className={cn(inputClasses, 'h-auto py-2')}
          {...register('message')}
        />
      </Field>

      {/* Hidden tracking fields */}
      <input type="hidden" {...register('tripSlug')} />
      <input type="hidden" {...register('tripTitle')} />
      <input type="hidden" {...register('source')} />

      {/* Honeypot — hidden from users, ignored by them, filled by bots */}
      <div aria-hidden className="hidden">
        <label htmlFor={fieldId('company')}>Company</label>
        <input
          id={fieldId('company')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy('consent')}
            className="focus-visible:ring-brand-600 text-brand-600 mt-0.5 size-4 rounded border-slate-300 focus-visible:ring-2"
            {...register('consent')}
          />
          <span>
            I&rsquo;d like {siteConfig.name} to contact me about this enquiry.{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id={errId('consent')} className="mt-1 text-xs text-red-600">
            {errors.consent.message as string}
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500">
        We use your details only to answer this enquiry — never sold, never passed on, and deleted
        on request. See our{' '}
        <a href="/privacy" className="hover:text-brand-700 underline">
          privacy policy
        </a>
        .
      </p>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {isSubmitting ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  );
}

/** Small labelled field wrapper for consistent, accessible field markup. */
function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
