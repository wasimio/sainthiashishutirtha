-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000003_academics_and_attendance.sql
-- Description: Teacher allocations, attendance, homework, assessments, marks, and remarks
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Teacher Allocations (Staff assigned to Sections and Subjects)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teacher_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES public.staff_profiles(profile_id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'Subject Teacher' CHECK (role IN ('Subject Teacher', 'Co-Teacher', 'Assistant')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_teacher_allocation UNIQUE (staff_id, section_id, subject_id, academic_year_id),
  CONSTRAINT fk_allocations_section_year FOREIGN KEY (section_id, academic_year_id) REFERENCES public.sections(id, academic_year_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_allocations_staff ON public.teacher_allocations(staff_id);
CREATE INDEX IF NOT EXISTS idx_allocations_section ON public.teacher_allocations(section_id);
CREATE INDEX IF NOT EXISTS idx_allocations_subject ON public.teacher_allocations(subject_id);

-- ------------------------------------------------------------------------------
-- 2. Teacher Authorization Helper Functions
-- ------------------------------------------------------------------------------

-- Returns true if current authenticated user is class teacher or subject teacher for the section
CREATE OR REPLACE FUNCTION public.is_teacher_of_section(target_section_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sections s
    WHERE s.id = target_section_id AND s.class_teacher_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.teacher_allocations ta
    WHERE ta.section_id = target_section_id AND ta.staff_id = auth.uid()
  );
$$;

-- Returns true if current authenticated user teaches a section where student is actively enrolled
CREATE OR REPLACE FUNCTION public.is_teacher_of_student(target_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.student_enrollments se
    WHERE se.student_id = target_student_id
      AND se.status = 'active'
      AND public.is_teacher_of_section(se.section_id)
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. Attendance Sessions & Records
-- Unique constraint enforces exactly one register per section per date
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  session_date date NOT NULL DEFAULT current_date,
  marked_by uuid NOT NULL REFERENCES public.staff_profiles(profile_id),
  marked_at timestamptz NOT NULL DEFAULT now(),
  is_locked boolean NOT NULL DEFAULT false,
  locked_at timestamptz,
  locked_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_section_session_date UNIQUE (section_id, session_date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_sessions_section_date ON public.attendance_sessions(section_id, session_date DESC);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_session_student_attendance UNIQUE (session_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_session ON public.attendance_records(session_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_student ON public.attendance_records(student_id);

-- ------------------------------------------------------------------------------
-- 4. Homework & Diary
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.staff_profiles(profile_id),
  title text NOT NULL,
  instructions text NOT NULL,
  assigned_date date NOT NULL DEFAULT current_date,
  due_date date NOT NULL,
  attachment_path text,
  status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Review Completed', 'Archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_homework_due_date CHECK (due_date >= assigned_date)
);

CREATE INDEX IF NOT EXISTS idx_homework_section_due ON public.homework(section_id, due_date DESC);
CREATE INDEX IF NOT EXISTS idx_homework_subject ON public.homework(subject_id);

CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid NOT NULL REFERENCES public.homework(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  parent_acknowledgement boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  teacher_feedback text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_homework_student UNIQUE (homework_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_homework_submissions_hw ON public.homework_submissions(homework_id);
CREATE INDEX IF NOT EXISTS idx_homework_submissions_student ON public.homework_submissions(student_id);

-- ------------------------------------------------------------------------------
-- 5. Assessments & Assessment Marks
-- Unique constraint enforces single mark entry per student per assessment
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL REFERENCES public.staff_profiles(profile_id),
  term text NOT NULL,
  name text NOT NULL,
  assessment_date date,
  max_marks numeric(5, 2) NOT NULL CHECK (max_marks > 0),
  pass_marks numeric(5, 2) NOT NULL CHECK (pass_marks >= 0 AND pass_marks <= max_marks),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  published_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_assessments_section_year FOREIGN KEY (section_id, academic_year_id) REFERENCES public.sections(id, academic_year_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assessments_section_term ON public.assessments(section_id, term);
CREATE INDEX IF NOT EXISTS idx_assessments_published ON public.assessments(is_published);

CREATE TABLE IF NOT EXISTS public.assessment_marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained numeric(5, 2) NOT NULL CHECK (marks_obtained >= 0),
  grade_letter text NOT NULL CHECK (grade_letter IN ('A+', 'A', 'B+', 'B', 'C', 'D', 'E')),
  teacher_remarks text,
  entered_by uuid NOT NULL REFERENCES public.staff_profiles(profile_id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_assessment_student_mark UNIQUE (assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_marks_assessment ON public.assessment_marks(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_marks_student ON public.assessment_marks(student_id);

-- ------------------------------------------------------------------------------
-- 6. Report Cards (Terminal Cumulative Evaluation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.report_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  term text NOT NULL,
  headmaster_remarks text,
  attendance_percentage numeric(5, 2) CHECK (attendance_percentage >= 0 AND attendance_percentage <= 100),
  overall_grade text,
  promotion_status text DEFAULT 'Eligible' CHECK (promotion_status IN ('Eligible', 'Promoted', 'Retained', 'Under Review')),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  published_by uuid REFERENCES public.profiles(id),
  pdf_storage_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_report_card_student_year_term UNIQUE (student_id, academic_year_id, term)
);

CREATE INDEX IF NOT EXISTS idx_report_cards_student ON public.report_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_published ON public.report_cards(is_published);

-- ------------------------------------------------------------------------------
-- 7. Student Remarks & Diary Observations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_remarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES public.staff_profiles(profile_id),
  category text NOT NULL CHECK (category IN ('Academic', 'Behavioral', 'Appreciation', 'Attendance')),
  visibility text NOT NULL DEFAULT 'Both' CHECK (visibility IN ('Parents Only', 'Internal Faculty', 'Both')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_remarks_student ON public.student_remarks(student_id);
CREATE INDEX IF NOT EXISTS idx_student_remarks_visibility ON public.student_remarks(visibility);

-- ------------------------------------------------------------------------------
-- 8. Absence Requests (Parent Leave Applications)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.absence_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  days_count integer NOT NULL CHECK (days_count > 0),
  reason_category text NOT NULL CHECK (reason_category IN ('Medical / Sickness', 'Family Function', 'Emergency', 'Travel')),
  reason_text text NOT NULL,
  attachment_path text,
  status text NOT NULL DEFAULT 'Under Review' CHECK (status IN ('Under Review', 'Approved', 'Rejected')),
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_absence_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_absence_requests_student ON public.absence_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_absence_requests_guardian ON public.absence_requests(guardian_id);
CREATE INDEX IF NOT EXISTS idx_absence_requests_status ON public.absence_requests(status);

-- ------------------------------------------------------------------------------
-- 9. Student Enrollment Cross-Check Triggers
-- Prevents logging attendance or marks for students not enrolled in the cohort
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_attendance_enrollment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_session_section_id uuid;
BEGIN
  SELECT section_id INTO v_session_section_id
  FROM public.attendance_sessions
  WHERE id = NEW.session_id;

  IF NOT EXISTS (
    SELECT 1 FROM public.student_enrollments
    WHERE student_id = NEW.student_id
      AND section_id = v_session_section_id
      AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Academic integrity violation: Student % is not actively enrolled in the section for attendance session %.', NEW.student_id, NEW.session_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_attendance_enrollment ON public.attendance_records;
CREATE TRIGGER trg_check_attendance_enrollment
  BEFORE INSERT OR UPDATE ON public.attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION public.check_attendance_enrollment();

CREATE OR REPLACE FUNCTION public.check_assessment_mark_enrollment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_assessment_section_id uuid;
BEGIN
  SELECT section_id INTO v_assessment_section_id
  FROM public.assessments
  WHERE id = NEW.assessment_id;

  IF NOT EXISTS (
    SELECT 1 FROM public.student_enrollments
    WHERE student_id = NEW.student_id
      AND section_id = v_assessment_section_id
      AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Academic integrity violation: Student % is not enrolled in the section for assessment %.', NEW.student_id, NEW.assessment_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_assessment_mark_enrollment ON public.assessment_marks;
CREATE TRIGGER trg_check_assessment_mark_enrollment
  BEFORE INSERT OR UPDATE ON public.assessment_marks
  FOR EACH ROW
  EXECUTE FUNCTION public.check_assessment_mark_enrollment();
