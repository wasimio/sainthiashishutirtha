'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { VERIFIED_CLASSES } from '@/data/schoolData';
import { submitAdmissionApplication } from '@/lib/actions/admissionsActions';

type FormState = { studentName: string; dob: string; gender: string; applyingGrade: string; parentName: string; phone: string; email: string; remarks: string };
const initialForm: FormState = { studentName: '', dob: '', gender: 'Boy', applyingGrade: 'KG', parentName: '', phone: '', email: '', remarks: '' };

/** The dedicated admissions route intentionally shares the established server action with the legacy modal. */
export default function AdmissionsEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [pending, setPending] = useState(false);
  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError(''); setFieldErrors({});
    const result = await submitAdmissionApplication({ ...form, relationship: 'Parent / Guardian', residentialArea: 'Sainthia Town', website_hp: honeypot });
    setPending(false);
    if (result.success && result.applicationNo) { setReference(result.applicationNo); return; }
    setError(result.error || 'We could not submit the enquiry. Please try again.');
    setFieldErrors(result.fieldErrors || {});
  }

  if (reference) return <section aria-live="polite" className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" /><h2 className="mt-4 text-2xl font-extrabold text-emerald-950">Enquiry received</h2><p className="mt-2 text-sm text-emerald-900">Thank you. Please keep this reference for the school office.</p><p className="mx-auto mt-5 w-fit rounded-xl border border-emerald-200 bg-white px-5 py-3 font-mono text-lg font-black text-emerald-950">{reference}</p><button type="button" onClick={() => { setReference(''); setForm(initialForm); }} className="mt-6 rounded-xl bg-heritage-teal px-5 py-3 text-sm font-bold text-white">Submit another enquiry</button></section>;

  const inputClass = (name: keyof FormState) => `mt-1 w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:border-heritage-teal focus:ring-2 focus:ring-heritage-teal/20 ${fieldErrors[name] ? 'border-status-error bg-red-50' : 'border-slate-300 bg-white'}`;
  return <section id="admission-enquiry" className="site-container py-12 sm:py-20"><div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[2rem] bg-heritage-teal p-7 text-white sm:p-9"><ShieldCheck className="h-8 w-8 text-mustard" /><h2 className="mt-5 font-display text-3xl font-bold">Submit an admission enquiry</h2><p className="mt-4 text-sm leading-7 text-white/85">Share the essential details below. The school office can then guide you on availability and the next steps.</p><p className="mt-8 border-t border-white/20 pt-5 text-xs leading-5 text-white/75">Your details are used only to respond to this admission enquiry. Please do not include sensitive documents here.</p></div><form onSubmit={submit} aria-busy={pending} className="rounded-[2rem] border border-warm-card-border bg-white p-6 shadow-[0_18px_55px_rgba(20,56,63,.10)] sm:p-8"><div className="grid gap-5 sm:grid-cols-2"><Field label="Student name" error={fieldErrors.studentName}><input required autoComplete="name" value={form.studentName} onChange={(e) => update('studentName', e.target.value)} className={inputClass('studentName')} /></Field><Field label="Parent / guardian name" error={fieldErrors.parentName}><input required autoComplete="name" value={form.parentName} onChange={(e) => update('parentName', e.target.value)} className={inputClass('parentName')} /></Field><Field label="Mobile number" error={fieldErrors.phone}><input required type="tel" inputMode="numeric" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass('phone')} /></Field><Field label="Email (optional)" error={fieldErrors.email}><input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass('email')} /></Field><Field label="Class applying for"><select value={form.applyingGrade} onChange={(e) => update('applyingGrade', e.target.value)} className={inputClass('applyingGrade')}>{VERIFIED_CLASSES.map((schoolClass) => <option key={schoolClass.code} value={schoolClass.name}>{schoolClass.name} ({schoolClass.wing})</option>)}</select></Field><Field label="Date of birth" error={fieldErrors.dob}><input required type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} className={inputClass('dob')} /></Field></div><fieldset className="mt-5"><legend className="text-sm font-bold text-text-headline">Student gender</legend><div className="mt-2 flex gap-5 text-sm"><label><input className="mr-2" type="radio" name="gender" checked={form.gender === 'Boy'} onChange={() => update('gender', 'Boy')} />Boy</label><label><input className="mr-2" type="radio" name="gender" checked={form.gender === 'Girl'} onChange={() => update('gender', 'Girl')} />Girl</label><label><input className="mr-2" type="radio" name="gender" checked={form.gender === 'Other'} onChange={() => update('gender', 'Other')} />Other</label></div></fieldset><Field label="Additional information (optional)" error={fieldErrors.remarks}><textarea rows={3} value={form.remarks} onChange={(e) => update('remarks', e.target.value)} className={inputClass('remarks')} /></Field><input tabIndex={-1} aria-hidden="true" autoComplete="off" className="hidden" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /><p className="mt-5 text-xs text-text-muted">By submitting, you consent to the school contacting you about this enquiry.</p>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-status-error">{error}</p>}<button type="submit" disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-5 text-sm font-extrabold text-white transition hover:bg-terracotta-hover disabled:opacity-70">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{pending ? 'Submitting enquiry…' : 'Submit Enquiry'}</button></form></div></section>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="mt-5 block text-sm font-bold text-text-headline">{label}{children}{error && <span role="alert" className="mt-1 block text-xs font-medium text-status-error">{error}</span>}</label>; }
