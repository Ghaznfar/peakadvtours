'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/site.config';
import { Button } from '@/components/ui/Button';
import {
  DURATION_OPTIONS,
  FLEXIBILITY_OPTIONS,
  HOTEL_OPTIONS,
  TRIP_TYPE_OPTIONS,
  enquiryDefaults,
  enquirySchema,
  labelFor,
  type EnquiryInput,
} from '@/lib/enquiry/schema';

const inputClasses =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-brand-400';

/**
 * The four steps, and which fields each one owns. The field lists drive both the
 * per-step validation (`trigger`) and which errors the step shows, so adding a
 * field only means adding it here.
 */
const STEPS = [
  {
    id: 'who',
    title: "Who's travelling",
    blurb: 'So the reply reaches you, and we know which permits apply.',
    fields: ['fullName', 'email', 'whatsapp', 'country'],
  },
  {
    id: 'party',
    title: 'How many of you',
    blurb: 'Party size sets the per-person price — a group of six pays less each than a couple.',
    fields: ['adults', 'children', 'hotel'],
  },
  {
    id: 'when',
    title: 'When and for how long',
    blurb: 'Dates decide whether the passes are open. A rough answer is enough to start.',
    fields: ['startDate', 'flexibility', 'duration'],
  },
  {
    id: 'trip',
    title: 'The trip itself',
    blurb: 'The more you tell us here, the closer the first draft lands.',
    fields: ['tripTypes', 'destination', 'budget', 'message', 'consent'],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  title: string;
  blurb: string;
  fields: ReadonlyArray<keyof EnquiryInput>;
}>;

export interface TripBuilderProps {
  destinationOptions?: { value: string; label: string }[];
  defaultDestination?: string;
  /** When set (e.g. arriving from a trip page) the enquiry auto-attaches the trip. */
  tripSlug?: string;
  tripTitle?: string;
  /** Which page/context produced this enquiry (analytics/routing). */
  source?: string;
  className?: string;
}

/**
 * The /custom-trips itinerary builder: the enquiry broken into four short steps
 * with a summary panel that fills in as you answer.
 *
 * It posts to the same `/api/enquiry` endpoint and validates with the same Zod
 * schema as `EnquiryForm` (CLAUDE.md §4) — only the presentation differs. Steps
 * validate on "Continue" so nobody reaches the end and is sent back to step one.
 */
export function TripBuilder({
  destinationOptions = [],
  defaultDestination,
  tripSlug,
  tripTitle,
  source,
  className,
}: TripBuilderProps) {
  const uid = useId();
  // Form-open timestamp for the spam time-trap (a stable number, not a ref, so
  // the submit handler never reads a ref during render).
  const [startedAt] = useState(() => Date.now());
  const [stepIndex, setStepIndex] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  // Move focus to the new step's heading, but not on first render.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  const {
    control,
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    mode: 'onTouched',
    defaultValues: {
      ...enquiryDefaults,
      destination: defaultDestination ?? '',
      tripSlug: tripSlug ?? '',
      tripTitle: tripTitle ?? '',
      source: source ?? '',
    },
  });

  // `useWatch` rather than `watch()` — it is the memoizable API, so the React
  // Compiler doesn't skip this component.
  const values = useWatch({ control });
  const step = STEPS[stepIndex]!;
  const isLastStep = stepIndex === STEPS.length - 1;

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;

  async function goNext() {
    const ok = await trigger(step.fields as unknown as Array<keyof EnquiryInput>);
    if (!ok) return;
    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    setServerError(null);
    setStepIndex(next);
    setFurthest((f) => Math.max(f, next));
  }

  function goTo(index: number) {
    if (index > furthest) return;
    setServerError(null);
    setStepIndex(index);
  }

  /** Toggle a value inside the multi-select `tripTypes` array. */
  function toggleTripType(value: string) {
    const current = values.tripTypes ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setValue('tripTypes', next, { shouldDirty: true });
  }

  /** Clamped +/- for the traveller counters. */
  function bump(name: 'adults' | 'children', delta: number) {
    const min = name === 'adults' ? 1 : 0;
    const current = Number(values[name] ?? min);
    const next = Math.min(40, Math.max(min, (Number.isFinite(current) ? current : min) + delta));
    setValue(name, next, { shouldDirty: true, shouldValidate: true });
  }

  async function onValid(input: EnquiryInput) {
    setServerError(null);

    const urlParams = new URLSearchParams(window.location.search);
    const payload = {
      ...input,
      // Event-time (not render) — the spam time-trap needs the current clock.
      // eslint-disable-next-line react-hooks/purity
      elapsedMs: Date.now() - startedAt,
      source: input.source || urlParams.get('source') || window.location.pathname,
      tripSlug: input.tripSlug || urlParams.get('trip') || '',
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

      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string[]>;
      } | null;

      if (data?.fieldErrors) {
        for (const [name, messages] of Object.entries(data.fieldErrors)) {
          if (messages?.[0]) setError(name as keyof EnquiryInput, { message: messages[0] });
          // Send the visitor back to the step that owns the rejected field.
          const owning = STEPS.findIndex((s) => (s.fields as ReadonlyArray<string>).includes(name));
          if (owning >= 0) setStepIndex((i) => Math.min(i, owning));
        }
      }
      setServerError(data?.error ?? 'Something went wrong. Please try again.');
    } catch {
      setServerError('We couldn’t reach the server. Please try again or contact us on WhatsApp.');
    }
  }

  /**
   * Submit validates the whole schema, so an answer edited on an earlier step
   * (or filled in by the browser) can fail while the last step looks fine.
   * Jump back to the step that owns it rather than failing silently.
   */
  function onInvalid(formErrors: Record<string, unknown>) {
    const names = Object.keys(formErrors);
    const earliest = STEPS.findIndex((s) =>
      (s.fields as ReadonlyArray<string>).some((f) => names.includes(f)),
    );
    if (earliest >= 0 && earliest < stepIndex) {
      setStepIndex(earliest);
      setServerError(
        `Please check ${STEPS[earliest]!.title.toLowerCase()} — something is missing.`,
      );
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className={cn(
          'rounded-card border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-950/60 flex flex-col items-center border p-10 text-center',
          className,
        )}
      >
        <CheckCircle2 aria-hidden className="text-brand-600 dark:text-brand-400 size-10" />
        <h2 className="font-display mt-3 text-xl font-semibold text-slate-900 dark:text-white">
          Your trip brief is with us
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          A trip planner reads it personally and comes back with a costed day-by-day itinerary,
          usually within 24 hours. Nothing is booked and nothing is owed until you say yes.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_330px]',
        className,
      )}
    >
      <form
        onSubmit={handleSubmit(onValid, onInvalid)}
        noValidate
        className="rounded-card border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        <StepRail current={stepIndex} furthest={furthest} onSelect={goTo} />

        <p className="mt-7 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase dark:text-slate-500">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display mt-1 text-2xl font-semibold text-slate-900 focus-visible:outline-none dark:text-white"
        >
          {step.title}
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{step.blurb}</p>

        {serverError && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
          >
            {serverError}
          </p>
        )}

        <div className="mt-6">
          {step.id === 'who' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id={fieldId('fullName')}
                label="Full name"
                required
                error={errors.fullName?.message}
              >
                <input
                  id={fieldId('fullName')}
                  type="text"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? errorId('fullName') : undefined}
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
                  aria-describedby={errors.email ? errorId('email') : undefined}
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
                  aria-describedby={errors.whatsapp ? errorId('whatsapp') : undefined}
                  className={inputClasses}
                  {...register('whatsapp')}
                />
              </Field>
              <Field
                id={fieldId('country')}
                label="Country of residence"
                hint="Decides which permits and visas apply"
                error={errors.country?.message}
              >
                <input
                  id={fieldId('country')}
                  type="text"
                  autoComplete="country-name"
                  className={inputClasses}
                  {...register('country')}
                />
              </Field>
            </div>
          )}

          {step.id === 'party' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Counter
                  id={fieldId('adults')}
                  label="Adults"
                  value={Number(values.adults ?? 1)}
                  min={1}
                  error={errors.adults?.message}
                  onDecrease={() => bump('adults', -1)}
                  onIncrease={() => bump('adults', 1)}
                  registration={register('adults', { valueAsNumber: true })}
                />
                <Counter
                  id={fieldId('children')}
                  label="Children (under 12)"
                  value={Number(values.children ?? 0)}
                  min={0}
                  error={errors.children?.message}
                  onDecrease={() => bump('children', -1)}
                  onIncrease={() => bump('children', 1)}
                  registration={register('children', { valueAsNumber: true })}
                />
              </div>

              <Field
                id={fieldId('hotel')}
                label="Where would you like to stay?"
                error={errors.hotel?.message}
              >
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
            </div>
          )}

          {step.id === 'when' && (
            <div className="flex flex-col gap-6">
              <div className="max-w-xs">
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
              </div>

              <ChipGroup
                legend="How fixed are those dates?"
                options={FLEXIBILITY_OPTIONS}
                isSelected={(v) => values.flexibility === v}
                onToggle={(v) =>
                  setValue('flexibility', values.flexibility === v ? '' : v, { shouldDirty: true })
                }
              />

              <ChipGroup
                legend="Roughly how long?"
                options={DURATION_OPTIONS}
                isSelected={(v) => values.duration === v}
                onToggle={(v) =>
                  setValue('duration', values.duration === v ? '' : v, { shouldDirty: true })
                }
              />
            </div>
          )}

          {step.id === 'trip' && (
            <div className="flex flex-col gap-6">
              <ChipGroup
                legend="What kind of trip is it?"
                hint="Pick as many as apply"
                options={TRIP_TYPE_OPTIONS}
                isSelected={(v) => (values.tripTypes ?? []).includes(v)}
                onToggle={toggleTripType}
              />

              {!tripTitle && destinationOptions.length > 0 && (
                <ChipGroup
                  legend="Anywhere in particular?"
                  hint="Leave it blank and we'll suggest a route"
                  options={destinationOptions}
                  isSelected={(v) => values.destination === v}
                  onToggle={(v) =>
                    setValue('destination', values.destination === v ? '' : v, {
                      shouldDirty: true,
                    })
                  }
                />
              )}

              <div className="max-w-xs">
                <Field
                  id={fieldId('budget')}
                  label="Budget per person (USD)"
                  hint="A rough figure gets one honest itinerary instead of three hedged ones"
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
                label="Anything else we should know?"
                hint="Altitude worries, diet, an anniversary, a peak you have always wanted to see"
                error={errors.message?.message}
              >
                <textarea
                  id={fieldId('message')}
                  rows={4}
                  className={cn(inputClasses, 'h-auto py-2')}
                  {...register('message')}
                />
              </Field>

              <div>
                <label className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? errorId('consent') : undefined}
                    className="focus-visible:ring-brand-600 text-brand-600 dark:focus-visible:ring-brand-400 mt-0.5 size-4 rounded border-slate-300 focus-visible:ring-2 dark:border-slate-600 dark:bg-slate-900"
                    {...register('consent')}
                  />
                  <span>
                    I&rsquo;d like {siteConfig.name} to contact me about this trip.{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id={errorId('consent')}
                    className="mt-1 text-xs text-red-600 dark:text-red-400"
                  >
                    {errors.consent.message as string}
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-500">
                We use your details only to answer this enquiry — never sold, never passed on, and
                deleted on request. See our{' '}
                <a
                  href="/privacy"
                  className="hover:text-brand-700 dark:hover:text-brand-400 underline"
                >
                  privacy policy
                </a>
                .
              </p>
            </div>
          )}
        </div>

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

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          {stepIndex > 0 && (
            <Button type="button" variant="outline" onClick={() => goTo(stepIndex - 1)}>
              <ArrowLeft aria-hidden className="size-4" />
              Back
            </Button>
          )}
          {isLastStep ? (
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 aria-hidden className="size-5 animate-spin" />}
              {isSubmitting ? 'Sending…' : 'Send my trip brief'}
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={goNext}>
              Continue
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          )}
        </div>
      </form>

      <TripSummary
        values={values}
        tripTitle={tripTitle}
        destinationOptions={destinationOptions}
        completed={furthest}
      />
    </div>
  );
}

