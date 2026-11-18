# Shishutirtha — Prioritized Implementation Backlog

**Document:** `docs/audit/IMPLEMENTATION_BACKLOG.md`  
**Audit Date:** October 23, 2026  
**Scope:** Actionable, end-to-end engineering tasks to transition Shishutirtha from frontend prototype to production-ready school management system.  
**Standard:** Every task specifies Feature IDs, Affected Files/Tables, Detailed Acceptance Criteria, and Associated Verification Tests.

---

## Group 1: Critical Security Blockers

### Task 1.1: Supabase SSR Client & Route Protection Proxy (COMPLETED)
- **Status:** **DONE** (Implemented in Phase 3B)
- **Feature IDs:** `AUTH-003`, `ADM-NAV-001`, `STA-NAV-001`, `PAR-NAV-001`
- **Implemented Files:**
  - `src/lib/supabase/client.ts` (Browser client typed with `Database`)
  - `src/lib/supabase/server.ts` (Server client using async cookies and `@supabase/ssr`)
  - `src/lib/supabase/middleware.ts` (`updateSession` token refresh utility)
  - `src/lib/auth/authorization.ts` (`getAuthenticatedUser`, `getCurrentProfile`, `requireRole`, `requireAdmin`, `requireStaff`, `requireParent`)
  - `src/proxy.ts` (Next.js 16 Edge Proxy protecting `/portal/*` and legacy routes, with open redirect prevention)
  - `src/app/auth/signout/route.ts` (Server-side sign-out handler)
- **Verification Tests:** `TST-BLD-001`, `TST-BLD-002`, `TST-BLD-003`, `TST-AUT-002`, `TST-AUT-003`

### Task 1.2: Least-Privilege Function Permissions & Hardening (COMPLETED)
- **Status:** **DONE** (Migration prepared in Phase 3B)
- **Feature IDs:** `ADM-DSH-001`, `STA-ATT-001`, `PAR-CTX-001`
- **Migration File:** `supabase/migrations/20261023000001_security_advisor_remediation.sql`
- **Objects Remediated:**
  1. Explicit `search_path` set on all 8 unconfigured functions (`try_cast_uuid`, `protect_audit_log_immutability`, `check_attendance_enrollment`, `check_assessment_mark_enrollment`, `protect_receipt_immutability`, `protect_payment_deletion`, `sync_invoice_payment_allocation`, `handle_admissions_application_insert`).
  2. Execution revoked from `PUBLIC, anon, authenticated` for internal trigger-only functions.
  3. Execution granted strictly to `authenticated` for RLS helpers (`is_admin`, `is_staff`, `is_parent`, `is_guardian_of`, `is_teacher_of_section`, etc.); revoked from `PUBLIC` and `anon`.
  4. Execution of `try_cast_uuid` granted to `anon, authenticated` for storage policies.
- **Verification Tests:** `TST-BLD-004`, `TST-RLS-004`, `TST-RLS-010`

---

## Group 2: Authentication and Role Access

### Task 2.1: Real Supabase Auth Login Integration (COMPLETED)
- **Status:** **DONE** (Implemented in Phase 3B)
- **Feature IDs:** `AUTH-001`, `AUTH-002`
- **Implemented Files:**
  - `src/app/login/page.tsx`
- **Delivered Capabilities:**
  1. `supabase.auth.signInWithPassword({ email, password })` integration.
  2. Active loading state and double-submit prevention.
  3. Generic error message ("Invalid email or password") to mitigate account enumeration.
  4. Server-side profile verification (`is_active === true`) before routing.
  5. Multi-role redirection (`admin` -> `/portal/admin`, `staff` -> `/portal/staff`, `parent` -> `/portal/parent`).
  6. Internal return path validation (`redirect` param) respecting role permissions and blocking open redirects.
  7. Prototype switcher and demo passwords removed from normal login UI; selector gated behind `NODE_ENV !== 'production'`.
