-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261029000001_public_admissions_and_contact_intake.sql
-- Description: Phase 1 public website admissions and contact intake integration.
--              1. Create public.contact_inquiries table with boundary checks, strict RLS,
--                 and column-level INSERT privileges (administrative fields withheld from anon).
--              2. Align public.classes with 8 verified school tiers (Lower Nursery to Class V)
--                 with strict precondition assertion verifying exactly 1 Class 1 record
--                 (UUID: 58c9e01e-f6cc-4bc0-9d93-277d50b9935b) to preserve section linkages.
--              3. Harden handle_admissions_application_insert with SECURITY DEFINER and fixed search_path.
--              4. Audit and revoke unnecessary table/sequence privileges from both PUBLIC and anon.
--              5. Add hardened public.submit_admission_enquiry RPC returning strictly application_no
--                 (omitting internal UUID) with full database-boundary validation (age 2 to 18 years).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Contact Inquiries Table with Database-Level Boundary Constraints & Strict RLS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL CHECK (char_length(trim(parent_name)) >= 2 AND char_length(trim(parent_name)) <= 100),
  phone text NOT NULL CHECK (trim(phone) ~ '^[6-9][0-9]{9}$'),
  email text CHECK (email IS NULL OR (char_length(trim(email)) <= 254 AND trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  class_interest text CHECK (class_interest IS NULL OR char_length(trim(class_interest)) <= 60),
  message text CHECK (message IS NULL OR char_length(trim(message)) <= 2000),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);

-- Enable Row Level Security on contact_inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert inquiries with initial status 'New'
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
  ON public.contact_inquiries FOR INSERT TO public
  WITH CHECK (status = 'New');

-- Policy: Admin has full access to view, update, and manage inquiries
DROP POLICY IF EXISTS "Admin full access on contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin full access on contact inquiries"
  ON public.contact_inquiries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Privilege Audit and Grant Strategy for contact_inquiries:
-- Explicitly revoke all privileges from PUBLIC, anon, and authenticated to reset inheritance
REVOKE ALL ON TABLE public.contact_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.contact_inquiries FROM authenticated;

-- Anonymous callers (anon) have ZERO direct table privileges.
-- Public intake is strictly mediated by protected Next.js Server Actions using service_role.
GRANT INSERT (parent_name, phone, email, class_interest, message)
  ON TABLE public.contact_inquiries TO service_role;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- Authenticated users (admin staff) have full table access (mediated by RLS public.is_admin())
GRANT ALL ON TABLE public.contact_inquiries TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Align Classes (Lower Nursery through Class V) with Precondition Integrity
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_matching_count integer;
  v_class_id uuid := '58c9e01e-f6cc-4bc0-9d93-277d50b9935b'::uuid;
BEGIN
  -- 1. Precondition check: verify that exactly one target record exists matching the UUID or code
  SELECT COUNT(*) INTO v_matching_count
  FROM public.classes
  WHERE id = v_class_id OR code = 'CLS-1';

  IF v_matching_count <> 1 THEN
    RAISE EXCEPTION 'Migration precondition failed: Expected exactly 1 Class 1 record with id % or code CLS-1, but found %',
      v_class_id, v_matching_count;
  END IF;

  -- 2. In-place update: preserve UUID (58c9e01e-f6cc-4bc0-9d93-277d50b9935b) and section foreign keys
  UPDATE public.classes
  SET name = 'Class I',
      code = 'CLS-1',
      display_order = 4,
      wing = 'Junior Primary'
  WHERE id = v_class_id;

  -- 3. Verify exactly one row was updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Migration update failed: Target Class 1 record % could not be updated', v_class_id;
  END IF;
END $$;

-- Seed the remaining 7 verified classes idempotently
INSERT INTO public.classes (name, code, wing, display_order)
VALUES
  ('Lower Nursery', 'LN', 'Early Childhood', 1),
  ('U.N.', 'UN', 'Early Childhood', 2),
  ('KG', 'KG', 'Pre-Primary', 3),
  ('Class II', 'CLS-2', 'Junior Primary', 5),
  ('Class III', 'CLS-3', 'Senior Primary', 6),
  ('Class IV', 'CLS-4', 'Senior Primary', 7),
  ('Class V', 'CLS-5', 'Senior Primary', 8)
ON CONFLICT (code) DO UPDATE
  SET name = EXCLUDED.name,
      wing = EXCLUDED.wing,
      display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- 3. Harden Admissions Trigger Function & Revoke Unnecessary Privileges
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_admissions_application_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Auto-generate official sequential application number if missing
  IF NEW.application_no IS NULL OR TRIM(NEW.application_no) = '' THEN
    NEW.application_no := 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.admissions_app_seq')::text, 5, '0');
  END IF;

  -- If not an administrator, strictly enforce public applicant constraints
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

-- Ensure trigger is active and bound to the hardened function
DROP TRIGGER IF EXISTS trg_handle_admissions_application_insert ON public.admissions_applications;
CREATE TRIGGER trg_handle_admissions_application_insert
  BEFORE INSERT ON public.admissions_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admissions_application_insert();

-- Comprehensive Privilege Audit and Revocation:
-- Explicitly revoke all table, sequence, and trigger function access from PUBLIC and anon.
-- Anonymous intake is strictly mediated by the SECURITY DEFINER RPC public.submit_admission_enquiry().
REVOKE ALL ON TABLE public.admissions_applications FROM PUBLIC;
REVOKE ALL ON TABLE public.admissions_applications FROM anon;

REVOKE ALL ON SEQUENCE public.admissions_app_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE public.admissions_app_seq FROM anon;

REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM anon;

-- Grant permissions strictly to authenticated users (e.g. staff/admin portals via RLS) and service_role
GRANT ALL ON TABLE public.admissions_applications TO authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.admissions_app_seq TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_admissions_application_insert() TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 4. Atomic Public Admissions Intake RPC Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_admission_enquiry(
  p_academic_year_id uuid,
  p_applied_class_id uuid,
  p_candidate_first_name text,
  p_candidate_last_name text,
  p_date_of_birth date,
  p_gender text,
  p_guardian_name text,
  p_guardian_phone text,
  p_guardian_email text DEFAULT NULL,
  p_residential_address text DEFAULT 'Sainthia',
  p_previous_school text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_app_no text;
BEGIN
  -- 1. Validate Foreign Keys at Database Boundary
  IF NOT EXISTS (SELECT 1 FROM public.academic_years WHERE id = p_academic_year_id) THEN
    RAISE EXCEPTION 'Invalid academic_year_id: specified academic session does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = p_applied_class_id) THEN
    RAISE EXCEPTION 'Invalid applied_class_id: specified grade tier does not exist';
  END IF;

  -- 2. Validate Candidate Details & Text Lengths
  IF TRIM(COALESCE(p_candidate_first_name, '')) = '' OR char_length(TRIM(p_candidate_first_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate first name is required (max 60 characters)';
  END IF;

  IF TRIM(COALESCE(p_candidate_last_name, '')) = '' OR char_length(TRIM(p_candidate_last_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate last name is required (max 60 characters)';
  END IF;

  -- 3. Validate Date of Birth: enforce both minimum (2 years) and maximum (18 years) age boundaries
  -- Candidate must not be born in the future, must be at least 2 years old (earliest Lower Nursery threshold),
  -- and must be at most 18 years of age.
  IF p_date_of_birth IS NULL
     OR p_date_of_birth > (current_date - interval '2 years')
     OR p_date_of_birth < (current_date - interval '18 years') THEN
    RAISE EXCEPTION 'Invalid date_of_birth: candidate must be between 2 and 18 years of age';
  END IF;

  -- 4. Validate Gender Constraint
  IF p_gender NOT IN ('Male', 'Female', 'Other') THEN
    RAISE EXCEPTION 'Invalid gender: must be Male, Female, or Other';
  END IF;

  -- 5. Validate Guardian Details & Phone Format
  IF TRIM(COALESCE(p_guardian_name, '')) = '' OR char_length(TRIM(p_guardian_name)) < 2 OR char_length(TRIM(p_guardian_name)) > 100 THEN
    RAISE EXCEPTION 'Guardian name is required (2 to 100 characters)';
  END IF;

  IF NOT (TRIM(COALESCE(p_guardian_phone, '')) ~ '^[6-9][0-9]{9}$') THEN
    RAISE EXCEPTION 'Invalid guardian phone: must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9';
  END IF;

  -- 6. Validate Optional Email
  IF p_guardian_email IS NOT NULL AND TRIM(p_guardian_email) <> '' THEN
    IF char_length(TRIM(p_guardian_email)) > 254 OR NOT (TRIM(p_guardian_email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
      RAISE EXCEPTION 'Invalid guardian email format';
    END IF;
  END IF;

  -- 7. Validate Address and Notes Lengths
  IF char_length(TRIM(COALESCE(p_residential_address, ''))) > 300 THEN
    RAISE EXCEPTION 'Residential address exceeds maximum length of 300 characters';
  END IF;

  IF p_previous_school IS NOT NULL AND char_length(TRIM(p_previous_school)) > 500 THEN
    RAISE EXCEPTION 'Previous school / remarks exceed maximum length of 500 characters';
  END IF;

  -- 8. Insert record under table owner authority (trigger generates application_no)
  INSERT INTO public.admissions_applications (
    academic_year_id,
    applied_class_id,
    candidate_first_name,
    candidate_last_name,
    date_of_birth,
    gender,
    guardian_name,
    guardian_phone,
    guardian_email,
    residential_address,
    previous_school,
    stage,
    status
  ) VALUES (
    p_academic_year_id,
    p_applied_class_id,
    TRIM(p_candidate_first_name),
    TRIM(p_candidate_last_name),
    p_date_of_birth,
    p_gender,
    TRIM(p_guardian_name),
    TRIM(p_guardian_phone),
    NULLIF(TRIM(p_guardian_email), ''),
    COALESCE(NULLIF(TRIM(p_residential_address), ''), 'Sainthia'),
    NULLIF(TRIM(p_previous_school), ''),
    'Applied',
    'Pending Review'
  )
  RETURNING application_no INTO v_app_no;

  -- Return ONLY minimal public data: success and the assigned reference number.
  -- Internal database UUID (id) is strictly NOT returned.
  RETURN jsonb_build_object(
    'success', true,
    'application_no', v_app_no
  );
END;
$$;

-- Revoke all execution rights from PUBLIC, anon, and authenticated.
-- Browser clients cannot directly invoke this RPC via PostgREST.
-- Execution is granted exclusively to service_role for server-mediated intake.
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM anon;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM authenticated;
GRANT EXECUTE ON FUNCTION public.submit_admission_enquiry TO service_role;

-- ==============================================================================
-- ROLLBACK / RECOVERY INSTRUCTIONS (IF NEEDED):
-- ==============================================================================
-- 1. DROP FUNCTION IF EXISTS public.submit_admission_enquiry(uuid, uuid, text, text, date, text, text, text, text, text, text);
-- 2. DROP TABLE IF EXISTS public.contact_inquiries;
-- 3. DELETE FROM public.classes WHERE code IN ('LN', 'UN', 'KG', 'CLS-2', 'CLS-3', 'CLS-4', 'CLS-5');
-- 4. UPDATE public.classes SET name = 'Class 1', display_order = 1 WHERE code = 'CLS-1';
-- NOTE: Never execute DROP TABLE public.classes or DROP TABLE public.admissions_applications.
-- ==============================================================================
