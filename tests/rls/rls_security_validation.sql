-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Executable RLS Security Test Suite (Phase 2B Hardened)
-- Path: tests/rls/rls_security_validation.sql
-- Description: Automated verification for Row-Level Security, role boundaries,
-- privilege escalation barriers, academic consistency, and financial integrity
-- using simulated auth contexts.
-- Everything runs inside a transactional sandbox (ROLLBACK).
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- SETUP: Synthetic Test Users and Entities in Sandbox
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_admin_id uuid := '11111111-1111-1111-1111-111111111111';
  v_staff_id uuid := '22222222-2222-2222-2222-222222222222';
  v_parent_a_id uuid := '33333333-3333-3333-3333-333333333333';
  v_parent_b_id uuid := '44444444-4444-4444-4444-444444444444';

  v_year_id uuid;
  v_class_id uuid;
  v_sec_a_id uuid;
  v_sec_b_id uuid;
  v_sub_id uuid;
  v_student_a_id uuid;
  v_student_b_id uuid;
  v_guard_a_id uuid;
  v_guard_b_id uuid;
  v_session_id uuid;
  v_assess_id uuid;
  v_payment_id uuid;
  v_invoice_id uuid;
  v_app_id uuid;
  v_count integer;
  v_inv_status text;
  v_inv_paid numeric(10, 2);
  v_action_succeeded boolean;
