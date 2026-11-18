'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/services/rateLimiter';
import { VERIFIED_CLASSES } from '@/data/schoolData';
import { requireAdmin } from '@/lib/auth/authorization';
import { dispatchAdmissionEmailOutbox } from '@/lib/services/admissionEmailOutbox';
import type { AdmissionStage, AdmissionStatus } from '@/types/database.types';

export interface AdmissionSubmissionPayload {
  studentName: string;
  dob: string;
  gender: string;
  applyingGrade: string;
  parentName: string;
  relationship?: string;
  phone: string;
  email?: string;
  residentialArea?: string;
  remarks?: string;
  website_hp?: string; // Honeypot field
}

export interface AdmissionSubmissionResult {
  success: boolean;
  applicationNo?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/**
 * Extracts client IP address from standard proxy headers
 */
async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get('x-forwarded-for');
    if (forwardedFor) {
      const firstIp = forwardedFor.split(',')[0].trim();
      if (firstIp) return firstIp;
    }
    const realIp = headerList.get('x-real-ip');
    if (realIp) return realIp.trim();
  } catch {
    // Graceful fallback for non-request environments
  }
  return '127.0.0.1';
}

/**
 * Normalizes phone numbers to standard 10-digit Indian mobile format
 */
function normalizeIndianPhone(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10 && /^[6-9]\d{9}$/.test(digits)) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91') && /^[6-9]\d{9}$/.test(digits.slice(2))) {
    return digits.slice(2);
  }
  return null;
}

/**
 * Resolves requested grade string to a verified class record or closest match
 */
function resolveClassMapping(gradeInput: string) {
  const normalized = gradeInput.trim().toLowerCase();
  for (const c of VERIFIED_CLASSES) {
    if (
      normalized === c.name.toLowerCase() ||
      normalized === c.code.toLowerCase() ||
      normalized.includes(c.name.toLowerCase())
    ) {
      return c;
    }
  }
  // Default to KG if no match
  return VERIFIED_CLASSES[2];
}

/**
 * Server Action: Process and persist public admission enquiry
 */
