-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000006_row_level_security_policies.sql
-- Description: Comprehensive Row Level Security (RLS) enablement and explicit policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Enable RLS on every table
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_guardians ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.teacher_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absence_requests ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.fee_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_adjustments ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.admissions_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin has full access to all profiles" ON public.profiles;
CREATE POLICY "Admin has full access to all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile contact details" ON public.profiles;
CREATE POLICY "Users can update own profile contact details"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ------------------------------------------------------------------------------
-- 3. Staff Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on staff profiles" ON public.staff_profiles;
CREATE POLICY "Admin full access on staff profiles"
  ON public.staff_profiles FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public and all users can view staff profiles" ON public.staff_profiles;
CREATE POLICY "Public and all users can view staff profiles"
  ON public.staff_profiles FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Staff can update own profile" ON public.staff_profiles;
CREATE POLICY "Staff can update own profile"
  ON public.staff_profiles FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 4. Guardians & Invitations Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on guardians" ON public.guardians;
CREATE POLICY "Admin full access on guardians"
  ON public.guardians FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view and update own guardian record" ON public.guardians;
CREATE POLICY "Parents can view and update own guardian record"
  ON public.guardians FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Parents can update own guardian contact" ON public.guardians;
CREATE POLICY "Parents can update own guardian contact"
  ON public.guardians FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Admin full access on guardian invitations" ON public.guardian_invitations;
CREATE POLICY "Admin full access on guardian invitations"
  ON public.guardian_invitations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. Audit Logs Policies (Append-only; only Admins read; no deletions)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "System and authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "System and authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. Academic Structure (Academic Years, Classes, Sections, Subjects)
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view academic years" ON public.academic_years;
CREATE POLICY "Public can view academic years"
  ON public.academic_years FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on academic years" ON public.academic_years;
CREATE POLICY "Admin full access on academic years"
  ON public.academic_years FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view classes" ON public.classes;
CREATE POLICY "Public can view classes"
  ON public.classes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on classes" ON public.classes;
CREATE POLICY "Admin full access on classes"
  ON public.classes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view sections" ON public.sections;
CREATE POLICY "Public can view sections"
  ON public.sections FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on sections" ON public.sections;
CREATE POLICY "Admin full access on sections"
  ON public.sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
CREATE POLICY "Public can view subjects"
  ON public.subjects FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on subjects" ON public.subjects;
CREATE POLICY "Admin full access on subjects"
  ON public.subjects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 7. Students, Enrollments, and Student-Guardians
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on students" ON public.students;
CREATE POLICY "Admin full access on students"
  ON public.students FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view students in assigned sections" ON public.students;
CREATE POLICY "Staff can view students in assigned sections"
  ON public.students FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(id));

DROP POLICY IF EXISTS "Parents can view their linked children" ON public.students;
CREATE POLICY "Parents can view their linked children"
  ON public.students FOR SELECT TO authenticated
  USING (public.is_guardian_of(id));

DROP POLICY IF EXISTS "Admin full access on student enrollments" ON public.student_enrollments;
CREATE POLICY "Admin full access on student enrollments"
  ON public.student_enrollments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view enrollments in their sections" ON public.student_enrollments;
CREATE POLICY "Staff can view enrollments in their sections"
  ON public.student_enrollments FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_section(section_id));

DROP POLICY IF EXISTS "Parents can view enrollments for their linked children" ON public.student_enrollments;
CREATE POLICY "Parents can view enrollments for their linked children"
  ON public.student_enrollments FOR SELECT TO authenticated
  USING (public.is_guardian_of(student_id));

DROP POLICY IF EXISTS "Admin full access on student guardians" ON public.student_guardians;
CREATE POLICY "Admin full access on student guardians"
  ON public.student_guardians FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view their own guardian links" ON public.student_guardians;