/** The numbered progress rail. Visited steps are links back; future ones are not. */
function StepRail({
  current,
  furthest,
  onSelect,
}: {
  current: number;
  furthest: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((s, i) => {
        const isDone = i < furthest || (i < current && i <= furthest);
        const isCurrent = i === current;
        const isReachable = i <= furthest;
        return (
          <li key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(i)}
              disabled={!isReachable}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-left text-[13px] font-medium transition-colors',
                'focus-visible:ring-brand-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                isCurrent
                  ? 'bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300'
                  : 'text-slate-500 dark:text-slate-400',
                isReachable && !isCurrent && 'hover:text-slate-800 dark:hover:text-slate-200',
                !isReachable && 'cursor-default',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  isCurrent
                    ? 'bg-brand-600 text-white'
                    : isDone
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300'
                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500',
                )}
              >
                {isDone && !isCurrent ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">Step {i + 1}</span>
            </button>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className="hidden h-px w-4 bg-slate-200 lg:block dark:bg-slate-700"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Live recap of everything answered so far. Sticks beside the form on desktop. */
function TripSummary({
  values,
  tripTitle,
  destinationOptions,
  completed,
}: {
  values: Partial<EnquiryInput>;
  tripTitle?: string;
  destinationOptions: { value: string; label: string }[];
  completed: number;
}) {
  const travellers = [
    `${Number(values.adults ?? 0)} adult${Number(values.adults ?? 0) === 1 ? '' : 's'}`,
    Number(values.children ?? 0) > 0
      ? `${values.children} child${Number(values.children) === 1 ? '' : 'ren'}`
      : '',
  ]
    .filter(Boolean)
    .join(', ');

  const tripTypes = (values.tripTypes ?? [])
    .map((v) => labelFor(TRIP_TYPE_OPTIONS, v))
    .filter(Boolean)
    .join(', ');

  const rows: Array<{ label: string; value?: string }> = [
    { label: 'Name', value: values.fullName || undefined },
    { label: 'From', value: values.country || undefined },
    { label: 'Travellers', value: completed >= 1 ? travellers : undefined },
    { label: 'Stay', value: labelFor(HOTEL_OPTIONS, values.hotel || undefined) },
    { label: 'Start date', value: values.startDate || undefined },
    { label: 'Dates', value: labelFor(FLEXIBILITY_OPTIONS, values.flexibility || undefined) },
    { label: 'Length', value: labelFor(DURATION_OPTIONS, values.duration || undefined) },
    { label: 'Trip type', value: tripTypes || undefined },
    {
      label: 'Destination',
      value: tripTitle ?? labelFor(destinationOptions, values.destination || undefined),
    },
    { label: 'Budget', value: values.budget ? `$${values.budget} pp` : undefined },
  ];

  const answered = rows.filter((r) => r.value).length;

  return (
    <aside className="rounded-card border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-24 dark:border-slate-800 dark:bg-slate-900/60">
      <h2 className="font-display flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
        <Sparkles aria-hidden className="text-brand-600 dark:text-brand-400 size-4" />
        Your trip so far
      </h2>

      {answered === 0 ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Nothing yet — answer the first step and it starts filling in here.
        </p>
      ) : (
        <dl aria-live="polite" className="mt-4 flex flex-col gap-2.5">
          {rows.map((row) =>
            row.value ? (
              <div key={row.label} className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="shrink-0 text-slate-500 dark:text-slate-400">{row.label}</dt>
                <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
                  {row.value}
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      )}

      <p className="mt-5 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Nothing is booked and nothing is owed. You get a costed day-by-day itinerary first, and you
        can have it rewritten as many times as you like.
      </p>
    </aside>
  );
}

/** Row of toggleable chips. Single- or multi-select is decided by the caller. */
function ChipGroup({
  legend,
  hint,
  options,
  isSelected,
  onToggle,
}: {
  legend: string;
  hint?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  isSelected: (value: string) => boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-slate-700 dark:text-slate-300">{legend}</legend>
      {hint && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">{hint}</p>}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => {
          const selected = isSelected(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onToggle(o.value)}
              className={cn(
                'min-h-11 rounded-full border px-4 text-sm font-medium transition-colors',
                'focus-visible:ring-brand-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                selected
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** Number field with +/- controls; the input itself stays editable and labelled. */
function Counter({
  id,
  label,
  value,
  min,
  error,
  onDecrease,
  onIncrease,
  registration,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  error?: string;
  onDecrease: () => void;
  onIncrease: () => void;
  registration: ReturnType<ReturnType<typeof useForm>['register']>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrease}
          disabled={value <= min}
          aria-label={`One fewer ${label.toLowerCase()}`}
          className="focus-visible:ring-brand-600 inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Minus aria-hidden className="size-4" />
        </button>
        <input
          id={id}
          type="number"
          min={min}
          max={40}
          inputMode="numeric"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClasses, 'text-center')}
          {...registration}
        />
        <button
          type="button"
          onClick={onIncrease}
          disabled={value >= 40}
          aria-label={`One more ${label.toLowerCase()}`}
          className="focus-visible:ring-brand-600 inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Plus aria-hidden className="size-4" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
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
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
