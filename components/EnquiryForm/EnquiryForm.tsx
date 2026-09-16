'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';

export interface EnquiryFormProps {
  /** Options for the "where do you want to go?" select. */
  destinationOptions?: { value: string; label: string }[];
  /** Preselect a destination/trip (e.g. when opened from a trip card). */
  defaultDestination?: string;
  /** Context passed to the API for routing/labelling the lead. */
  context?: 'contact' | 'trip' | 'corporate';
  className?: string;
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  whatsapp?: string;
  consent?: string;
}

const inputClasses =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lead-capture enquiry form. Accessible (labels, aria-invalid, aria-describedby,
 * an error summary with role="alert") and self-contained. Submits JSON to
 * /api/enquiry. Full Zod/RHF validation + email delivery are hardened in a later
 * phase; this validates client-side and posts to a working stub route.
 */
export function EnquiryForm({
  destinationOptions = [],
  defaultDestination = '',
  context = 'contact',
  className,
}: EnquiryFormProps) {
  const uid = useId();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: string) => `${uid}-${name}`;
  const errId = (name: string) => `${uid}-${name}-error`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill hidden fields; humans don't.
    if ((data.get('company') as string)?.length) return;

    const values = {
      context,
      fullName: (data.get('fullName') as string)?.trim() ?? '',
      email: (data.get('email') as string)?.trim() ?? '',
      whatsapp: (data.get('whatsapp') as string)?.trim() ?? '',
      destination: (data.get('destination') as string) ?? '',
      startDate: (data.get('startDate') as string) ?? '',
      adults: Number(data.get('adults') ?? 1),
      message: (data.get('message') as string)?.trim() ?? '',
      consent: data.get('consent') === 'on',
    };

    const nextErrors: FieldErrors = {};
    if (!values.fullName) nextErrors.fullName = 'Please enter your name.';
    if (!values.email) nextErrors.email = 'Please enter your email.';
    else if (!EMAIL_RE.test(values.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!values.whatsapp) nextErrors.whatsapp = 'Please enter a contact number.';
    if (!values.consent)
      nextErrors.consent = 'Please confirm we can contact you about this enquiry.';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the error summary for screen-reader users.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
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
          Thanks — a trip planner will reply personally, usually within a few hours.
        </p>
        <Button variant="outline" size="sm" className="mt-5" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const errorList = Object.entries(errors);

  return (
    <form onSubmit={handleSubmit} noValidate className={cn('flex flex-col gap-4', className)}>
      {/* Error summary */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
        >
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-1 list-inside list-disc">
            {errorList.map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          Something went wrong sending your enquiry. Please try again or contact us on WhatsApp.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={fieldId('fullName')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id={fieldId('fullName')}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? errId('fullName') : undefined}
            className={inputClasses}
          />
          {errors.fullName && (
            <p id={errId('fullName')} className="mt-1 text-xs text-red-600">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={fieldId('email')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errId('email') : undefined}
            className={inputClasses}
          />
          {errors.email && (
            <p id={errId('email')} className="mt-1 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={fieldId('whatsapp')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            WhatsApp / phone <span className="text-red-500">*</span>
          </label>
          <input
            id={fieldId('whatsapp')}
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            required
            placeholder="Include your country code"
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? errId('whatsapp') : undefined}
            className={inputClasses}
          />
          {errors.whatsapp && (
            <p id={errId('whatsapp')} className="mt-1 text-xs text-red-600">
              {errors.whatsapp}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor={fieldId('destination')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Where do you want to go?
          </label>
          <select
            id={fieldId('destination')}
            name="destination"
            defaultValue={defaultDestination}
            className={cn(inputClasses, 'appearance-none')}
          >
            <option value="">Not sure — advise me</option>
            {destinationOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor={fieldId('startDate')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Preferred start date
          </label>
          <input id={fieldId('startDate')} name="startDate" type="date" className={inputClasses} />
        </div>

        <div>
          <label
            htmlFor={fieldId('adults')}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Travellers
          </label>
          <input
            id={fieldId('adults')}
            name="adults"
            type="number"
            min={1}
            defaultValue={2}
            inputMode="numeric"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={fieldId('message')}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Anything we should know?
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={4}
          className={cn(inputClasses, 'h-auto py-2')}
        />
      </div>

      {/* Honeypot (visually hidden, ignored by users, filled by bots) */}
      <div aria-hidden className="hidden">
        <label htmlFor={fieldId('company')}>Company</label>
        <input
          id={fieldId('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            name="consent"
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errId('consent') : undefined}
            className="text-brand-600 focus-visible:ring-brand-600 mt-0.5 size-4 rounded border-slate-300 focus-visible:ring-2"
          />
          <span>
            I&rsquo;d like to be contacted about this enquiry. My details are used only to answer
            it. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id={errId('consent')} className="mt-1 text-xs text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' && <Loader2 aria-hidden className="size-5 animate-spin" />}
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  );
}