CREATE POLICY "Parents can view their own guardian links"
  ON public.student_guardians FOR SELECT TO authenticated
  USING (guardian_id IN (SELECT id FROM public.guardians WHERE profile_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 8. Teacher Allocations
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on teacher allocations" ON public.teacher_allocations;
CREATE POLICY "Admin full access on teacher allocations"
  ON public.teacher_allocations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view teacher allocations" ON public.teacher_allocations;
CREATE POLICY "Staff can view teacher allocations"
  ON public.teacher_allocations FOR SELECT TO authenticated USING (public.is_staff());

-- ------------------------------------------------------------------------------
-- 9. Attendance Sessions & Records
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on attendance sessions" ON public.attendance_sessions;
CREATE POLICY "Admin full access on attendance sessions"
  ON public.attendance_sessions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view attendance sessions for their sections" ON public.attendance_sessions;
CREATE POLICY "Staff can view attendance sessions for their sections"
  ON public.attendance_sessions FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_section(section_id));

DROP POLICY IF EXISTS "Staff can create/edit unlocked attendance sessions for their sections" ON public.attendance_sessions;
CREATE POLICY "Staff can create/edit unlocked attendance sessions for their sections"
  ON public.attendance_sessions FOR INSERT TO authenticated
  WITH CHECK (public.is_staff() AND public.is_teacher_of_section(section_id));

DROP POLICY IF EXISTS "Staff can update unlocked attendance sessions" ON public.attendance_sessions;
CREATE POLICY "Staff can update unlocked attendance sessions"
  ON public.attendance_sessions FOR UPDATE TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_section(section_id) AND NOT is_locked)
  WITH CHECK (public.is_staff() AND public.is_teacher_of_section(section_id) AND NOT is_locked);

DROP POLICY IF EXISTS "Admin full access on attendance records" ON public.attendance_records;
CREATE POLICY "Admin full access on attendance records"
  ON public.attendance_records FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can manage attendance records for assigned students" ON public.attendance_records;
CREATE POLICY "Staff can view attendance records for assigned students"
  ON public.attendance_records FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id));

CREATE POLICY "Staff can insert attendance records for unlocked sessions"
  ON public.attendance_records FOR INSERT TO authenticated
  WITH CHECK (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.is_locked = false
    )
  );

CREATE POLICY "Staff can update attendance records for unlocked sessions"
  ON public.attendance_records FOR UPDATE TO authenticated
  USING (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.is_locked = false
    )
  )
  WITH CHECK (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = session_id AND s.is_locked = false
    )
  );

DROP POLICY IF EXISTS "Parents can view attendance records for their linked children" ON public.attendance_records;
CREATE POLICY "Parents can view attendance records for their linked children"
  ON public.attendance_records FOR SELECT TO authenticated
  USING (public.is_guardian_of(student_id));

-- ------------------------------------------------------------------------------
-- 10. Homework & Submissions
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on homework" ON public.homework;
CREATE POLICY "Admin full access on homework"
  ON public.homework FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can manage homework for their sections" ON public.homework;
CREATE POLICY "Staff can manage homework for their sections"
  ON public.homework FOR ALL TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_section(section_id))
  WITH CHECK (public.is_staff() AND public.is_teacher_of_section(section_id));

DROP POLICY IF EXISTS "Parents can view homework for their child's section" ON public.homework;
CREATE POLICY "Parents can view homework for their child's section"
  ON public.homework FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.student_enrollments se
      WHERE se.section_id = public.homework.section_id
        AND se.status = 'active'
        AND public.is_guardian_of(se.student_id)
    )
  );

DROP POLICY IF EXISTS "Admin full access on homework submissions" ON public.homework_submissions;
CREATE POLICY "Admin full access on homework submissions"
  ON public.homework_submissions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can manage homework submissions for their students" ON public.homework_submissions;
CREATE POLICY "Staff can manage homework submissions for their students"
  ON public.homework_submissions FOR ALL TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id))
  WITH CHECK (public.is_staff() AND public.is_teacher_of_student(student_id));

DROP POLICY IF EXISTS "Parents can view and toggle completion on homework for their linked children" ON public.homework_submissions;
CREATE POLICY "Parents can view and toggle completion on homework for their linked children"
  ON public.homework_submissions FOR ALL TO authenticated
  USING (public.is_guardian_of(student_id))
  WITH CHECK (public.is_guardian_of(student_id));

-- ------------------------------------------------------------------------------
-- 11. Assessments & Assessment Marks
-- Parents can ONLY read published assessments. Non-admins cannot alter marks.
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on assessments" ON public.assessments;
CREATE POLICY "Admin full access on assessments"
  ON public.assessments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view and manage assessments for their sections" ON public.assessments;
