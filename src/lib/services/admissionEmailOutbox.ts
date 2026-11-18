import 'server-only';

import { getAdminClient } from '@/lib/supabase/admin';
import type { Database, Json } from '@/types/database.types';

type EmailOutboxRow = Database['public']['Tables']['email_outbox']['Row'];
type DeliveryResult = { id: string; status: EmailOutboxRow['status']; error?: string };

const READY_STATUSES: EmailOutboxRow['status'][] = ['pending', 'retry_scheduled'];
const HOSTINGER_MAIL_BASE_URL = 'https://api.mail.hostinger.com';

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => (
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!
  ));
}

function payloadValue(payload: Json, key: string) {
  return payload && typeof payload === 'object' && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)[key]
    : undefined;
}

function renderTemplate(row: EmailOutboxRow) {
  const applicationNo = String(payloadValue(row.payload, 'application_no') ?? 'Pending reference');
  const studentName = String(payloadValue(row.payload, 'student_name') ?? 'Not provided');
  const guardianName = String(payloadValue(row.payload, 'guardian_name') ?? 'Not provided');
  const guardianPhone = String(payloadValue(row.payload, 'guardian_phone') ?? 'Not provided');
  const appliedClass = String(payloadValue(row.payload, 'applied_class') ?? 'Not specified');
  const safe = { applicationNo, studentName, guardianName, guardianPhone, appliedClass };

  if (row.template_key === 'admission_parent_acknowledgement') {
    return {
      subject: `Admission enquiry received — ${applicationNo}`,
      text: `Dear ${guardianName},\n\nWe have received the admission enquiry for ${studentName} (reference ${applicationNo}). Our admissions team will review it and contact you on ${guardianPhone}.\n\nRegards,\nShishu Tirtha`,
      html: `<p>Dear ${escapeHtml(guardianName)},</p><p>We have received the admission enquiry for <strong>${escapeHtml(studentName)}</strong> (reference <strong>${escapeHtml(applicationNo)}</strong>).</p><p>Our admissions team will review it and contact you on ${escapeHtml(guardianPhone)}.</p><p>Regards,<br>Shishu Tirtha</p>`,
    };
  }

  return {
    subject: `New admission enquiry — ${applicationNo}`,
    text: `A new admission enquiry was received.\n\nReference: ${applicationNo}\nStudent: ${studentName}\nGuardian: ${guardianName}\nPhone: ${guardianPhone}\nApplied class: ${appliedClass}`,
    html: `<h2>New admission enquiry</h2><table role="presentation"><tr><th align="left">Reference</th><td>${escapeHtml(safe.applicationNo)}</td></tr><tr><th align="left">Student</th><td>${escapeHtml(safe.studentName)}</td></tr><tr><th align="left">Guardian</th><td>${escapeHtml(safe.guardianName)}</td></tr><tr><th align="left">Phone</th><td>${escapeHtml(safe.guardianPhone)}</td></tr><tr><th align="left">Applied class</th><td>${escapeHtml(safe.appliedClass)}</td></tr></table>`,
  };
}

function retryAt(attemptCount: number) {
  const delayMinutes = Math.min(6 * 60, 2 ** Math.max(0, attemptCount - 1));
  return new Date(Date.now() + delayMinutes * 60_000).toISOString();
}

function config() {
  const token = process.env.HOSTINGER_MAIL_API_TOKEN;
  const mailboxResourceId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID;
  return token && mailboxResourceId ? { token, mailboxResourceId } : null;
}

async function markFailure(row: EmailOutboxRow, message: string, providerStatus?: number): Promise<DeliveryResult> {
  const attemptCount = row.attempt_count + 1;
  const terminal = attemptCount >= row.max_attempts;
  const status: EmailOutboxRow['status'] = terminal ? 'failed' : 'retry_scheduled';
  await getAdminClient().from('email_outbox').update({
    status,
    attempt_count: attemptCount,
    next_attempt_at: terminal ? row.next_attempt_at : retryAt(attemptCount),
    locked_at: null,
    provider_status: providerStatus ?? null,
    last_error: message.slice(0, 1000),
  }).eq('id', row.id);
  return { id: row.id, status, error: message };
}

async function deliverClaimed(row: EmailOutboxRow): Promise<DeliveryResult> {
  const mail = config();
  if (!mail) {
    return markFailure(row, 'Hostinger Mail is not configured on this server.');
  }

  const message = renderTemplate(row);
  try {
    const response = await fetch(
      `${HOSTINGER_MAIL_BASE_URL}/api/v1/mailboxes/${encodeURIComponent(mail.mailboxResourceId)}/send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mail.token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          to: [row.recipient_email],
          displayName: 'Shishu Tirtha',
          subject: message.subject.replace(/[\r\n]/g, ' '),
          text: message.text,
          html: message.html,
        }),
        signal: AbortSignal.timeout(12_000),
      },
    );

    if (response.status !== 204) {
      const responseText = await response.text().catch(() => '');
      return markFailure(row, `Hostinger Mail returned ${response.status}${responseText ? `: ${responseText.slice(0, 500)}` : ''}`, response.status);
    }

    await getAdminClient().from('email_outbox').update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      locked_at: null,
      provider_status: 204,
      last_error: null,
    }).eq('id', row.id);
    return { id: row.id, status: 'sent' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Hostinger Mail error';
    return markFailure(row, message);
  }
}

export async function dispatchAdmissionEmailOutbox(options: { applicationNo?: string; outboxId?: string; limit?: number } = {}) {
  const admin = getAdminClient();
  let query = admin.from('email_outbox').select('*').in('status', READY_STATUSES).lte('next_attempt_at', new Date().toISOString()).order('created_at', { ascending: true }).limit(Math.min(Math.max(options.limit ?? 10, 1), 25));
  if (options.outboxId) query = query.eq('id', options.outboxId);
  if (options.applicationNo) {
    const { data: application } = await admin.from('admissions_applications').select('id').eq('application_no', options.applicationNo).maybeSingle();
    if (!application) return [];
    query = query.eq('admission_application_id', application.id);
  }
  const { data: candidates } = await query;
  const results: DeliveryResult[] = [];
  for (const candidate of candidates ?? []) {
    const { data: claimed } = await admin.from('email_outbox').update({ status: 'processing', locked_at: new Date().toISOString(), last_error: null }).eq('id', candidate.id).in('status', READY_STATUSES).select('*').maybeSingle();
    if (claimed) results.push(await deliverClaimed(claimed));
  }
  return results;
}

export async function retryAdmissionEmailOutbox(outboxId: string) {
  const admin = getAdminClient();
  const { data: queued, error } = await admin.from('email_outbox').update({ status: 'pending', next_attempt_at: new Date().toISOString(), locked_at: null, last_error: null }).eq('id', outboxId).neq('status', 'sent').select('id').maybeSingle();
  if (error || !queued) return { success: false, error: error?.message ?? 'The delivery record cannot be retried.' };
  const results = await dispatchAdmissionEmailOutbox({ outboxId, limit: 1 });
  return { success: true, result: results[0] };
}
