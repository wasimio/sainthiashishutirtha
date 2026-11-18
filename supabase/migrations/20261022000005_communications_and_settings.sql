-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000005_communications_and_settings.sql
-- Description: Public admissions, official notices, school master settings
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Admissions Applications (Public Portal Submissions & Lifecycle Workflow)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admissions_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_no text UNIQUE NOT NULL,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
  candidate_first_name text NOT NULL,
  candidate_last_name text NOT NULL,
  applied_class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  guardian_name text NOT NULL,
  guardian_phone text NOT NULL,
  guardian_email text,
  residential_address text NOT NULL,
  previous_school text,
  stage text NOT NULL DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Document Verification', 'Parent Interaction', 'Provisional Admission', 'Enrolled', 'Rejected')),
  status text NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Verified', 'Approved', 'Deferred', 'Withdrawn')),
  internal_notes text,
  assigned_reviewer_id uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admissions_application_no ON public.admissions_applications(application_no);
CREATE INDEX IF NOT EXISTS idx_admissions_year_class ON public.admissions_applications(academic_year_id, applied_class_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions_applications(status);
CREATE INDEX IF NOT EXISTS idx_admissions_stage ON public.admissions_applications(stage);

-- Sequence for auto-generating sequential application numbers
CREATE SEQUENCE IF NOT EXISTS public.admissions_app_seq START 1001;

-- Trigger: auto-generate application_no and guard unauthenticated submissions
CREATE OR REPLACE FUNCTION public.handle_admissions_application_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Auto-generate official application number if missing
  IF NEW.application_no IS NULL OR TRIM(NEW.application_no) = '' THEN
    NEW.application_no := 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.admissions_app_seq')::text, 5, '0');
  END IF;

  -- If not an admin, reject forged stage/status or reviewer fields, and enforce defaults
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

DROP TRIGGER IF EXISTS trg_handle_admissions_application_insert ON public.admissions_applications;
CREATE TRIGGER trg_handle_admissions_application_insert
  BEFORE INSERT ON public.admissions_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admissions_application_insert();

-- ------------------------------------------------------------------------------
-- 2. Notices & Circulars (Website CMS & Internal Noticeboard)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  category text NOT NULL CHECK (category IN ('Academic', 'Holiday', 'Admission', 'Circular')),
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES public.profiles(id),
  target_audience text NOT NULL DEFAULT 'All' CHECK (target_audience IN ('All', 'Public', 'Staff Only', 'Parents Only', 'Class Specific')),
  target_class_id uuid REFERENCES public.classes(id),
  is_pinned boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  published_at timestamptz,
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notices_status_published ON public.notices(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_category ON public.notices(category);
CREATE INDEX IF NOT EXISTS idx_notices_pinned ON public.notices(is_pinned);

-- ------------------------------------------------------------------------------
-- 3. School Master Settings (Single-Row Configuration)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_settings (
  id text PRIMARY KEY DEFAULT 'primary_config',
  school_name text NOT NULL DEFAULT 'Sainthia Shishutirtha',
  udise_code text NOT NULL DEFAULT '19082200103',
  campus_address text NOT NULL DEFAULT 'Sainthia, Birbhum, West Bengal 731234',
  official_phone text NOT NULL DEFAULT '+91 94340 55120',
  official_email text NOT NULL DEFAULT 'contact@shishutirtha.org',
  current_academic_year_id uuid REFERENCES public.academic_years(id),
  fee_late_fine_daily numeric(6, 2) DEFAULT 10.00,
  attendance_grace_period_mins integer DEFAULT 15,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES public.profiles(id)
);

-- Seed initial single configuration row if missing
INSERT INTO public.school_settings (id, school_name, udise_code)
VALUES ('primary_config', 'Sainthia Shishutirtha', '19082200103')
ON CONFLICT (id) DO NOTHING;
