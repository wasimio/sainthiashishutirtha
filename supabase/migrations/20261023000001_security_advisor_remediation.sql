-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261023000001_security_advisor_remediation.sql
-- Description: Fix Supabase Security Advisor findings:
-- 1. Explicit search_path configuration on all 8 unconfigured functions.
-- 2. Principle of Least Privilege: Revoke execution of trigger functions from client roles.
-- 3. Restrict RLS helper functions to authenticated role; revoke from PUBLIC and anon.
-- 4. Preserve try_cast_uuid() execution for anon/authenticated storage policy evaluation.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Utility Function: try_cast_uuid
-- Immutable, empty search_path, executable by anon and authenticated for storage policies
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.try_cast_uuid(val text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF val IS NULL OR val !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN NULL;
  END IF;
  RETURN val::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.try_cast_uuid(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.try_cast_uuid(text) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. Internal Trigger-Only Functions
-- Revoke execution from all client roles (anon, authenticated, PUBLIC).
-- These functions are executed exclusively via triggers under table owner context.
-- ------------------------------------------------------------------------------

-- 2a. Audit Log Immutability
CREATE OR REPLACE FUNCTION public.protect_audit_log_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'Audit trail violation: audit_logs is append-only and existing records cannot be modified or deleted.';
END;
$$;

REVOKE ALL ON FUNCTION public.protect_audit_log_immutability() FROM PUBLIC, anon, authenticated;

-- 2b. Attendance Enrollment Verification
CREATE OR REPLACE FUNCTION public.check_attendance_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.attendance_sessions s ON s.id = NEW.session_id
    WHERE se.student_id = NEW.student_id
      AND se.section_id = s.section_id
      AND se.academic_year_id = s.academic_year_id
      AND se.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Enrollment violation: student is not actively enrolled in the session section.';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.check_attendance_enrollment() FROM PUBLIC, anon, authenticated;

-- 2c. Assessment Mark Enrollment Verification
CREATE OR REPLACE FUNCTION public.check_assessment_mark_enrollment()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.assessments a ON a.id = NEW.assessment_id
    WHERE se.student_id = NEW.student_id
      AND se.section_id = a.section_id
      AND se.academic_year_id = a.academic_year_id
      AND se.status = 'active'
  ) THEN
    RAISE EXCEPTION 'Enrollment violation: student is not actively enrolled in the assessment section.';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.check_assessment_mark_enrollment() FROM PUBLIC, anon, authenticated;

-- 2d. Payment Receipt Immutability
CREATE OR REPLACE FUNCTION public.protect_receipt_immutability()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.receipt_no IS DISTINCT FROM NEW.receipt_no THEN
    RAISE EXCEPTION 'Receipt immutability violation: receipt number cannot be altered once issued.';
  END IF;
  IF OLD.amount IS DISTINCT FROM NEW.amount THEN
    RAISE EXCEPTION 'Financial integrity violation: payment amount cannot be modified. Issue an adjustment or refund.';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_receipt_immutability() FROM PUBLIC, anon, authenticated;

-- 2e. Payment Deletion Prohibition
CREATE OR REPLACE FUNCTION public.protect_payment_deletion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'Financial audit violation: payment records cannot be deleted. Use financial adjustments to record reversals.';
END;
$$;

REVOKE ALL ON FUNCTION public.protect_payment_deletion() FROM PUBLIC, anon, authenticated;

-- 2f. Invoice Payment Allocation Balance & Status Sync
CREATE OR REPLACE FUNCTION public.sync_invoice_payment_allocation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_allocated_total numeric(10, 2);
  v_payment_amount numeric(10, 2);
  v_invoice_total numeric(10, 2);
  v_invoice_paid numeric(10, 2);
  v_payment_id uuid;
  v_invoice_id uuid;
BEGIN
  v_payment_id := COALESCE(NEW.payment_id, OLD.payment_id);
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT amount INTO v_payment_amount FROM public.payments WHERE id = v_payment_id;
  SELECT COALESCE(SUM(allocated_amount), 0) INTO v_allocated_total
  FROM public.payment_allocations WHERE payment_id = v_payment_id;

  IF v_allocated_total > v_payment_amount THEN
    RAISE EXCEPTION 'Allocation violation: sum of allocations (₹%) exceeds total payment amount (₹%).',
      v_allocated_total, v_payment_amount;
  END IF;

  SELECT total_amount INTO v_invoice_total FROM public.invoices WHERE id = v_invoice_id;
  SELECT COALESCE(SUM(allocated_amount), 0) INTO v_invoice_paid
  FROM public.payment_allocations WHERE invoice_id = v_invoice_id;

  UPDATE public.invoices
  SET
    paid_amount = v_invoice_paid,
    status = CASE
      WHEN v_invoice_paid >= total_amount THEN 'Paid'
      WHEN v_invoice_paid > 0 THEN 'Partially Paid'
      ELSE status
    END,
    updated_at = now()
  WHERE id = v_invoice_id;

  RETURN COALESCE(NEW, OLD);
END;
$$;

REVOKE ALL ON FUNCTION public.sync_invoice_payment_allocation() FROM PUBLIC, anon, authenticated;

-- 2g. Admissions Application Trigger
CREATE OR REPLACE FUNCTION public.handle_admissions_application_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.application_no IS NULL OR TRIM(NEW.application_no) = '' THEN
    NEW.application_no := 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.admissions_app_seq')::text, 5, '0');
  END IF;

  IF NOT public.is_admin() THEN
    IF NEW.stage IS NOT NULL AND NEW.stage <> 'Applied' THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot set stage to %', NEW.stage;
    END IF;
    IF NEW.status IS NOT NULL AND NEW.status <> 'Pending Review' THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot set status to %', NEW.status;
    END IF;
    IF NEW.assigned_reviewer_id IS NOT NULL OR NEW.internal_notes IS NOT NULL THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot assign reviewers or internal notes';
    END IF;

    NEW.stage := 'Applied';
    NEW.status := 'Pending Review';
    NEW.assigned_reviewer_id := NULL;
    NEW.internal_notes := NULL;
  END IF;

  NEW.created_at := now();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM PUBLIC, anon, authenticated;

-- 2h. Profile Role Guard Trigger Function
CREATE OR REPLACE FUNCTION public.guard_profile_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'Immutable identity violation: Profile user ID cannot be changed.';
  END IF;

  IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Privilege escalation violation: only administrators can change account roles or active status.';
    END IF;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.guard_profile_role_update() FROM PUBLIC, anon, authenticated;

-- 2i. Handle New Auth User Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role := 'parent';
  v_name text;
BEGIN
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.profiles (id, role, full_name, email, phone, is_active)
  VALUES (
    NEW.id,
    v_role,
    v_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------------------------------
-- 3. Row-Level Security Authorization Helper Functions
-- Revoke execution from PUBLIC and anon; grant strictly to authenticated role.
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.current_user_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

REVOKE ALL ON FUNCTION public.is_parent() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_parent() TO authenticated;

REVOKE ALL ON FUNCTION public.is_guardian_of(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_guardian_of(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_guardian_children_ids() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_guardian_children_ids() TO authenticated;

REVOKE ALL ON FUNCTION public.is_teacher_of_section(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_section(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_teacher_of_student(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_teacher_of_student(uuid) TO authenticated;