CREATE POLICY "Staff can view and manage assessments for their sections"
  ON public.assessments FOR ALL TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_section(section_id))
  WITH CHECK (public.is_staff() AND public.is_teacher_of_section(section_id));

DROP POLICY IF EXISTS "Parents can view published assessments for their child's section" ON public.assessments;
CREATE POLICY "Parents can view published assessments for their child's section"
  ON public.assessments FOR SELECT TO authenticated
  USING (
    is_published = true AND EXISTS (
      SELECT 1 FROM public.student_enrollments se
      WHERE se.section_id = public.assessments.section_id
        AND se.status = 'active'
        AND public.is_guardian_of(se.student_id)
    )
  );

DROP POLICY IF EXISTS "Admin full access on assessment marks" ON public.assessment_marks;
CREATE POLICY "Admin full access on assessment marks"
  ON public.assessment_marks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can enter and edit marks for their students" ON public.assessment_marks;
CREATE POLICY "Staff can view marks for their assigned students"
  ON public.assessment_marks FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id));

CREATE POLICY "Staff can enter marks for unpublished assessments"
  ON public.assessment_marks FOR INSERT TO authenticated
  WITH CHECK (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id AND a.is_published = false
    )
  );

CREATE POLICY "Staff can update marks for unpublished assessments"
  ON public.assessment_marks FOR UPDATE TO authenticated
  USING (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id AND a.is_published = false
    )
  )
  WITH CHECK (
    public.is_staff()
    AND public.is_teacher_of_student(student_id)
    AND EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id AND a.is_published = false
    )
  );

DROP POLICY IF EXISTS "Parents can view published marks for their linked children" ON public.assessment_marks;
CREATE POLICY "Parents can view published marks for their linked children"
  ON public.assessment_marks FOR SELECT TO authenticated
  USING (
    public.is_guardian_of(student_id) AND EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = public.assessment_marks.assessment_id AND a.is_published = true
    )
  );

-- ------------------------------------------------------------------------------
-- 12. Report Cards
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on report cards" ON public.report_cards;
CREATE POLICY "Admin full access on report cards"
  ON public.report_cards FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view report cards for assigned students" ON public.report_cards;
CREATE POLICY "Staff can view report cards for assigned students"
  ON public.report_cards FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id));

DROP POLICY IF EXISTS "Parents can view published report cards for their linked children" ON public.report_cards;
CREATE POLICY "Parents can view published report cards for their linked children"
  ON public.report_cards FOR SELECT TO authenticated
  USING (is_published = true AND public.is_guardian_of(student_id));

-- ------------------------------------------------------------------------------
-- 13. Student Remarks & Absence Requests
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on student remarks" ON public.student_remarks;
CREATE POLICY "Admin full access on student remarks"
  ON public.student_remarks FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can manage student remarks for assigned students" ON public.student_remarks;
CREATE POLICY "Staff can manage student remarks for assigned students"
  ON public.student_remarks FOR ALL TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id))
  WITH CHECK (public.is_staff() AND public.is_teacher_of_student(student_id));

DROP POLICY IF EXISTS "Parents can view non-internal remarks for their linked children" ON public.student_remarks;
CREATE POLICY "Parents can view non-internal remarks for their linked children"
  ON public.student_remarks FOR SELECT TO authenticated
  USING (
    public.is_guardian_of(student_id) AND visibility IN ('Parents Only', 'Both')
  );

DROP POLICY IF EXISTS "Admin full access on absence requests" ON public.absence_requests;
CREATE POLICY "Admin full access on absence requests"
  ON public.absence_requests FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Staff can view absence requests for assigned students" ON public.absence_requests;
CREATE POLICY "Staff can view absence requests for assigned students"
  ON public.absence_requests FOR SELECT TO authenticated
  USING (public.is_staff() AND public.is_teacher_of_student(student_id));

DROP POLICY IF EXISTS "Parents can submit and view absence requests for their linked children" ON public.absence_requests;
CREATE POLICY "Parents can submit and view absence requests for their linked children"
  ON public.absence_requests FOR ALL TO authenticated
  USING (public.is_guardian_of(student_id))
  WITH CHECK (public.is_guardian_of(student_id));

