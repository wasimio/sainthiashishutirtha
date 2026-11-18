# Sainthia Shishutirtha — Phase 0: Project Reality Audit

**Document Date:** October 27, 2026  
**Auditor:** Antigravity (Advanced Agentic AI Assistant)  
**Target Repository:** `sainthiashishutirtha`  
**Framework:** Next.js 16.4.2 (App Router, Turbopack, React 19.3.0, TypeScript 5)  
**Database Backend:** Supabase PostgreSQL (`tybaaqktbdlnqsgodkek`, Region `ap-south-1`)  
**Scope:** Full-stack audit across Public Website, Admin Portal, Council Portal, Staff/Teacher Portal, Parent Portal, Database Schema, RLS Policies, and Storage Infrastructure.

---

## 1. Executive Reality Summary

Sainthia Shishutirtha presents a visually polished, responsive, and aesthetically complete school website and administrative management portal. However, an exhaustive code and data inspection reveals **a profound dichotomy between frontend appearance and backend reality**:

1. **The Admin Portal** has recently been connected to Supabase PostgREST tables for core entities (`classes`, `sections`, `subjects`, `students`, `payments`, `notices`, `settings`). However, because the production database is currently pristine (0 rows in application tables), the portal operates in an honest empty state with active creation modals.
2. **The Admissions Lifecycle is Completely Disconnected**: The public website admission enquiry modal (`src/components/modals/AdmissionModal.tsx`) generates a client-side random string (`ST-2026-XXXX`) and saves nothing to the database. Meanwhile, the Admin Admissions Desk (`src/app/portal/admin/admissions/page.tsx`) renders 10 hardcoded mock applications from `src/data/portalAdminData.ts` and simulates stage transitions via toast notifications.
3. **The Staff (Teacher) Portal is 100% Mock / Demo Data**: All 6 teacher portal subpages (`/portal/staff/attendance`, `/portal/staff/homework`, `/portal/staff/assessments`, `/portal/staff/classes`, `/portal/staff/profile`, `/portal/staff/remarks`) import fixtures from `src/data/portalStaffData.ts`. Marking morning attendance explicitly alerts: *"Morning Attendance Register saved locally (Demo simulation — no database record altered)."*
4. **The Parent Portal is 100% Mock / Demo Data**: All 7 parent portal subpages (`/portal/parent/attendance`, `/portal/parent/fees`, `/portal/parent/homework`, `/portal/parent/notices`, `/portal/parent/report-cards`, `/portal/parent/absence`, `/portal/parent/contact`) consume hardcoded fixtures. The sibling switcher in `ParentContext.tsx` hardcodes two synthetic children (`Aarav Sen` and `Ananya Sen`).
5. **The Council Portal is 100% Mock / Placeholder**: The Executive Dashboard (`/portal/council`) displays hardcoded metrics (342 students, 22 teachers, 94.2% attendance) from `src/data/councilDemoData.ts`, directly contradicting the Admin Portal's live database telemetry (0 students). Furthermore, all 7 Council sub-routes render a static `CouncilPlaceholderModule.tsx`.
6. **Public Website Data Silos**: Public `/notices`, `/faculty`, `/gallery`, and `/contact` render from static arrays in `src/data/schoolData.ts`. When an administrator publishes a notice in `/portal/admin/website`, it writes to Supabase `public.notices`, but the public `/notices` page never queries Supabase and cannot display it.
7. **Authentication & Role Trapping**: Newly registered users are auto-assigned `role = 'parent'` by database trigger `on_auth_user_created`. The trigger `guard_profile_role_update` strictly blocks non-admin updates, preventing self-service role escalation. Furthermore, the administrator onboarding modal in `/portal/admin/faculty` inserts into `staff_profiles` but forgets to update `profiles.role` to `'staff'`, permanently trapping onboarded teachers in the Parent Portal!

---

## 2. Priority Investigation Findings