- **Verification Tests:** `TST-AUT-001`, `TST-AUT-003`, `TST-AUT-005`, `TST-AUT-006`

### Task 2.2: Profile Provisioning & Role Management
- **Feature IDs:** `ADM-FAC-001`, `ADM-SET-001`
- **Affected Files:**
  - `src/app/portal/admin/faculty/page.tsx`
  - `src/app/portal/admin/settings/page.tsx`
- **Affected Tables:** `public.profiles`, `public.staff_profiles`, `public.guardians`
- **Acceptance Criteria:**
  1. Trigger `handle_new_auth_user()` automatically provisions `public.profiles` with `role = 'parent'` on auth signup.
  2. Only verified administrators can promote an account to `staff` or `admin`.
  3. Administrator can invite staff or parents by email, creating associated `staff_profiles` or `guardians` records.
- **Verification Tests:** `TST-RLS-004`

---

## Group 3: Core School Operations

### Task 3.1: Master Student Information System (SIS) Persistence
- **Feature IDs:** `ADM-STU-001`, `ADM-STU-002`, `ADM-STU-003`, `ADM-STU-005`
- **Affected Files:**
  - `src/app/portal/admin/students/page.tsx`
  - `src/lib/services/studentService.ts`
- **Affected Tables:** `public.students`, `public.student_enrollments`, `public.sections`, `public.academic_years`
- **Acceptance Criteria:**
  1. SIS table queries active student enrollments for the current academic year using PostgREST pagination.
  2. Search filters execute server-side on student name, scholar ID, and roll number.
  3. Student detail dialog displays verified guardian contact information and emergency phone numbers.
  4. New student enrollment creates records in both `public.students` and `public.student_enrollments` within a database transaction.
- **Verification Tests:** `TST-RLS-012`, `TST-BLD-001`

### Task 3.2: Staff Daily Attendance Register & Session Locking
- **Feature IDs:** `STA-ATT-001`, `STA-ATT-002`, `STA-ATT-003`, `ADM-ATT-001`, `ADM-ATT-003`
- **Affected Files:**
  - `src/app/portal/staff/attendance/page.tsx`
  - `src/app/portal/admin/attendance/page.tsx`
  - `src/lib/services/attendanceService.ts`
- **Affected Tables:** `public.attendance_sessions`, `public.attendance_records`
- **Acceptance Criteria:**
  1. Staff portal queries or creates the daily `attendance_sessions` record for the teacher's assigned section.
  2. Teacher modifies status (present, absent, late) and clicks "Save Attendance Register".
  3. Records are persisted via batch upsert to `public.attendance_records`.
  4. If `attendance_sessions.is_locked = true` (post-11:30 AM), RLS policy blocks staff modifications.
  5. Admin portal displays real-time attendance percentages and provides an administrator lock-override control.
- **Verification Tests:** `TST-RLS-003`, `TST-RLS-008`

### Task 3.3: Homework Diary & Worksheet Attachments
- **Feature IDs:** `STA-HWK-001`, `STA-HWK-002`, `STA-HWK-003`, `PAR-HWK-001`, `PAR-HWK-002`
- **Affected Files:**
  - `src/app/portal/staff/homework/page.tsx`
  - `src/app/portal/parent/homework/page.tsx`
  - `src/lib/services/homeworkService.ts`
- **Affected Tables:** `public.homework`, `public.homework_submissions`, Storage Bucket `homework-attachments`
- **Acceptance Criteria:**
  1. Teacher creates homework assignment specifying class section, subject, title, instructions, due date, and optional attachment.
  2. Attached worksheet files are uploaded to Supabase Storage `homework-attachments` under `<section_id>/<filename>`.
  3. Parent portal displays active homework for the selected child's enrolled section with one-click worksheet download.
- **Verification Tests:** `TST-STO-003`, `TST-RLS-003`

---

## Group 4: Finance and Admissions