export async function submitAdmissionApplication(
  payload: AdmissionSubmissionPayload
): Promise<AdmissionSubmissionResult> {
  // 1. Honeypot check (Silent drop if bot filled out hidden field)
  if (payload.website_hp && payload.website_hp.trim().length > 0) {
    return {
      success: true,
      applicationNo: `ADM-${new Date().getFullYear()}-09999`,
    };
  }

  // 2. Enforce real in-memory IP sliding-window rate limiting
  const clientIp = await getClientIp();
  const rateLimit = checkRateLimit(`admission:${clientIp}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many admission enquiries from this connection. Please wait ${rateLimit.retryAfterSeconds} seconds before submitting again, or call the admissions desk at 9153336315.`,
    };
  }

  // 3. Server-side validation
  const fieldErrors: Record<string, string> = {};

  const trimmedName = (payload.studentName || '').trim();
  if (trimmedName.length < 2) {
    fieldErrors.studentName = "Child's full name must be at least 2 characters.";
  } else if (trimmedName.length > 60) {
    fieldErrors.studentName = "Child's full name must not exceed 60 characters.";
  }

  const nameParts = trimmedName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

  // Gender normalization: 'Boy' -> 'Male', 'Girl' -> 'Female'
  let dbGender: 'Male' | 'Female' | 'Other' = 'Male';
  const gUpper = (payload.gender || '').trim().toLowerCase();
  if (gUpper === 'girl' || gUpper === 'female') {
    dbGender = 'Female';
  } else if (gUpper === 'other') {
    dbGender = 'Other';
  } else if (gUpper === 'boy' || gUpper === 'male') {
    dbGender = 'Male';
  } else {
    fieldErrors.gender = 'Please select a valid gender option.';
  }

  // Date of birth validation (Candidate must be between 2 and 18 years of age)
  const dobStr = (payload.dob || '').trim();
  if (!dobStr) {
    fieldErrors.dob = 'Date of birth is required for grade eligibility verification.';
  } else {
    const parsedDate = new Date(dobStr);
    const today = new Date();
    const minDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDob = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());

    if (isNaN(parsedDate.getTime())) {
      fieldErrors.dob = 'Please enter a valid date of birth.';
    } else if (parsedDate > maxDob) {
      fieldErrors.dob = 'Candidate must be at least 2 years of age for admission.';
    } else if (parsedDate < minDob) {
      fieldErrors.dob = 'Candidate must be under 18 years of age.';
    }
  }

  const trimmedParent = (payload.parentName || '').trim();
  if (trimmedParent.length < 2) {
    fieldErrors.parentName = 'Parent / Guardian name must be at least 2 characters.';
  } else if (trimmedParent.length > 100) {
    fieldErrors.parentName = 'Parent / Guardian name must not exceed 100 characters.';
  }

  const validPhone = normalizeIndianPhone(payload.phone || '');
  if (!validPhone) {
    fieldErrors.phone = 'Please provide a valid 10-digit Indian mobile number (e.g. 98321 00000).';
  }

  const trimmedEmail = (payload.email || '').trim();
  if (trimmedEmail) {
    if (trimmedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      fieldErrors.email = 'Please provide a valid email address or leave it blank.';
    }
  }

  const residentialAddress = (payload.residentialArea || '').trim() || 'Sainthia Town';
  if (residentialAddress.length > 300) {
    fieldErrors.residentialArea = 'Residential locality must not exceed 300 characters.';
  }

  const trimmedRemarks = (payload.remarks || '').trim();
  if (trimmedRemarks.length > 500) {
    fieldErrors.remarks = 'Remarks must not exceed 500 characters.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      error: 'Please correct the highlighted fields and submit again.',
    };
  }

  // 4. Database Submission via Server-Only Privileged Client (service_role)
  try {
    const supabaseAdmin = getAdminClient();

    // 4a. Duplicate submission protection: check for recent duplicate within 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recentDup } = await supabaseAdmin
      .from('admissions_applications')
      .select('application_no')
      .eq('guardian_phone', validPhone!)
      .eq('candidate_first_name', firstName)
      .gte('created_at', thirtySecondsAgo)
      .limit(1)
      .maybeSingle();

    if (recentDup?.application_no) {
      return {
        success: true,
        applicationNo: recentDup.application_no,
      };
    }

    // Resolve current academic year
    let academicYearId = 'f5843275-1c51-436f-899a-28ddfd9f6335'; // Verified current 2026-2027 year
    const { data: currentYear } = await supabaseAdmin
      .from('academic_years')
      .select('id')
      .eq('is_current', true)
      .limit(1)
      .maybeSingle();

    if (currentYear?.id) {
      academicYearId = currentYear.id;
    }

    // Resolve applied class from database
    const targetClass = resolveClassMapping(payload.applyingGrade || '');
    let appliedClassId = '58c9e01e-f6cc-4bc0-9d93-277d50b9935b'; // Verified Class 1 fallback

    const { data: dbClasses } = await supabaseAdmin
      .from('classes')
      .select('id, code, name')
      .or(`code.eq.${targetClass.code},name.ilike.%${targetClass.name}%`)
      .limit(1)
      .maybeSingle();

    if (dbClasses?.id) {
      appliedClassId = dbClasses.id;
    }

    const notes = [
      trimmedRemarks ? `Remarks: ${trimmedRemarks}` : null,
      payload.relationship ? `Guardian: ${payload.relationship.trim()}` : null,
      targetClass.name ? `Applied Tier: ${targetClass.name}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    // 4b. Execute intake: First try RPC 'submit_admission_enquiry' if available
    let applicationNumber: string | null = null;

    try {
      const { data: rpcData, error: rpcError } = await (supabaseAdmin.rpc as unknown as (
        name: string,
        params: Record<string, unknown>
      ) => Promise<{ data: { success?: boolean; application_no?: string } | null; error: { code?: string; message?: string } | null }>)(
        'submit_admission_enquiry',
        {
          p_academic_year_id: academicYearId,
          p_applied_class_id: appliedClassId,
          p_candidate_first_name: firstName,
          p_candidate_last_name: lastName,
          p_date_of_birth: dobStr,
          p_gender: dbGender,
          p_guardian_name: trimmedParent,
          p_guardian_phone: validPhone,
          p_guardian_email: trimmedEmail || null,
          p_residential_address: residentialAddress,
          p_previous_school: notes || null,
        }
      );

      if (!rpcError && rpcData?.success && rpcData?.application_no) {
        applicationNumber = rpcData.application_no;
      }
    } catch {
      // RPC call threw or failed; proceed to direct table insertion fallback
    }

    // 4c. Seamless fallback: Direct table insertion into admissions_applications
    // Trigger trg_handle_admissions_application_insert generates application_no automatically
    if (!applicationNumber) {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('admissions_applications')
        .insert({
          academic_year_id: academicYearId,
          applied_class_id: appliedClassId,
          candidate_first_name: firstName,
          candidate_last_name: lastName,
          date_of_birth: dobStr,
          gender: dbGender,
          guardian_name: trimmedParent,
          guardian_phone: validPhone!,
          guardian_email: trimmedEmail || null,
          residential_address: residentialAddress,
          previous_school: notes || null,
          stage: 'Applied',
          status: 'Pending Review',
        })
        .select('application_no')
        .single();

      if (insertError) {
        console.error('Direct admissions_applications insert error:', insertError.message);
        return {
          success: false,
          error: 'We could not process your application. Please ensure all details are accurate, or contact the admissions office at 9153336315 / 8926769992.',
        };
      }

      if (inserted?.application_no) {
        applicationNumber = inserted.application_no;
      }
    }

    if (applicationNumber) {
      // Delivery is deliberately best-effort. The trigger has already persisted an
      // idempotent outbox row in the same transaction as the admission record.
      await dispatchAdmissionEmailOutbox({ applicationNo: applicationNumber, limit: 2 }).catch((error) =>
        console.error('Admission email dispatch failed after queueing:', error)
      );
      return {
        success: true,
        applicationNo: applicationNumber,
      };
    }

    return {
      success: false,
      error: 'Unable to verify application generation. Please call 9153336315 for immediate verification.',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unhandled submitAdmissionApplication error:', message);
    return {
      success: false,
      error: 'A network communication error occurred. Please contact the school admissions helpline directly at 9153336315.',
    };
  }
}

/**
 * Server Action: Securely query live admissions applications for verified administrators only
 */
export async function getAdminAdmissionsApplications() {
  try {
    const { profile } = await requireAdmin();
    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.', data: [] };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('admissions_applications')
      .select(`
        id,
        application_no,
        candidate_first_name,
        candidate_last_name,
        applied_class_id,
        date_of_birth,
        gender,
        guardian_name,
        guardian_phone,
        guardian_email,
        residential_address,
        previous_school,
        stage,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin admissions:', error);
      return { success: false, error: error.message, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return { success: false, error: message, data: [] };
  }
}

/**
 * Server Action: Update admission workflow stage for verified administrators only
 */
export async function updateAdminAdmissionStage(
  applicationId: string,
  newStage: AdmissionStage,
  newStatus?: AdmissionStatus
) {
  try {
    const { profile } = await requireAdmin();
    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Administrator access required.' };
    }

    const supabase = await createClient();
    const updatePayload: { stage: AdmissionStage; status?: AdmissionStatus; updated_at: string } = {
      stage: newStage,
      updated_at: new Date().toISOString(),
    };
    if (newStatus) {
      updatePayload.status = newStatus;
    }

    const { error } = await supabase
      .from('admissions_applications')
      .update(updatePayload)
      .eq('id', applicationId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating stage';
    return { success: false, error: message };
  }
}