### Priority 1: Dashboard Statistics vs. Detailed Pages
* **Admin Overview (`/portal/admin`)**:
  - Implemented via `getAdminDashboardTelemetry()` in `src/lib/services/adminService.ts`.
  - Performs real `count: 'exact', head: true` queries against `students` (Enrolled), `staff_profiles`, `classes`, `sections`, `admissions_applications` (Pending Review), `notices` (Published), and aggregates `payments.amount`.
  - Accurately reports `0` metrics across all cards, matching the underlying empty database state.
* **Council Overview (`/portal/council`)**:
  - Implemented in `src/app/portal/council/page.tsx` importing `COUNCIL_KPIS` from `src/data/councilDemoData.ts`.
  - Fabricates: Total Students: 342, Faculty: 22, Attendance: 94.2%, Fee Realization: ₹16,40,000, Admissions: 38.
  - **Verdict**: Critical divergence. Council and Admin dashboards display mutually contradictory facts to stakeholders.

### Priority 2: Public Admission Enquiry vs. Admin Admissions Desk
* **Public Enquiry Intake (`src/components/modals/AdmissionModal.tsx`)**:
  - Lines 88–93: `handleSubmit` executes `const randomId = 'ST-2026-' + Math.floor(...)` and sets `submittedRef(randomId)`.
  - **No network call**, no Supabase client call, no server action, no API route.
  - On page refresh or dialog close, the prospective student's contact details, date of birth, and parent info vanish completely.
* **Admin Admissions Desk (`src/app/portal/admin/admissions/page.tsx`)**:
  - Lines 10 & 38: Filters `ADMIN_ADMISSIONS_LIST` from `src/data/portalAdminData.ts`.
  - Line 48: Stage advance button shows toast `Demo simulation`.
  - Line 80: "Register Inquiry" button shows toast `New digital application form opened.` with no form.
* **Database & RLS Reality**:
  - Migration `20261022000005_communications_and_settings.sql` defines table `public.admissions_applications` with automatic sequence number `ADM-YYYY-XXXXX`.
  - Migration `20261022000006_row_level_security_policies.sql` defines RLS policy `"Public can submit admission applications"` permitting unauthenticated inserts into `public.admissions_applications` with `stage = 'Applied'`, `status = 'Pending Review'`.
  - **Verdict**: The database is ready to accept public applications securely, but the frontend was never wired to Supabase.

### Priority 3: Complete Admission-to-Enrollment Lifecycle
* **Stage Progression & Verification**:
  - Schema specifies stages: `'Applied' -> 'Document Verification' -> 'Parent Interaction' -> 'Provisional Admission' -> 'Enrolled' | 'Rejected'`.
  - In application code, **zero service functions exist** to update application stage, assign reviewers, or record decision notes.
* **Conversion to Enrolled Student**:
  - No transition mechanism exists to convert an approved `admissions_applications` record into a `students` row, a `guardians` row, and a `student_enrollments` record.
  - An administrator currently has to manually re-type all student and guardian information from scratch into `/portal/admin/students`.

### Priority 4: Student Registration & Relationship Architecture
* **Admin Student Registration (`src/app/portal/admin/students/page.tsx`)**:
  - Invokes `registerStudent()` in `src/lib/services/adminService.ts`.
  - Correctly executes a 4-table atomic creation:
    1. Inserts student into `public.students`.
    2. Inserts guardian into `public.guardians`.
    3. Inserts relationship into `public.student_guardians` (`is_primary = true`).
    4. Inserts cohort enrollment into `public.student_enrollments`.
* **Identified Defects & Limitations**:
  - **Guardian Duplication**: Every registration generates a synthetic `guardian_code` (`GRD-${Date.now()}`) and inserts a new guardian row. There is no lookup for existing guardians. Registering two siblings creates duplicate guardian records.
  - **Unlinked Guardians**: `guardians.profile_id` is left `NULL`. The guardian is not linked to any Supabase Auth user. `guardian_invitations` tokens are never generated. As a result, the parent can never log in and claim their child.
  - **Missing Document Attachments**: No file uploads for birth certificates, transfer certificates, or student photographs, leaving the configured `documents` and `student-photos` storage buckets unused.

