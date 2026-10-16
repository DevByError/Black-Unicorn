'use client';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { disciplineLabels } from '@/content/projects';
import { site } from '@/content/site';

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'fallback' | 'unconfigured';
type Fields = 'name' | 'email' | 'message';
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '';
const MIN_FILL_MS = 2000; // anti-spam: nobody fills this faster
const RATE_LIMIT_MS = 30_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Contact form (compact on home, full on /contact). Accessibility: visible labels, autocomplete tokens, inline errors
 * with an alert summary that takes focus on a failed submit, busy state, and a success heading that takes focus.
 * Without an endpoint it opens the visitor's email app (mailto) and says so; without JS it posts normally.
 */
export function ContactForm({ variant = 'full' }: { variant?: 'compact' | 'full' }) {
  const uid = useId();
  const full = variant === 'full';
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});
  const mounted = useRef(0); // set on mount: Date.now() is impure during render
  const lastSent = useRef(0);
  const summary = useRef<HTMLDivElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => { mounted.current = Date.now(); }, []);
  useEffect(() => { if (Object.keys(errors).length) summary.current?.focus(); }, [errors]);
  useEffect(() => { if (status === 'success') success.current?.focus(); }, [status]);

  const validate = (fd: FormData) => {
    const e: Partial<Record<Fields, string>> = {};
    if (!String(fd.get('name') ?? '').trim()) e.name = 'Enter your name.';
    if (!EMAIL_RE.test(String(fd.get('email') ?? '').trim())) e.email = 'Enter an email address like name@example.com';
    if (String(fd.get('message') ?? '').trim().length < 20) e.message = 'Please write at least 20 characters so we can understand your project.';
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    if (fd.get('website')) return; // honeypot: bots fill it, people never see it
    if (Date.now() - mounted.current < MIN_FILL_MS || Date.now() - lastSent.current < RATE_LIMIT_MS) { setStatus('error'); return; }
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) return;

    const payload = Object.fromEntries(fd.entries());
    if (!ENDPOINT) {
      if (!site.email) { setStatus('unconfigured'); return; }
      const body = `${payload.message}\n\n${payload.name} <${payload.email}>${payload.company ? `\n${payload.company}` : ''}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(body)}`;
      setStatus('fallback');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(String(res.status));
      lastSent.current = Date.now();
      formRef.current?.reset();
      setStatus('success');
    } catch {
      setStatus('error'); // the form keeps its values so nothing is lost
    }
  };

  if (status === 'success') {
    return (
      <div className="form-note form-note--ok">
        <h3 ref={success} tabIndex={-1} className="h4">Thank you.</h3>
        <p>We&apos;ve received your message and will reply by email.</p>
      </div>
    );
  }
  const errList = Object.entries(errors) as [Fields, string][];
  const field = (name: Fields) => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? `${uid}-${name}-err` : `${uid}-${name}-hint` });
  const submitting = status === 'submitting';

  return (
    <form ref={formRef} className={`form form--${variant}`} onSubmit={onSubmit} noValidate action={ENDPOINT || (site.email ? `mailto:${site.email}` : undefined)} method="post" encType={ENDPOINT ? undefined : 'text/plain'} aria-busy={submitting}>
      {errList.length > 0 && (
        <div ref={summary} role="alert" tabIndex={-1} className="form-note form-note--err">
          <p className="h4"><Icon name="alert" /> Please fix {errList.length === 1 ? 'this' : 'these'} before sending:</p>
          <ul>{errList.map(([k, m]) => (<li key={k}><a href={`#${uid}-${k}`} className="link-inline">{m}</a></li>))}</ul>
        </div>
      )}
      <div className="field">
        <label htmlFor={`${uid}-name`}>Your name <span className="muted">(required)</span></label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required {...field('name')} />
        <p id={`${uid}-name-hint`} className="visually-hidden">Required</p>
        {errors.name && <p id={`${uid}-name-err`} className="field__err"><Icon name="alert" />{errors.name}</p>}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-email`}>Email address <span className="muted">(required)</span></label>
        <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" required {...field('email')} />
        <p id={`${uid}-email-hint`} className="visually-hidden">Required</p>
        {errors.email && <p id={`${uid}-email-err`} className="field__err"><Icon name="alert" />{errors.email}</p>}
      </div>
      {full && (
        <>
          <div className="field">
            <label htmlFor={`${uid}-company`}>Company <span className="muted">(optional)</span></label>
            <input id={`${uid}-company`} name="company" type="text" autoComplete="organization" />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor={`${uid}-type`}>Project type</label>
              <select id={`${uid}-type`} name="projectType" defaultValue="">
                <option value="" disabled>Choose one</option>
                {Object.entries(disciplineLabels).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
                <option value="other">Something else</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${uid}-budget`}>Budget range <span className="muted">(optional)</span></label>
              <select id={`${uid}-budget`} name="budget" defaultValue="">
                <option value="">Prefer not to say</option>
                <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
              </select>
            </div>
          </div>
        </>
      )}
      <div className="field">
        <label htmlFor={`${uid}-message`}>Tell us about your project <span className="muted">(required)</span></label>
        <textarea id={`${uid}-message`} name="message" rows={full ? 7 : 4} required minLength={20} {...field('message')} />
        <p id={`${uid}-message-hint`} className="field__hint muted">At least 20 characters.</p>
        {errors.message && <p id={`${uid}-message-err`} className="field__err"><Icon name="alert" />{errors.message}</p>}
      </div>
      <div className="field--trap" aria-hidden="true"><label>Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>

      {status === 'error' && <p role="alert" className="form-note form-note--err">Something went wrong and your message was not sent. Your text is still here. Please try again, or email us directly.</p>}
      {status === 'fallback' && <p role="status" className="form-note">Opening your email app with your message ready to send.</p>}
      {status === 'unconfigured' && <p role="alert" className="form-note form-note--err">This form is not connected yet: no form endpoint or contact email has been set. See the README.</p>}

      <button type="submit" className="btn btn--primary" disabled={submitting} aria-disabled={submitting}>
        {submitting ? (<><span className="spinner" aria-hidden="true" />Sending…</>) : (<>Send message</>)}
      </button>
      <p className="muted field__hint">By sending, you agree to our <Link href="/privacy" className="link-inline">privacy statement</Link>.</p>
    </form>
  );
}