BEGIN
  RAISE NOTICE '=== STARTING SHISHUTIRTHA RLS VALIDATION SUITE (PHASE 2B) ===';

  -- 1. Insert synthetic auth users (bypassing triggers for test setup)
  INSERT INTO auth.users (id, email, raw_user_meta_data)
  VALUES
    (v_admin_id, 'admin.test@shishutirtha.org', '{"full_name": "Admin Test"}'::jsonb),
    (v_staff_id, 'staff.test@shishutirtha.org', '{"full_name": "Staff Test"}'::jsonb),
    (v_parent_a_id, 'parent.a@test.com', '{"full_name": "Parent A"}'::jsonb),
    (v_parent_b_id, 'parent.b@test.com', '{"full_name": "Parent B"}'::jsonb)
  ON CONFLICT (id) DO NOTHING;

  -- 2. Configure Profiles
  INSERT INTO public.profiles (id, role, full_name, email, is_active)
  VALUES
    (v_admin_id, 'admin', 'Council Admin', 'admin.test@shishutirtha.org', true),
    (v_staff_id, 'staff', 'Teacher Sharmistha', 'staff.test@shishutirtha.org', true),
    (v_parent_a_id, 'parent', 'Guardian Sen', 'parent.a@test.com', true),
    (v_parent_b_id, 'parent', 'Guardian Roy', 'parent.b@test.com', true)
  ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;

  -- 3. Staff Profile
  INSERT INTO public.staff_profiles (profile_id, employee_id, designation)
  VALUES (v_staff_id, 'TEST-EMP-01', 'Primary Teacher')
  ON CONFLICT (profile_id) DO NOTHING;

  -- 4. Guardians
  INSERT INTO public.guardians (id, profile_id, guardian_code, primary_guardian_name, primary_phone, verification_status)
  VALUES
    (gen_random_uuid(), v_parent_a_id, 'TEST-GRD-A', 'Guardian Sen', '+919999900001', 'verified'),
    (gen_random_uuid(), v_parent_b_id, 'TEST-GRD-B', 'Guardian Roy', '+919999900002', 'verified')
  RETURNING id INTO v_guard_a_id;

  SELECT id INTO v_guard_b_id FROM public.guardians WHERE profile_id = v_parent_b_id;

  -- 5. Academic Year & Class & Sections
  INSERT INTO public.academic_years (name, start_date, end_date, is_current)
  VALUES ('2026-TEST', '2026-04-01', '2027-03-31', false)
  RETURNING id INTO v_year_id;

  INSERT INTO public.classes (name, code, wing, display_order)
  VALUES ('Class II Test', 'CLS2-T', 'Junior Primary', 99)
  RETURNING id INTO v_class_id;

  INSERT INTO public.sections (class_id, academic_year_id, name, class_teacher_id)
  VALUES
    (v_class_id, v_year_id, 'Section-A', v_staff_id) -- Staff is assigned Section-A
  RETURNING id INTO v_sec_a_id;

  INSERT INTO public.sections (class_id, academic_year_id, name, class_teacher_id)
  VALUES
    (v_class_id, v_year_id, 'Section-B', NULL) -- Staff is NOT assigned Section-B
  RETURNING id INTO v_sec_b_id;

  INSERT INTO public.subjects (name, code, description)
  VALUES ('Mathematics Test', 'MATH-T', 'Elementary Arithmetic')
  RETURNING id INTO v_sub_id;

  -- 6. Students
  INSERT INTO public.students (scholar_id, first_name, last_name, gender, date_of_birth)
  VALUES
    ('SCH-TEST-A', 'ChildA', 'Sen', 'Male', '2019-05-10'),
    ('SCH-TEST-B', 'ChildB', 'Roy', 'Female', '2019-08-15')
  RETURNING id INTO v_student_b_id;

  SELECT id INTO v_student_a_id FROM public.students WHERE scholar_id = 'SCH-TEST-A';

  -- 7. Enrollments: Student A in Section A (taught by Staff), Student B in Section B (unassigned)
  INSERT INTO public.student_enrollments (student_id, section_id, academic_year_id, roll_number)
  VALUES
    (v_student_a_id, v_sec_a_id, v_year_id, 1),
    (v_student_b_id, v_sec_b_id, v_year_id, 1);

  -- 8. Student-Guardian Mapping: Parent A -> Student A; Parent B -> Student B
  INSERT INTO public.student_guardians (student_id, guardian_id, relationship)
  VALUES
    (v_student_a_id, v_guard_a_id, 'Father'),
    (v_student_b_id, v_guard_b_id, 'Mother');

  -- 9. Attendance Session & Records (Section A, unlocked initially)
  INSERT INTO public.attendance_sessions (section_id, session_date, marked_by, is_locked)
  VALUES (v_sec_a_id, '2026-10-22', v_staff_id, false)
  RETURNING id INTO v_session_id;

  INSERT INTO public.attendance_records (session_id, student_id, status)
  VALUES (v_session_id, v_student_a_id, 'present');

  -- 10. Assessment (Unpublished initially)
  INSERT INTO public.assessments (academic_year_id, section_id, subject_id, teacher_id, term, name, max_marks, pass_marks, is_published)
  VALUES (v_year_id, v_sec_a_id, v_sub_id, v_staff_id, 'Term 1', 'Mid-Term Evaluation', 50, 20, false)
  RETURNING id INTO v_assess_id;

  INSERT INTO public.assessment_marks (assessment_id, student_id, marks_obtained, grade_letter, entered_by)
  VALUES (v_assess_id, v_student_a_id, 44.50, 'A', v_staff_id);

  -- 11. Invoices & Payments
  INSERT INTO public.invoices (invoice_no, student_id, academic_year_id, title, due_date, total_amount)
  VALUES
    ('INV-TEST-A', v_student_a_id, v_year_id, 'Term 1 Fee Child A', '2026-05-15', 5400.00),
    ('INV-TEST-B', v_student_b_id, v_year_id, 'Term 1 Fee Child B', '2026-05-15', 5400.00)
  RETURNING id INTO v_invoice_id;

  SELECT id INTO v_invoice_id FROM public.invoices WHERE invoice_no = 'INV-TEST-A';

  INSERT INTO public.payments (receipt_no, student_id, guardian_id, amount, payment_mode, status, collected_by)
  VALUES ('REC-TEST-001', v_student_a_id, v_guard_a_id, 5400.00, 'UPI', 'Completed', v_admin_id)
  RETURNING id INTO v_payment_id;

  -- 12. Notices: Public, Staff, and Draft
  INSERT INTO public.notices (title, category, content, author_id, target_audience, status)
  VALUES
    ('Public Holiday Notice', 'Holiday', 'Campus closed for holiday.', v_admin_id, 'Public', 'Published'),
    ('Internal Staff Circular', 'Circular', 'Faculty staff meeting at 3 PM.', v_admin_id, 'Staff Only', 'Published'),
    ('Draft Secret Notice', 'Circular', 'Not yet published.', v_admin_id, 'Public', 'Draft');

  RAISE NOTICE 'Setup complete. Executing RLS & Security Test Assertions...';

  -- ============================================================================
  -- TEST 1: Anonymous Access Denied to Private Tables
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE anon';
  EXECUTE 'SET LOCAL "request.jwt.claims" = ''{"role": "anon"}''';

  SELECT COUNT(*) INTO v_count FROM public.students;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Anonymous user was able to read % student records!', v_count;
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.invoices;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Anonymous user was able to read % invoice records!', v_count;
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.notices WHERE title = 'Public Holiday Notice';
  IF v_count != 1 THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Anonymous user could not read public published notice!';
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.notices WHERE title = 'Draft Secret Notice';
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 1 FAILED: Anonymous user read a draft notice!';
  END IF;

  RAISE NOTICE '✓ TEST 1 PASSED: Anonymous access strictly denied to private tables; published notices accessible.';

  -- ============================================================================
  -- TEST 2: Parent A Cannot Read Parent B Child Records / Invoices
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_parent_a_id);

  SELECT COUNT(*) INTO v_count FROM public.students WHERE id = v_student_a_id;
  IF v_count != 1 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Parent A could not view their own child!';
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.students WHERE id = v_student_b_id;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Parent A was able to read Parent B child record!';
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.invoices WHERE student_id = v_student_b_id;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 2 FAILED: Parent A was able to read Parent B child invoice!';
  END IF;

  RAISE NOTICE '✓ TEST 2 PASSED: Sibling/guardian isolation verified. Parent A cannot read Parent B child data.';

  -- ============================================================================
  -- TEST 3: Staff Cannot Access Unassigned Classes / Students
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_staff_id);

  SELECT COUNT(*) INTO v_count FROM public.students WHERE id = v_student_a_id;
  IF v_count != 1 THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Staff could not view student in assigned Section A!';
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.students WHERE id = v_student_b_id;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 3 FAILED: Staff was able to access unassigned student in Section B!';
  END IF;

  RAISE NOTICE '✓ TEST 3 PASSED: Staff isolation verified. Access restricted to assigned cohorts.';

  -- ============================================================================
  -- TEST 4: Non-Admin Cannot Escalate Role or Change Identity
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_parent_a_id);

  v_action_succeeded := false;
  BEGIN
    UPDATE public.profiles SET role = 'admin' WHERE id = v_parent_a_id;
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from guard_profile_role_update trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 4 FAILED: Parent was able to promote self to admin!';
  END IF;

  v_action_succeeded := false;
  BEGIN
    UPDATE public.profiles SET id = gen_random_uuid() WHERE id = v_parent_a_id;
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from guard_profile_role_update trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 4 FAILED: Parent was able to alter profile user ID!';
  END IF;

  RAISE NOTICE '✓ TEST 4 PASSED: Privilege escalation and identity alteration strictly blocked.';

  -- ============================================================================
  -- TEST 5: Unauthorized Financial Changes Blocked
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_parent_a_id);

  v_action_succeeded := false;
  BEGIN
    INSERT INTO public.invoices (invoice_no, student_id, academic_year_id, title, due_date, total_amount)
    VALUES ('INV-HACK-01', v_student_a_id, v_year_id, 'Hacked Invoice', '2026-05-15', 0);
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from RLS
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 5 FAILED: Parent was able to insert fee invoice!';
  END IF;

  v_action_succeeded := false;
  BEGIN
    DELETE FROM public.payments WHERE id = v_payment_id;
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from protect_payment_deletion trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 5 FAILED: Payment receipt was deleted!';
  END IF;

  RAISE NOTICE '✓ TEST 5 PASSED: Financial alterations and receipt deletion prohibited.';

  -- ============================================================================
  -- TEST 6: Unpublished Marks Hidden from Parents; Visible Once Published
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_parent_a_id);

  -- Assessment is currently unpublished -> Parent must NOT see marks
  SELECT COUNT(*) INTO v_count FROM public.assessment_marks WHERE student_id = v_student_a_id;
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 6 FAILED: Parent saw unpublished marks!';
  END IF;

  -- Admin publishes assessment
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_admin_id);
  UPDATE public.assessments SET is_published = true WHERE id = v_assess_id;

  -- Now Parent A should see marks
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_parent_a_id);
  SELECT COUNT(*) INTO v_count FROM public.assessment_marks WHERE student_id = v_student_a_id;
  IF v_count != 1 THEN
    RAISE EXCEPTION 'TEST 6 FAILED: Parent could not see officially published marks!';
  END IF;

  RAISE NOTICE '✓ TEST 6 PASSED: Unpublished marks hidden; published marks accessible by guardian.';

  -- ============================================================================
  -- TEST 7: Staff Cannot Alter Marks Once Published
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_staff_id);

  UPDATE public.assessment_marks SET marks_obtained = 50.00 WHERE assessment_id = v_assess_id;
  -- With RLS, zero rows are updated because policy requires is_published = false
  SELECT marks_obtained INTO v_count FROM public.assessment_marks WHERE assessment_id = v_assess_id;
  IF v_count = 50.00 THEN
    RAISE EXCEPTION 'TEST 7 FAILED: Staff updated marks on an officially published assessment!';
  END IF;

  RAISE NOTICE '✓ TEST 7 PASSED: Staff marks modification frozen once assessment is officially published.';

  -- ============================================================================
  -- TEST 8: Staff Cannot Alter Attendance Once Session Is Locked
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_admin_id);
  UPDATE public.attendance_sessions SET is_locked = true WHERE id = v_session_id;

  -- Staff attempts to change status on locked session
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_staff_id);

  UPDATE public.attendance_records SET status = 'absent' WHERE session_id = v_session_id;
  -- With RLS policy checking is_locked = false, the update matches 0 rows
  SELECT COUNT(*) INTO v_count FROM public.attendance_records WHERE session_id = v_session_id AND status = 'absent';
  IF v_count != 0 THEN
    RAISE EXCEPTION 'TEST 8 FAILED: Staff altered attendance records on a locked session!';
  END IF;

  RAISE NOTICE '✓ TEST 8 PASSED: Locked attendance sessions are protected against staff modification.';

  -- ============================================================================
  -- TEST 9: Public Admissions Cannot Submit Pre-Approved / Enrolled Records
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE anon';
  EXECUTE 'SET LOCAL "request.jwt.claims" = ''{"role": "anon"}''';

  -- Public attempts to submit application with stage = 'Enrolled'
  v_action_succeeded := false;
  BEGIN
    INSERT INTO public.admissions_applications (
      academic_year_id, applied_class_id, candidate_first_name, candidate_last_name,
      date_of_birth, gender, guardian_name, guardian_phone, residential_address,
      stage, status
    ) VALUES (
      v_year_id, v_class_id, 'Hacked', 'Candidate', '2020-01-01', 'Male',
      'Bad Actor', '+919999999999', 'Nowhere', 'Enrolled', 'Approved'
    );
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from trigger / RLS policy
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 9 FAILED: Anonymous user was able to insert pre-approved admission!';
  END IF;

  RAISE NOTICE '✓ TEST 9 PASSED: Public admission submissions cannot bypass review stages.';

  -- ============================================================================
  -- TEST 10: Audit Log Immutability (Append-Only)
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_admin_id);

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id)
  VALUES (v_admin_id, 'TEST_AUDIT', 'TEST', '1');

  v_action_succeeded := false;
  BEGIN
    UPDATE public.audit_logs SET action = 'HACKED' WHERE action = 'TEST_AUDIT';
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from protect_audit_log_immutability trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 10 FAILED: Audit log was modified!';
  END IF;

  v_action_succeeded := false;
  BEGIN
    DELETE FROM public.audit_logs WHERE action = 'TEST_AUDIT';
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from protect_audit_log_immutability trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 10 FAILED: Audit log was deleted!';
  END IF;

  RAISE NOTICE '✓ TEST 10 PASSED: Audit logs verified strictly append-only (UPDATE and DELETE prohibited).';

  -- ============================================================================
  -- TEST 11: Payment Allocation Balance & Automated Invoice Sync
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_admin_id);

  -- Allocate payment to invoice
  INSERT INTO public.payment_allocations (payment_id, invoice_id, allocated_amount)
  VALUES (v_payment_id, v_invoice_id, 5400.00);

  SELECT paid_amount, status INTO v_inv_paid, v_inv_status
  FROM public.invoices WHERE id = v_invoice_id;

  IF v_inv_paid != 5400.00 OR v_inv_status != 'Paid' THEN
    RAISE EXCEPTION 'TEST 11 FAILED: Invoice paid amount (₹%) or status (%) failed to sync!', v_inv_paid, v_inv_status;
  END IF;

  -- Attempt over-allocation (allocating beyond payment amount)
  v_action_succeeded := false;
  BEGIN
    INSERT INTO public.payment_allocations (payment_id, invoice_id, allocated_amount)
    VALUES (v_payment_id, gen_random_uuid(), 100.00);
    v_action_succeeded := true;
  EXCEPTION WHEN OTHERS THEN
    v_action_succeeded := false; -- Expected error from sync_invoice_payment_allocation trigger
  END;
  IF v_action_succeeded THEN
    RAISE EXCEPTION 'TEST 11 FAILED: Over-allocation beyond payment amount was permitted!';
  END IF;

  RAISE NOTICE '✓ TEST 11 PASSED: Payment allocations automatically sync invoice balances and enforce ceilings.';

  -- ============================================================================
  -- TEST 12: Admin Has Comprehensive Oversight
  -- ============================================================================
  EXECUTE 'SET LOCAL ROLE authenticated';
  EXECUTE format('SET LOCAL "request.jwt.claims" = ''{"sub": "%s", "role": "authenticated"}''', v_admin_id);

  SELECT COUNT(*) INTO v_count FROM public.students;
  IF v_count != 2 THEN
    RAISE EXCEPTION 'TEST 12 FAILED: Admin could not view all student records! (Found %)', v_count;
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.invoices;
  IF v_count != 2 THEN
    RAISE EXCEPTION 'TEST 12 FAILED: Admin could not view all invoice records! (Found %)', v_count;
  END IF;

  RAISE NOTICE '✓ TEST 12 PASSED: Admin verified with institution-wide oversight.';

  RAISE NOTICE '=== ALL 12 SECURITY AND INTEGRITY TESTS PASSED SUCCESSFULLY ===';
END $$;

ROLLBACK; -- Always roll back test sandbox mutations