-- ------------------------------------------------------------------------------
-- 14. Finance & Fee Invoices, Payments, and Receipts
-- Strict financial protection: only Admins/Bursars create or alter records
-- Parents have read-only access to their linked children's records
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view fee heads" ON public.fee_heads;
CREATE POLICY "Public can view fee heads" ON public.fee_heads FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on fee heads" ON public.fee_heads;
CREATE POLICY "Admin full access on fee heads"
  ON public.fee_heads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public can view fee structures" ON public.fee_structures;
CREATE POLICY "Public can view fee structures" ON public.fee_structures FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on fee structures" ON public.fee_structures;
CREATE POLICY "Admin full access on fee structures"
  ON public.fee_structures FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin full access on invoices" ON public.invoices;
CREATE POLICY "Admin full access on invoices"
  ON public.invoices FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view invoices for their linked children" ON public.invoices;
CREATE POLICY "Parents can view invoices for their linked children"
  ON public.invoices FOR SELECT TO authenticated
  USING (public.is_guardian_of(student_id));

DROP POLICY IF EXISTS "Admin full access on invoice items" ON public.invoice_items;
CREATE POLICY "Admin full access on invoice items"
  ON public.invoice_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view invoice items for their linked children" ON public.invoice_items;
CREATE POLICY "Parents can view invoice items for their linked children"
  ON public.invoice_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invoices inv
      WHERE inv.id = public.invoice_items.invoice_id AND public.is_guardian_of(inv.student_id)
    )
  );

DROP POLICY IF EXISTS "Admin full access on payments" ON public.payments;
CREATE POLICY "Admin full access on payments"
  ON public.payments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view payment receipts for their linked children" ON public.payments;
CREATE POLICY "Parents can view payment receipts for their linked children"
  ON public.payments FOR SELECT TO authenticated
  USING (public.is_guardian_of(student_id));

DROP POLICY IF EXISTS "Admin full access on payment allocations" ON public.payment_allocations;
CREATE POLICY "Admin full access on payment allocations"
  ON public.payment_allocations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Parents can view payment allocations for their children" ON public.payment_allocations;
CREATE POLICY "Parents can view payment allocations for their children"
  ON public.payment_allocations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.payments p
      WHERE p.id = public.payment_allocations.payment_id AND public.is_guardian_of(p.student_id)
    )
  );

DROP POLICY IF EXISTS "Admin full access on financial adjustments" ON public.financial_adjustments;
CREATE POLICY "Admin full access on financial adjustments"
  ON public.financial_adjustments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 15. Admissions & Public Inquiries
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit admission applications" ON public.admissions_applications;
CREATE POLICY "Public can submit admission applications"
  ON public.admissions_applications FOR INSERT TO public
  WITH CHECK (
    status = 'Pending Review'
    AND stage = 'Applied'
    AND assigned_reviewer_id IS NULL
    AND internal_notes IS NULL
  );

DROP POLICY IF EXISTS "Admin full access on admissions applications" ON public.admissions_applications;
CREATE POLICY "Admin full access on admissions applications"
  ON public.admissions_applications FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 16. Notices & CMS
-- Public visitors read published public notices; Staff read staff notices; Parents read parent notices
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access on notices" ON public.notices;
CREATE POLICY "Admin full access on notices"
  ON public.notices FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Public and users can view published notices" ON public.notices;
CREATE POLICY "Public and users can view published notices"
  ON public.notices FOR SELECT TO public
  USING (
    status = 'Published' AND (
      target_audience IN ('All', 'Public') OR
      (target_audience = 'Staff Only' AND public.is_staff()) OR
      (target_audience = 'Parents Only' AND public.is_parent()) OR
      (target_audience = 'Class Specific' AND EXISTS (
        SELECT 1 FROM public.student_enrollments se
        JOIN public.sections s ON s.id = se.section_id
        WHERE s.class_id = public.notices.target_class_id
          AND se.status = 'active'
          AND public.is_guardian_of(se.student_id)
      ))
    )
  );

-- ------------------------------------------------------------------------------
-- 17. School Settings
-- Public can read campus contact information; only Admin can update
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view school settings" ON public.school_settings;
CREATE POLICY "Public can view school settings"
  ON public.school_settings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on school settings" ON public.school_settings;
CREATE POLICY "Admin full access on school settings"
  ON public.school_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
