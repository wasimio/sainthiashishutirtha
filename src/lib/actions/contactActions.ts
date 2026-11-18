'use server';

import { headers } from 'next/headers';
import { getAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/services/rateLimiter';

export interface ContactSubmissionPayload {
  parentName: string;
  phone: string;
  email?: string;
  classInterest: string;
  message: string;
  website_hp?: string; // Honeypot field
}

export interface ContactSubmissionResult {
  success: boolean;
  referenceNo?: string;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

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
    // Graceful fallback
  }
  return '127.0.0.1';
}

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
 * Server Action: Process and persist public contact inquiries
 */
export async function submitContactInquiry(
  payload: ContactSubmissionPayload
): Promise<ContactSubmissionResult> {
  // 1. Honeypot check (Silent drop if bot filled out hidden field)
  if (payload.website_hp && payload.website_hp.trim().length > 0) {
    return {
      success: true,
      referenceNo: `ENQ-${new Date().getFullYear()}-09999`,
      message: 'Thank you! Your enquiry has been received.',
    };
  }

  // 2. Real in-memory IP sliding-window rate limiting
  const clientIp = await getClientIp();
  const rateLimit = checkRateLimit(`contact:${clientIp}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many inquiries sent from this connection. Please try again in ${rateLimit.retryAfterSeconds} seconds or call our office at 9153336315.`,
    };
  }

  // 3. Server-side validation
  const fieldErrors: Record<string, string> = {};

  const trimmedParent = (payload.parentName || '').trim();
  if (trimmedParent.length < 2) {
    fieldErrors.parentName = 'Parent / Guardian name must be at least 2 characters.';
  } else if (trimmedParent.length > 120) {
    fieldErrors.parentName = 'Parent / Guardian name must not exceed 120 characters.';
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

  const classInterest = (payload.classInterest || '').trim() || 'Kindergarten (KG)';
  if (classInterest.length > 60) {
    fieldErrors.classInterest = 'Class of interest must not exceed 60 characters.';
  }

  const rawMessage = (payload.message || '').trim();
  let safeMessage = rawMessage;
  if (rawMessage.length > 0 && rawMessage.length < 5) {
    fieldErrors.message = 'Please provide a brief message of at least 5 characters.';
  } else if (rawMessage.length > 3000) {
    fieldErrors.message = 'Message must not exceed 3000 characters.';
  } else if (!rawMessage) {
    safeMessage = `General enquiry and campus visit request for ${classInterest}.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
      error: 'Please correct the highlighted fields and submit again.',
    };
  }

  // 4. Database Insertion via Server-Only Privileged Client (service_role)
  try {
    const supabaseAdmin = getAdminClient();

    // 4a. Duplicate submission protection: check for recent duplicate within 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const { data: recentDup } = await supabaseAdmin
      .from('contact_inquiries')
      .select('reference_no')
      .eq('phone', validPhone!)
      .eq('parent_name', trimmedParent)
      .gte('created_at', thirtySecondsAgo)
      .limit(1)
      .maybeSingle();

    if (recentDup?.reference_no) {
      return {
        success: true,
        referenceNo: recentDup.reference_no,
        message: 'Your enquiry has been successfully recorded. Our academic counselor will call you within 24 working hours.',
      };
    }

    // 4b. Generate unique reference number satisfying NOT NULL UNIQUE constraint
    const year = new Date().getFullYear();
    const timeDigits = Date.now().toString().slice(-4);
    const randDigits = Math.floor(10 + Math.random() * 90);
    const referenceNo = `ENQ-${year}-${timeDigits}${randDigits}`;
    const subject = `Admission Inquiry - ${classInterest}`;

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('contact_inquiries')
      .insert({
        reference_no: referenceNo,
        parent_name: trimmedParent,
        phone: validPhone!,
        email: trimmedEmail || null,
        subject: subject,
        class_interest: classInterest,
        message: safeMessage,
        status: 'New',
      })
      .select('id, reference_no, created_at')
      .single();

    if (insertError) {
      console.error('contact_inquiries insert error:', insertError.message);
      return {
        success: false,
        error: 'We could not record your enquiry right now. Please call our administrative office directly at 9153336315 or 8926769992.',
      };
    }

    return {
      success: true,
      referenceNo: inserted?.reference_no || referenceNo,
      message: 'Your enquiry has been successfully recorded. Our academic counselor will call you within 24 working hours.',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unhandled submitContactInquiry error:', message);
    return {
      success: false,
      error: 'A communication error occurred. Please contact the school office directly at 9153336315.',
    };
  }
}
