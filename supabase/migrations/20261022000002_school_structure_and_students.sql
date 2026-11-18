-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000002_school_structure_and_students.sql
-- Description: School structure, academic years, classes, students, and family relations
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Academic Years
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_academic_year_dates CHECK (end_date > start_date)
);

-- Ensure only one academic year can be active/current at any time
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_current_academic_year
  ON public.academic_years(is_current)
  WHERE is_current = true;

-- ------------------------------------------------------------------------------
-- 2. Classes (Academic Tiers / Standards)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  wing text NOT NULL CHECK (wing IN ('Early Childhood', 'Pre-Primary', 'Junior Primary', 'Senior Primary')),
  display_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_display_order ON public.classes(display_order);

-- ------------------------------------------------------------------------------
-- 3. Sections (Cohorts within Classes per Academic Year)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  capacity integer NOT NULL DEFAULT 35 CHECK (capacity > 0),
  room_number text,
  class_teacher_id uuid REFERENCES public.staff_profiles(profile_id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_section_class_year_name UNIQUE (class_id, academic_year_id, name),
  CONSTRAINT uq_section_id_academic_year UNIQUE (id, academic_year_id)
);

CREATE INDEX IF NOT EXISTS idx_sections_class_id ON public.sections(class_id);
CREATE INDEX IF NOT EXISTS idx_sections_year_id ON public.sections(academic_year_id);
CREATE INDEX IF NOT EXISTS idx_sections_class_teacher ON public.sections(class_teacher_id);

-- ------------------------------------------------------------------------------
-- 4. Subjects
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subjects_code ON public.subjects(code);

-- ------------------------------------------------------------------------------
-- 5. Students (Scholar Master Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scholar_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth date NOT NULL,
  blood_group text CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  status text NOT NULL DEFAULT 'Enrolled' CHECK (status IN ('Enrolled', 'Under Review', 'TC Issued', 'Alumni', 'Suspended')),
  emergency_contact_phone text,
  medical_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_scholar_id ON public.students(scholar_id);
CREATE INDEX IF NOT EXISTS idx_students_status ON public.students(status);
CREATE INDEX IF NOT EXISTS idx_students_last_first ON public.students(last_name, first_name);

-- ------------------------------------------------------------------------------
-- 6. Student Enrollments (Annual placement of students into sections)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  roll_number integer NOT NULL CHECK (roll_number > 0),
  enrollment_date date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'promoted', 'transferred', 'withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_academic_year UNIQUE (student_id, academic_year_id),
  CONSTRAINT uq_section_roll_number UNIQUE (section_id, roll_number),
  CONSTRAINT fk_enrollment_section_year FOREIGN KEY (section_id, academic_year_id) REFERENCES public.sections(id, academic_year_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON public.student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_section ON public.student_enrollments(section_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_year ON public.student_enrollments(academic_year_id);

-- ------------------------------------------------------------------------------
-- 7. Student Guardians (Many-to-Many Sibling & Guardian Linkage)
-- Supports multiple guardians per child, and multiple siblings per guardian
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  relationship text NOT NULL CHECK (relationship IN ('Father', 'Mother', 'Legal Guardian', 'Grandparent', 'Other')),
  is_primary boolean NOT NULL DEFAULT true,
  can_pickup boolean NOT NULL DEFAULT true,
  is_emergency_contact boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_student_guardian UNIQUE (student_id, guardian_id)
);

CREATE INDEX IF NOT EXISTS idx_student_guardians_student ON public.student_guardians(student_id);
CREATE INDEX IF NOT EXISTS idx_student_guardians_guardian ON public.student_guardians(guardian_id);

-- ------------------------------------------------------------------------------
-- 8. Authorization Helper Functions for Row-Level Security
-- ------------------------------------------------------------------------------

-- Returns true if current authenticated user is a verified guardian of the target student
CREATE OR REPLACE FUNCTION public.is_guardian_of(target_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_guardians sg
    JOIN public.guardians g ON g.id = sg.guardian_id
    WHERE sg.student_id = target_student_id
      AND g.profile_id = auth.uid()
      AND g.verification_status = 'verified'
  );
$$;

-- Returns list of student IDs linked to current authenticated parent
CREATE OR REPLACE FUNCTION public.get_my_guardian_children_ids()
RETURNS TABLE (student_id uuid)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sg.student_id
  FROM public.student_guardians sg
  JOIN public.guardians g ON g.id = sg.guardian_id
  WHERE g.profile_id = auth.uid()
    AND g.verification_status = 'verified';
$$;