### Priority 5: Academics Hierarchy & Teacher Assignments
* **Classes, Sections, and Subjects (`src/app/portal/admin/academics/page.tsx`)**:
  - Connects to Supabase tables `academic_years`, `classes`, `sections`, and `subjects`.
  - Provides active modals to create all 4 entities with database persistence.
* **Missing Teacher Allocations**:
  - `sections.class_teacher_id` cannot be set via the UI or `createSection()` service function.
  - The junction table `public.teacher_allocations` (`staff_id`, `section_id`, `subject_id`, `academic_year_id`, `role`) has **no corresponding service functions or UI forms**. Teachers cannot be mapped to their classes or subjects in the database.

### Priority 6: Faculty Records, Login Accounts, and Public Synchronization
* **Staff Onboarding Defect (`src/app/portal/admin/faculty/page.tsx`)**:
  - The modal creates a record in `public.staff_profiles` linked to an existing `profiles` ID.
  - **Defect**: It does NOT update `public.profiles.role` from `'parent'` to `'staff'`.
  - Because `/portal/staff` is guarded by `requireStaff()` which checks `profile.role === 'staff'`, the onboarded teacher is blocked from accessing the Teacher Portal and redirected to `/portal/parent`.
* **Public Faculty Page Disconnect (`src/app/faculty/page.tsx`)**:
  - Hardcodes 8 teachers from `FACULTY_MEMBERS` in `src/data/schoolData.ts`.
  - Does not query `public.staff_profiles` or `public.profiles`. Real teachers added by the administrator never appear on the public website.

### Priority 7: Teacher Attendance Submission vs. Admin Telemetry
* **Admin Monitoring (`/portal/admin/attendance`)**:
  - Correctly queries `attendance_sessions` and `attendance_records` via `getDailyAttendanceSummary()`. Displays an honest empty state when 0 sessions exist.
* **Teacher Submission (`/portal/staff/attendance`)**:
  - Operates entirely on mock array `STAFF_ATTENDANCE_REGISTER` in client memory.
  - "Save Attendance Register" shows a mock toast without executing any PostgREST query.
  - **Outcome**: The teacher portal never produces the attendance sessions that the admin portal is listening for.

### Priority 8: Finance, Fee Structures, Invoicing, and Payments
* **Admin Treasury (`/portal/admin/finance`)**:
  - Queries `public.payments`, `public.invoices`, `public.fee_structures`, and `public.fee_heads`.
  - Can create fee structures and manually record counter payments.
* **Missing Invoicing Engine**:
  - Creating a fee structure does NOT generate invoices for enrolled students.
  - `recordPayment()` inserts into `payments`, but does not populate `payment_allocations` or update invoice status from `Issued` to `Paid`.
* **Parent Fee Portal (`/portal/parent/fees`)**:
  - Reads hardcoded array `PARENT_FEE_INVOICES` from `src/data/portalParentData.ts`. Does not query the child's real invoices or payments.

### Priority 9: Parent and Teacher Portal Authorization & RLS
* **RLS Barrier for Parents**:
  - Database RLS helper `is_guardian_of(student_id)` requires:
    `g.profile_id = auth.uid() AND g.verification_status = 'verified'`
  - Since student registration leaves `guardians.profile_id = NULL`, any direct PostgREST query from an authenticated parent currently returns 0 rows due to RLS rejection.
* **Hardcoded Sibling Switcher**:
  - `src/components/portal/parent/ParentContext.tsx` hardcodes siblings `child-aarav` and `child-ananya`. It does not query `student_guardians` for children linked to the logged-in user.

### Priority 10: Public Website CMS, Notices, and Media Integration
* **Three Disconnected Notice Silos**:
  1. Live DB: `public.notices` (written to by `/portal/admin/website`).
  2. Public Site: `src/data/schoolData.ts` (`NOTICES_AND_EVENTS` read by `/notices` and home page).
  3. Parent Portal: `src/data/portalAdminData.ts` (`ADMIN_CMS_NOTICES` read by `/portal/parent/notices`).