### Task 4.1: Public Admissions Submission & Verification Pipeline
- **Feature IDs:** `PUB-ADM-002`, `ADM-ADM-001`, `ADM-ADM-002`, `ADM-ADM-003`, `ADM-ADM-004`
- **Affected Files:**
  - `src/components/modals/AdmissionModal.tsx`
  - `src/app/portal/admin/admissions/page.tsx`
  - `src/lib/services/admissionsService.ts`
- **Affected Tables:** `public.admissions_applications`
- **Acceptance Criteria:**
  1. Public admission modal submits form to PostgREST with `stage = 'Applied'` and `status = 'Pending Review'`.
  2. Database trigger `trg_handle_admissions_application_insert` auto-generates official `ADM-YYYY-XXXXX` application number.
  3. Any attempt by public visitor to submit privileged status (e.g. `stage = 'Enrolled'`) is rejected with a trigger exception.
  4. Admin portal displays real-time applicant queue with stage-by-stage progression (Applied -> Verification -> Interaction -> Provisional -> Enrolled).
- **Verification Tests:** `TST-RLS-009`, `TST-PUB-003`

### Task 4.2: Fee Invoices, Counter Receipts, & Automatic Allocation
- **Feature IDs:** `ADM-FIN-001`, `ADM-FIN-003`, `ADM-FIN-004`, `PAR-FEE-001`, `PAR-FEE-002`
- **Affected Files:**
  - `src/app/portal/admin/finance/page.tsx`
  - `src/app/portal/parent/fees/page.tsx`
  - `src/lib/services/financeService.ts`
- **Affected Tables:** `public.fee_heads`, `public.fee_structures`, `public.invoices`, `public.invoice_items`, `public.payments`, `public.payment_allocations`
- **Acceptance Criteria:**
  1. Admin portal generates term fee invoices based on `fee_structures`.
  2. Counter fee collection records payments and allocates against unpaid invoices.
  3. Database trigger `trg_sync_invoice_payment_allocation` automatically recalculates `invoices.paid_amount` and marks status `Paid`.
  4. Payment deletion trigger `trg_protect_payment_deletion` strictly prevents receipt deletion.
  5. Parent portal displays itemized dues and downloadable receipts for verified linked children only.
- **Verification Tests:** `TST-RLS-005`, `TST-RLS-011`

---

## Group 5: Parent & Staff Experience

### Task 5.1: Real Multi-Child Sibling Switcher
- **Feature IDs:** `PAR-CTX-001`, `PAR-DSH-001`
- **Affected Files:**
  - `src/components/portal/parent/ParentContext.tsx`
  - `src/app/portal/parent/page.tsx`
  - `src/lib/services/parentService.ts`
- **Affected Tables:** `public.guardians`, `public.student_guardians`, `public.students`
- **Acceptance Criteria:**
  1. `ParentContext` queries `public.get_my_guardian_children_ids()` for current authenticated user.
  2. Fetches enrolled student profiles linked to verified guardian.
  3. Allows guardian to switch between multiple siblings (e.g. Nursery student and Class II student), automatically refreshing dashboard KPIs, timetable, and attendance.
- **Verification Tests:** `TST-RLS-002`

### Task 5.2: Student Absence / Medical Leave Application Workflow
- **Feature IDs:** `PAR-ABS-001`, `PAR-ABS-002`, `STA-DSH-001`
- **Affected Files:**
  - `src/app/portal/parent/absence/page.tsx`
  - `src/app/portal/staff/page.tsx`
  - `src/lib/services/absenceService.ts`
- **Affected Tables:** `public.absence_requests`
- **Acceptance Criteria:**
  1. Parent submits leave request (start date, end date, category, reason text) for linked child.
  2. Insert is validated by RLS policy `Parents can submit and view absence requests for their linked children`.
  3. Class mentor sees pending leave requests on Staff Dashboard with one-click approve/reject actions.
  4. Approved absence status is reflected in daily attendance records.
- **Verification Tests:** `TST-RLS-002`, `TST-RLS-003`

