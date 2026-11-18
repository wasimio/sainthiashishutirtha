'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/authorization';

export interface CmsDashboardTelemetry {
  notices: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  admissions: {
    total: number;
    pendingReview: number;
    applied: number;
    approved: number;
  };
  contactInquiries: {
    total: number;
    newCount: number;
    resolvedCount: number;
    tableReady: boolean;
  };
  schoolSettings: {
    isConfigured: boolean;
    schoolName: string;
    udiseCode: string;
    campusAddress: string;
    officialPhone: string;
    officialEmail: string;
  };
}

export interface CmsDashboardResult {
  success: boolean;
  data?: CmsDashboardTelemetry;
  error?: string;
}

/**
 * Server Action: Queries authoritative, real-time telemetry for the Website CMS and Public Intake.
 * Protected by requireAdmin() - only authorized administrators may invoke this action.
 */
export async function getCmsDashboardTelemetry(): Promise<CmsDashboardResult> {
  try {
    const { profile } = await requireAdmin();
    if (!profile || profile.role !== 'admin') {
      return {
        success: false,
        error: 'Unauthorized: Administrative role required to access CMS telemetry.',
      };
    }

    const supabase = await createClient();

    // 1. Query Notices counts
    let notices = { total: 0, published: 0, draft: 0, archived: 0 };
    try {
      const { data: noticeRows, error: noticeErr } = await supabase
        .from('notices')
        .select('status');

      if (!noticeErr && noticeRows) {
        notices = {
          total: noticeRows.length,
          published: noticeRows.filter((r) => r.status === 'Published').length,
          draft: noticeRows.filter((r) => r.status === 'Draft').length,
          archived: noticeRows.filter((r) => r.status === 'Archived').length,
        };
      }
    } catch (err) {
      console.warn('Notice count query error:', err);
    }

    // 2. Query Admissions Applications counts
    let admissions = { total: 0, pendingReview: 0, applied: 0, approved: 0 };
    try {
      const { data: admRows, error: admErr } = await supabase
        .from('admissions_applications')
        .select('status, stage');

      if (!admErr && admRows) {
        admissions = {
          total: admRows.length,
          pendingReview: admRows.filter((r) => r.status === 'Pending Review').length,
          applied: admRows.filter((r) => r.stage === 'Applied').length,
          approved: admRows.filter((r) => r.status === 'Approved').length,
        };
      }
    } catch (err) {
      console.warn('Admissions count query error:', err);
    }

    // 3. Query Contact Inquiries counts (safely isolated if remote migration is pending)
    let contactInquiries = { total: 0, newCount: 0, resolvedCount: 0, tableReady: false };
    try {
      const { data: contactRows, error: contactErr } = await supabase
        .from('contact_inquiries')
        .select('status');

      if (!contactErr && contactRows) {
        contactInquiries = {
          total: contactRows.length,
          newCount: contactRows.filter((r) => r.status === 'New').length,
          resolvedCount: contactRows.filter((r) => r.status === 'Resolved').length,
          tableReady: true,
        };
      } else if (contactErr && contactErr.code === '42P01') {
        // Table undefined in current database (pending remote migration)
        contactInquiries.tableReady = false;
      }
    } catch {
      contactInquiries.tableReady = false;
    }

    // 4. Query School Master Settings
    let schoolSettings = {
      isConfigured: false,
      schoolName: 'Sainthia Shishutirtha',
      udiseCode: '19082200103',
      campusAddress: 'Sainthia, Birbhum, West Bengal 731234',
      officialPhone: '+91 94340 55120',
      officialEmail: 'contact@shishutirtha.org',
    };
    try {
      const { data: settingsRow, error: settingsErr } = await supabase
        .from('school_settings')
        .select('school_name, udise_code, campus_address, official_phone, official_email')
        .eq('id', 'primary_config')
        .maybeSingle();

      if (!settingsErr && settingsRow) {
        schoolSettings = {
          isConfigured: true,
          schoolName: settingsRow.school_name || 'Sainthia Shishutirtha',
          udiseCode: settingsRow.udise_code || '19082200103',
          campusAddress: settingsRow.campus_address || 'Sainthia, Birbhum, West Bengal 731234',
          officialPhone: settingsRow.official_phone || '+91 94340 55120',
          officialEmail: settingsRow.official_email || 'contact@shishutirtha.org',
        };
      }
    } catch (err) {
      console.warn('School settings query error:', err);
    }

    return {
      success: true,
      data: {
        notices,
        admissions,
        contactInquiries,
        schoolSettings,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unauthorized';
    return {
      success: false,
      error: message,
    };
  }
}