* **Public Contact Form (`/contact`)**:
  - Performs `setIsSubmitted(true)` in React state. No database table or notification email exists.
* **Public Photo Gallery (`/gallery`)**:
  - Uses static Unsplash URLs from `schoolData.ts`. No connection to Supabase storage.

### Priority 11: Multi-School Tenant Isolation Architectural Gap
* **Current Single-Tenant Constraints**:
  - All 32 database tables lack a `school_id` / `tenant_id` column.
  - `school_settings` uses a hardcoded singleton key `id = 'primary_config'`.
  - RLS functions (`is_admin()`, `is_staff()`, `is_parent()`) are global and unaware of tenant boundaries.
  - Sequences (`admissions_app_seq`, `scholar_id`) are shared across the database cluster.
  - Storage bucket folder structures lack tenant prefixes.
* *Detailed multi-school migration blueprint provided in `docs/audit/DATA_FLOW_AND_RELATIONSHIPS.md`.*

---

## 3. Safe Local Verification Results

Safe read-only checks executed on the local environment produced the following verified outcomes:

| Check | Target | Exit Code | Result Details |
| :--- | :--- | :--- | :--- |
| **TypeScript Compiler** | `npx tsc --noEmit` | `0` | **0 errors**. Type definitions, PostgREST table interfaces, and component props are fully type-safe. |
| **ESLint** | `npm run lint` | `0` | **0 errors, 0 warnings**. React 19 hook dependency rules and Next.js 16 requirements satisfied. |
| **Next.js Production Build** | `npm run build` | `0` | **62/62 routes successfully compiled** (46 static/prerendered, 16 dynamic server-rendered routes). |
| **Git Working Tree** | `git status` | `0` | Clean working branch `main`. Modified files and untracked assets preserved without deletion. |
| **Database Schema Discovery** | Supabase Migrations | N/A | 8 versioned migration files in `supabase/migrations/` totaling 32 tables, 81 RLS policies, 4 storage buckets. |
| **Live Database Census** | Supabase REST / PostgREST | N/A | Verified 1 user in `auth.users` (`wasimakhtar.me@gmail.com`), 1 profile in `public.profiles` (`role = 'parent'`), exactly 0 rows across all 31 application tables. |

---

## 4. The Five Most Critical System Problems

1. **The Admission Intake Pipeline is Severed**: Prospective parents submitting the public website admission form receive a fake confirmation ID, while their data is discarded in memory. The admin admissions desk displays mock applications and cannot receive or process real submissions.
2. **Teacher & Parent Portals Operate in a Complete Mock Fantasy**: Both portals run 100% on hardcoded TypeScript fixtures (`portalStaffData.ts`, `portalParentData.ts`). Daily attendance, homework distribution, fee invoices, report cards, and student remarks do not touch the database.
3. **Staff Promotion & Role Trapping Defect**: Adding a teacher in `/portal/admin/faculty` inserts into `staff_profiles` but fails to promote `profiles.role` to `'staff'`, permanently redirecting teachers away from the staff portal into the parent portal.
4. **Parent-to-Student Guardian Linkage Gap**: Student registration generates orphaned guardian records with `profile_id = NULL`. Because RLS policies require `guardians.profile_id = auth.uid()`, real parents cannot access their children's records.
5. **CMS and Public Website Fragmentation**: Administrative notices and faculty additions saved in Supabase are invisible to visitors on `/notices` and `/faculty`, which continue to read obsolete static arrays.

---

## 5. Audit Conclusion

The application has achieved **rock-solid architectural foundations**: a comprehensive PostgreSQL schema, production-grade RLS policies, an edge-ready Next.js proxy, and a fully functional Admin Portal service layer. 

However, before launching to real teachers, parents, and prospective applicants, the system requires systematic integration of the public intake pipeline, staff operational interfaces, and parent-child authorization mechanisms as detailed in the accompanying deliverables.