### Task 5.3: Terminal Assessment Marks & Report Card Publication
- **Feature IDs:** `STA-ASM-001`, `STA-ASM-002`, `STA-ASM-003`, `PAR-REP-001`, `PAR-REP-002`
- **Affected Files:**
  - `src/app/portal/staff/assessments/page.tsx`
  - `src/app/portal/parent/report-cards/page.tsx`
  - `src/lib/services/assessmentService.ts`
- **Affected Tables:** `public.assessments`, `public.assessment_marks`, `public.report_cards`, Storage Bucket `report-cards`
- **Acceptance Criteria:**
  1. Teacher enters marks for assigned students in draft assessments (`is_published = false`).
  2. Parents cannot view unpublished assessment marks.
  3. Once Admin sets `assessments.is_published = true`, marks are visible to verified parents.
  4. RLS freezes staff editing on published marks; only administrators can modify published records.
- **Verification Tests:** `TST-RLS-006`, `TST-RLS-007`, `TST-STO-002`

---

## Group 6: Website CMS & Public Features

### Task 6.1: Dynamic Public Circulars & CMS Desk
- **Feature IDs:** `PUB-NOT-001`, `PUB-NOT-002`, `PUB-HOM-006`, `ADM-CMS-001`, `ADM-CMS-003`
- **Affected Files:**
  - `src/app/notices/page.tsx`
  - `src/app/notices/[id]/page.tsx`
  - `src/components/home/NoticesAndEvents.tsx`
  - `src/app/portal/admin/website/page.tsx`
  - `src/lib/services/noticeService.ts`
- **Affected Tables:** `public.notices`
- **Acceptance Criteria:**
  1. Admin portal CMS creates, updates, and publishes circulars with category, priority, and audience targeting.
  2. Public website queries published notices where `target_audience IN ('All', 'Public')`.
  3. Staff notices (`target_audience = 'Staff Only'`) and Parent notices (`target_audience = 'Parents Only'`) are visible strictly to authenticated roles via RLS.
- **Verification Tests:** `TST-RLS-001`, `TST-PUB-005`, `TST-PUB-006`

### Task 6.2: Public Contact Form Persistence & Notifications
- **Feature IDs:** `PUB-CON-001`
- **Affected Files:**
  - `src/app/contact/page.tsx`
  - `src/lib/services/contactService.ts`
- **Affected Tables:** `public.contact_inquiries` (or table added via migration)
- **Acceptance Criteria:**
  1. Contact form submission is validated server-side (parent name, phone, message).
  2. Dispatches inquiry record to school administration.
  3. Provides user with clear submission confirmation and reference code.
- **Verification Tests:** `TST-PUB-004`

---

## Group 7: Reporting, Exports, and Polish

### Task 7.1: CSV & PDF Data Export Streams
- **Feature IDs:** `ADM-STU-004`, `STA-CLA-001`, `PAR-REP-002`
- **Affected Files:**
  - `src/app/api/export/roster/route.ts`
  - `src/app/api/export/report-card/[id]/route.ts`
- **Affected Tables:** `public.students`, `public.report_cards`
- **Acceptance Criteria:**
  1. SIS Roster export streams a properly formatted CSV file with scholar ID, name, grade, section, and guardian contact.
  2. Report card download generates official PDF formatted with school emblem and U-DISE header.
- **Verification Tests:** `TST-BLD-003`

### Task 7.2: Immutable Audit Log Viewer
- **Feature IDs:** `ADM-DSH-001`, `ADM-SET-001`
- **Affected Files:**
  - `src/app/portal/admin/settings/page.tsx`
  - `src/components/portal/admin/AuditLogViewer.tsx`
- **Affected Tables:** `public.audit_logs`
- **Acceptance Criteria:**
  1. Admin portal provides dedicated audit log viewer showing user ID, action, entity type, timestamp, and IP address.
  2. Read-only view enforced by RLS; `UPDATE` and `DELETE` attempts remain strictly prohibited by trigger.
- **Verification Tests:** `TST-RLS-010`
