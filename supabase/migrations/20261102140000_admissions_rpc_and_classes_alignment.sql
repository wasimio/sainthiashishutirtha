-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA — ADMISSIONS RPC & CLASSES ALIGNMENT
-- Migration: 20261102140000_admissions_rpc_and_classes_alignment.sql
-- Description: Minimal idempotent migration to provision submit_admission_enquiry
--              RPC and ensure all 8 school grade tiers exist in public.classes.
--
-- NOTE: DO NOT APPLY TO REMOTE SUPABASE WITHOUT EXPLICIT OPERATOR APPROVAL.
--       The application layer gracefully supports the baseline schema via direct
--       service_role table insertion and active database triggers.
-- ==============================================================================

-- 1. Align Classes (Lower Nursery through Class V) idempotently
UPDATE public.classes
SET name = 'Class I',
    code = 'CLS-1',
    display_order = 4,
    wing = 'Junior Primary'
WHERE code = 'CLS-1';

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

-- 2. Atomic Public Admissions Intake RPC Function
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
  -- Validate Foreign Keys
  IF NOT EXISTS (SELECT 1 FROM public.academic_years WHERE id = p_academic_year_id) THEN
    RAISE EXCEPTION 'Invalid academic_year_id: specified academic session does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = p_applied_class_id) THEN
    RAISE EXCEPTION 'Invalid applied_class_id: specified grade tier does not exist';
  END IF;

  -- Validate Text Boundaries
  IF TRIM(COALESCE(p_candidate_first_name, '')) = '' OR char_length(TRIM(p_candidate_first_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate first name is required (max 60 characters)';
  END IF;

  IF TRIM(COALESCE(p_candidate_last_name, '')) = '' OR char_length(TRIM(p_candidate_last_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate last name is required (max 60 characters)';
  END IF;

  -- Validate Date of Birth (between 2 and 18 years old)
  IF p_date_of_birth IS NULL
     OR p_date_of_birth > (current_date - interval '2 years')
     OR p_date_of_birth < (current_date - interval '18 years') THEN
    RAISE EXCEPTION 'Invalid date_of_birth: candidate must be between 2 and 18 years of age';
  END IF;

  -- Validate Gender
  IF p_gender NOT IN ('Male', 'Female', 'Other') THEN
    RAISE EXCEPTION 'Invalid gender: must be Male, Female, or Other';
  END IF;

  -- Validate Guardian Phone (10-digit Indian mobile)
  IF NOT (TRIM(COALESCE(p_guardian_phone, '')) ~ '^[6-9][0-9]{9}$') THEN
    RAISE EXCEPTION 'Invalid guardian phone: must be a 10-digit Indian mobile number';
  END IF;

  -- Validate Email
  IF p_guardian_email IS NOT NULL AND TRIM(p_guardian_email) <> '' THEN
    IF char_length(TRIM(p_guardian_email)) > 254 OR NOT (TRIM(p_guardian_email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
      RAISE EXCEPTION 'Invalid guardian email format';
    END IF;
  END IF;

  -- Insert record (trigger generates application_no)
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

  RETURN jsonb_build_object(
    'success', true,
    'application_no', v_app_no
  );
END;
$$;

-- Secure execution permissions: service_role only
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM anon;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM authenticated;
GRANT EXECUTE ON FUNCTION public.submit_admission_enquiry TO service_role;
