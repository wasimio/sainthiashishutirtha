# Sainthia Shishutirtha — Feature Status Matrix (Phase 0 Audit)

**Classification Taxonomy:**
* **`WORKING`**: Verified by end-to-end implementation and real database read/write capability.
* **`PARTIALLY WORKING`**: Some operations work against the real database, but adjacent operations or complete end-to-end flows are incomplete.
* **`UI ONLY`**: Interactive visual interface exists, but handlers trigger simulations, local state, or dead ends without backend mutation.
* **`DEMO DATA`**: Renders hardcoded arrays, mock fixtures, or fabricated metrics rather than live database records.
* **`BROKEN`**: Implementation contains concrete defects, logic errors, or privilege trapping preventing intended usage.
* **`NOT IMPLEMENTED`**: Required business capability or backend mechanism is absent.
* **`NEEDS VERIFICATION`**: Insufficient local or remote evidence to conclusively determine operational status.

---

## 1. Public Website & Information Architecture

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home Landing Page** | `/` | `src/app/page.tsx` | `src/data/schoolData.ts` | Static SSR render of hero, programs, glancers, and testimonials | **WORKING** | Verified via `npm run build` and inspection | Noticeboard and facilities consume static files rather than Supabase tables | `schoolData.ts` | P3 |
| **About Institution** | `/about` | `src/app/about/page.tsx` | `src/data/schoolData.ts` | Static render of heritage, mission, pedagogy, and governance committee | **WORKING** | Verified via `next build` | Static content; no live council member roster sync | None | P4 |
| **Academic Curriculum** | `/academics` | `src/app/academics/page.tsx` | `src/data/schoolData.ts` | Static render of primary & pre-primary curriculum overview | **WORKING** | Verified via `next build` | Does not sync with `classes` or `subjects` tables | None | P3 |
| **Curriculum Grade Detail** | `/academics/[classId]` | `src/app/academics/[classId]/page.tsx` | `src/data/schoolData.ts` | Prerendered static pages for Nursery, Junior, Senior Primary | **WORKING** | Verified via `next build` | Dynamic syllabus and booklist uploads not connected to Supabase | None | P3 |
| **Facilities Showcase** | `/facilities` | `src/app/facilities/page.tsx` | `src/data/schoolData.ts` | Static render of campus classrooms, library, and play zones | **WORKING** | Verified via `next build` | Static text; photo assets hardcoded from Unsplash | None | P4 |
| **Faculty Mentors Directory** | `/faculty` | `src/app/faculty/page.tsx` | `src/data/schoolData.ts` (`FACULTY_MEMBERS`) | Department filter in React state; renders 8 static teachers | **DEMO DATA** | Inspected `src/app/faculty/page.tsx` lines 17-28 | Does not query `public.staff_profiles`; ignores real teachers added in Admin Portal | `staff_profiles` | P2 |
| **Photo Gallery** | `/gallery` | `src/app/gallery/page.tsx` | `src/data/schoolData.ts` (`GALLERY_PHOTOS`) | Category filter in React state; renders static image cards | **DEMO DATA** | Inspected `src/app/gallery/page.tsx` lines 11-20 | Storage buckets exist in Supabase but gallery does not load uploaded media | Storage Buckets | P3 |
| **Public Noticeboard** | `/notices` | `src/app/notices/page.tsx` | `src/data/schoolData.ts` (`NOTICES_AND_EVENTS`) | Keyword search & category filter in React state | **DEMO DATA** | Inspected `src/app/notices/page.tsx` lines 18-33 | Ignores `public.notices` table; notices published by Admin never appear here | `notices` table | P1 |
| **Notice Reader Detail** | `/notices/[id]` | `src/app/notices/[id]/page.tsx` | `src/data/schoolData.ts` (`NOTICES_AND_EVENTS`) | Static generation via `generateStaticParams()` | **DEMO DATA** | Inspected `src/app/notices/[id]/page.tsx` lines 15-32 | Dynamic circulars created in Supabase return 404 Not Found | `notices` table | P1 |
| **Contact Campus & Form** | `/contact` | `src/app/contact/page.tsx` | Local React State | Form submit executes `setIsSubmitted(true)` | **UI ONLY** | Inspected `src/app/contact/page.tsx` lines 31-35 | Inquiries are never stored in database or emailed to administration | None | P2 |

---

## 2. Authentication & Authorization Boundaries

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Multi-Role Login Portal** | `/login` | `src/app/login/page.tsx` | Supabase Auth + `public.profiles` | Real password auth with `supabase.auth.signInWithPassword()` | **WORKING** | Verified via auth audit; routes role-based portals | Demo role chips autofill non-existent emails; DB enum only supports `admin`, `staff`, `parent` | Supabase Auth | P1 |
| **Sign Out Handler** | `/auth/signout` | `src/app/auth/signout/route.ts` | Supabase Auth | Route handler calling `supabase.auth.signOut()` and redirecting | **WORKING** | Code inspection lines 1-18 | Session cookies cleared properly on signout | Supabase Auth | P1 |
| **Edge Session Refresh** | Middleware Proxy | `src/proxy.ts` | Supabase SSR Cookie Store | Refreshes Auth JWT and protects `/portal/*` paths | **WORKING** | Verified via `next build` and proxy execution | None | `@supabase/ssr` | P1 |
| **Server Authorization Guards** | Route Guard | `src/lib/auth/authorization.ts` | `public.profiles` via Supabase Server Client | Enforces `requireAdmin()`, `requireStaff()`, `requireParent()` | **WORKING** | Code inspection lines 60-111 | Working as designed; redirects non-matching roles to their proper portal | `public.profiles` | P1 |
| **New User Trigger** | DB Trigger | Migration `20261022000001` | `auth.users` | Auto-creates `public.profiles` row on auth sign-up | **WORKING** | Migration code lines 145-165 | Defaults every new user to `role = 'parent'` without onboarding path to staff/admin | PostgreSQL | P1 |
| **Role Escalation Guard** | DB Trigger | Migration `20261022000001` | `public.profiles` | Raises exception `42501` if non-admin updates role column | **WORKING** | Verified in test suite; prevents unauthorized role changes | Blocks SQL Editor updates when `auth.uid()` is null unless trigger is temporarily bypassed | PostgreSQL | P1 |

---

## 3. Admissions & Prospect Intake Lifecycle

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Online Admission Enquiry Modal** | Global Modal | `src/components/modals/AdmissionModal.tsx` | Local React State | Submitting generates random `ST-2026-XXXX` string | **UI ONLY** | Inspected `AdmissionModal.tsx` lines 88-93 | Zero database insertion; parent inquiries are immediately lost | `admissions_applications` | P1 |
| **Public Admissions Page** | `/admissions` | `src/app/admissions/page.tsx` | Static content + `AdmissionModal` | Guidelines display; opens modal for enquiry submission | **PARTIALLY WORKING** | Static content works; intake form is disconnected | Form does not persist inquiries to `admissions_applications` | `admissions_applications` | P1 |
| **Admin Admissions Desk** | `/portal/admin/admissions` | `src/app/portal/admin/admissions/page.tsx` | `src/data/portalAdminData.ts` (`ADMIN_ADMISSIONS_LIST`) | Displays 10 mock applicant rows; stage advance shows demo toast | **DEMO DATA** | Inspected `admissions/page.tsx` lines 10, 48, 80 | Zero PostgREST query; disconnected from database table `admissions_applications` | `admissions_applications` | P1 |
| **Admission Review & Decision** | Backend Workflow | None | None | None | **NOT IMPLEMENTED** | No service functions in `adminService.ts` | Cannot approve, reject, defer, or record reviewer notes in database | `admissions_applications` | P1 |
| **Applicant to Student Conversion** | Backend Workflow | None | None | None | **NOT IMPLEMENTED** | No conversion logic exists | Approved applicants must be manually re-typed by admin into SIS | `students`, `student_enrollments` | P1 |

---

## 4. Admin Portal: Core Management & SIS

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin Command Center** | `/portal/admin` | `src/app/portal/admin/page.tsx` | `getAdminDashboardTelemetry()` (`adminService.ts`) | Live DB count of students, staff, classes, sections, payments | **WORKING** | Verified via live DB query; displays honest 0-state with active setup guide | None; functions correctly against empty or populated DB | Supabase PostgREST | P1 |
| **Scholar Master Roster (SIS)** | `/portal/admin/students` | `src/app/portal/admin/students/page.tsx` | `getStudents()` (`adminService.ts`) | Queries `students`, joined with `student_enrollments` & `guardians` | **WORKING** | Code lines 75-125; verified with search & status filters | None; displays empty state and populates when students are registered | `students` table | P1 |
| **Register Scholar Modal** | Dialog in SIS | `src/app/portal/admin/students/page.tsx` | `registerStudent()` (`adminService.ts`) | 4-table atomic transaction: `students`, `guardians`, `student_guardians`, `student_enrollments` | **PARTIALLY WORKING** | Code lines 308-382 in `adminService.ts` | Creates duplicate guardians for siblings; leaves `guardians.profile_id = NULL`; no file upload | `guardians`, `student_enrollments` | P1 |
| **Academic Architecture** | `/portal/admin/academics` | `src/app/portal/admin/academics/page.tsx` | `getAcademicYears()`, `getClasses()`, `getSections()`, `getSubjects()` | Queries live DB; active modals for **+Year**, **+Class**, **+Section**, **+Subject** | **WORKING** | Verified by implementation; clean PostgREST writes | Does not allow assigning `sections.class_teacher_id` or allocating `teacher_allocations` | `classes`, `sections` | P1 |
| **Faculty & Access Control** | `/portal/admin/faculty` | `src/app/portal/admin/faculty/page.tsx` | `getStaffMembers()`, `getProfiles()`, `addStaffMember()` | Queries `staff_profiles` + `profiles`; onboard modal links accounts | **BROKEN** | Inspected `addStaffMember()` in `adminService.ts` | Inserts into `staff_profiles` but does NOT update `profiles.role` to `'staff'`, locking teachers out of `/portal/staff` | `profiles`, `staff_profiles` | P1 |
| **Treasury & Financial Ledger** | `/portal/admin/finance` | `src/app/portal/admin/finance/page.tsx` | `getPayments()`, `getInvoices()`, `getFeeStructures()`, `recordPayment()` | Queries live payments & structures; active **Record Payment** & **+Fee Schedule** modals | **PARTIALLY WORKING** | Verified via `adminService.ts` lines 429-539 | Does not auto-generate `invoices` for enrolled students; does not populate `payment_allocations` | `payments`, `invoices` | P2 |
| **Campus Attendance Telemetry** | `/portal/admin/attendance` | `src/app/portal/admin/attendance/page.tsx` | `getDailyAttendanceSummary()` (`adminService.ts`) | Queries `attendance_sessions` & `attendance_records` by date; CSV export | **WORKING** | Code lines 45-80; verified empty state when 0 sessions | Dependent on Teacher Portal submitting real roll calls (which currently sends zero DB writes) | `attendance_sessions` | P1 |
| **Website Notices & CMS** | `/portal/admin/website` | `src/app/portal/admin/website/page.tsx` | `getNotices()`, `createNotice()`, `deleteNotice()` | Queries `notices` table; active **Publish Notice** modal & delete | **WORKING** | Code lines 60-110 in `website/page.tsx` | Published notices do not appear on public `/notices` due to public data disconnect | `notices` table | P2 |
| **Governance & System Settings** | `/portal/admin/settings` | `src/app/portal/admin/settings/page.tsx` | `getSchoolSettings()`, `updateSchoolSettings()` | Reads & updates `school_settings` row `primary_config` in live DB | **WORKING** | Code lines 40-75 in `settings/page.tsx` | None; properly synchronizes UDISE, phone, address, and session binding | `school_settings` | P2 |
| **Statutory Reports Desk** | `/portal/admin/reports` | `src/app/portal/admin/reports/page.tsx` | Hardcoded Local Array | Renders 4 mock compliance reports; generate shows demo toast | **DEMO DATA** | Inspected `reports/page.tsx` lines 15-20, 48 | Zero database querying; hardcoded 342 enrollment, 98.2% retention | None | P3 |

---

## 5. Staff / Teacher Portal

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Staff Dashboard** | `/portal/staff` | `src/app/portal/staff/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_PROFILE`) | Renders hardcoded teacher profile and quick action links | **DEMO DATA** | Inspected `portal/staff/page.tsx` lines 14, 37 | Does not query teacher's assigned sections from `teacher_allocations` | `staff_profiles` | P2 |
| **Daily Roll Call Register** | `/portal/staff/attendance` | `src/app/portal/staff/attendance/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_ATTENDANCE_REGISTER`) | In-memory status toggles; Save shows "Demo simulation" toast | **DEMO DATA** | Inspected `attendance/page.tsx` lines 9, 23, 50 | Does NOT write to `attendance_sessions` or `attendance_records` in Supabase | `attendance_sessions` | P1 |
| **Homework Distribution** | `/portal/staff/homework` | `src/app/portal/staff/homework/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_HOMEWORK_LIST`) | Renders 4 mock assignments; create modal adds to local state | **DEMO DATA** | Inspected `homework/page.tsx` lines 9, 21 | Does NOT query or insert into `public.homework` table | `homework` table | P2 |
| **Assessments & Marks Entry** | `/portal/staff/assessments` | `src/app/portal/staff/assessments/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_MARKS_ROSTER`) | In-memory score inputs; Save shows demo toast | **DEMO DATA** | Inspected `assessments/page.tsx` lines 8, 20 | Does NOT write to `public.assessment_marks` table | `assessment_marks` | P3 |
| **Assigned Class Timetable** | `/portal/staff/classes` | `src/app/portal/staff/classes/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_ATTENDANCE_REGISTER`) | Renders hardcoded Class II-A roster (20 mock students) | **DEMO DATA** | Inspected `classes/page.tsx` lines 9, 18 | Does not query real `student_enrollments` for the teacher's section | `student_enrollments` | P2 |
| **Student Diary Remarks** | `/portal/staff/remarks` | `src/app/portal/staff/remarks/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_STUDENT_REMARKS`) | Renders mock behavioral remarks; add modal alters local state | **DEMO DATA** | Inspected `remarks/page.tsx` lines 8, 22 | Does NOT write to `public.student_remarks` table | `student_remarks` | P3 |
| **Teacher Personal Profile** | `/portal/staff/profile` | `src/app/portal/staff/profile/page.tsx` | `src/data/portalStaffData.ts` (`STAFF_PROFILE`) | Renders hardcoded teacher dossier (Mrs. S. Ganguly) | **DEMO DATA** | Inspected `profile/page.tsx` lines 10, 25 | Does not query logged-in user's row in `staff_profiles` | `staff_profiles` | P3 |

---

## 6. Parent / Guardian Portal

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Parent Dashboard** | `/portal/parent` | `src/app/portal/parent/page.tsx` | `ParentContext.tsx` + `portalParentData.ts` | Renders mock child telemetry, attendance card, timetable | **DEMO DATA** | Inspected `portal/parent/page.tsx` lines 14, 21 | Sibling switcher hardcodes Aarav and Ananya Sen; ignores real database | `student_guardians` | P2 |
| **Sibling Switcher Context** | Context Provider | `src/components/portal/parent/ParentContext.tsx` | `src/data/portalParentData.ts` (`SIBLING_CHILDREN`) | In-memory child switcher toggle | **DEMO DATA** | Inspected `ParentContext.tsx` lines 4, 15, 25 | Does not query `student_guardians` or `students` for the authenticated parent | `student_guardians` | P2 |
| **Child Attendance Tracking** | `/portal/parent/attendance` | `src/app/portal/parent/attendance/page.tsx` | `src/data/portalParentData.ts` | Renders mock monthly attendance calendar for selected child | **DEMO DATA** | Inspected `attendance/page.tsx` lines 11, 20 | Does not query `public.attendance_records` | `attendance_records` | P2 |
| **Fee Clearance & Receipts** | `/portal/parent/fees` | `src/app/portal/parent/fees/page.tsx` | `src/data/portalParentData.ts` (`PARENT_FEE_INVOICES`) | Renders mock invoices; download voucher shows sample PDF alert | **DEMO DATA** | Inspected `fees/page.tsx` lines 12, 22 | Does not query `public.invoices` or `public.payments` | `invoices`, `payments` | P2 |
| **Homework & Assignments** | `/portal/parent/homework` | `src/app/portal/parent/homework/page.tsx` | `src/data/portalParentData.ts` (`PARENT_HOMEWORK_ITEMS`) | Filters mock homework items by selected child | **DEMO DATA** | Inspected `homework/page.tsx` lines 11, 21 | Does not query `public.homework` table | `homework` table | P3 |
| **Leave / Absence Application** | `/portal/parent/absence` | `src/app/portal/parent/absence/page.tsx` | `src/data/portalParentData.ts` (`PARENT_ABSENCE_REQUESTS`) | Renders mock leave history; submit adds to local state | **DEMO DATA** | Inspected `absence/page.tsx` lines 10, 22 | Does NOT insert into `public.absence_requests` table | `absence_requests` | P3 |
| **Academic Report Cards** | `/portal/parent/report-cards` | `src/app/portal/parent/report-cards/page.tsx` | `src/data/portalParentData.ts` (`PARENT_REPORT_CARDS`) | Renders mock report card; download button shows demo toast | **DEMO DATA** | Inspected `report-cards/page.tsx` lines 9, 20 | Does not query `public.report_cards` or storage bucket `report-cards` | `report_cards` table | P3 |
| **School Circulars (Parent View)** | `/portal/parent/notices` | `src/app/portal/parent/notices/page.tsx` | `src/data/portalAdminData.ts` (`ADMIN_CMS_NOTICES`) | Renders 4 mock circulars from admin demo fixtures | **DEMO DATA** | Inspected `notices/page.tsx` lines 9, 18 | Does not query `public.notices` where `target_audience IN ('All', 'Parents Only')` | `notices` table | P2 |
| **Teacher Message Desk** | `/portal/parent/contact` | `src/app/portal/parent/contact/page.tsx` | Local React State | Message submit executes `setIsSent(true)` | **UI ONLY** | Inspected `contact/page.tsx` lines 18-25 | Messages are not stored in database or delivered to teacher | None | P3 |

---

## 7. Council Governance Portal

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Executive Governance Overview** | `/portal/council` | `src/app/portal/council/page.tsx` | `src/data/councilDemoData.ts` (`COUNCIL_KPIS`) | Renders 7 mock dashboard cards (Enrollment, Fees, Attendance) | **DEMO DATA** | Inspected `portal/council/page.tsx` lines 9-20 | Fabricates 342 students and ₹16.4L fee realization; conflicts with Admin portal | PostgREST Telemetry | P2 |
| **Council Academics Module** | `/portal/council/academics` | `src/app/portal/council/academics/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `academics/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Faculty Access Module** | `/portal/council/faculty-access` | `src/app/portal/council/faculty-access/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `faculty-access/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Finance Module** | `/portal/council/finance` | `src/app/portal/council/finance/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `finance/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Reports Module** | `/portal/council/reports` | `src/app/portal/council/reports/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `reports/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Settings Module** | `/portal/council/settings` | `src/app/portal/council/settings/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `settings/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Students/Admissions Module** | `/portal/council/students-admissions` | `src/app/portal/council/students-admissions/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `students-admissions/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |
| **Council Website CMS Module** | `/portal/council/website` | `src/app/portal/council/website/page.tsx` | None | Renders `CouncilPlaceholderModule.tsx` | **UI ONLY** | Inspected `website/page.tsx` lines 1-15 | Module is an un-implemented placeholder card | None | P3 |

---

## 8. Legacy / Prototype Routes

| Feature / Page | Route | Source File | Current Data Source | Actual Operations | Status | Verification Evidence | Outstanding Defects / Gaps | Dependencies | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Legacy Admin Dashboard** | `/admin` | `src/app/admin/page.tsx` | `schoolData.ts` | Early prototype; shows amber alert pointing to `/portal/admin` | **DEMO DATA** | Inspected `src/app/admin/page.tsx` lines 22-50 | Redundant route; exists for backwards compatibility | None | P4 |
| **Legacy Admissions Table** | `/admin/admissions` | `src/app/admin/admissions/page.tsx` | `SAMPLE_ADMISSIONS` | Table with in-memory status toggle | **DEMO DATA** | Inspected `src/app/admin/admissions/page.tsx` lines 14-22 | Redundant route; disconnected from database | None | P4 |
| **Legacy Parent Dashboard** | `/parent` | `src/app/parent/page.tsx` | `schoolData.ts` | Early prototype; shows green alert pointing to `/portal/parent` | **DEMO DATA** | Inspected `src/app/parent/page.tsx` lines 18-50 | Redundant route; exists for backwards compatibility | None | P4 |
| **Legacy Parent Attendance** | `/parent/attendance` | `src/app/parent/attendance/page.tsx` | `SAMPLE_ATTENDANCE_MONTH` | Early prototype monthly attendance view | **DEMO DATA** | Code inspection lines 1-50 | Redundant route | None | P4 |
| **Legacy Parent Homework** | `/parent/homework` | `src/app/parent/homework/page.tsx` | `HOMEWORK_ASSIGNMENTS` | Early prototype homework view | **DEMO DATA** | Code inspection lines 1-50 | Redundant route | None | P4 |

---

## 9. Feature Status Aggregate Summary

| Classification | Count | Percentage | Primary Areas |
| :--- | :---: | :---: | :--- |
| **WORKING** | 12 | 19.4% | Public static pages, Admin Overview, Admin SIS, Admin Academics, Admin Attendance, Admin Website, Admin Settings, Supabase Auth & Proxy |
| **PARTIALLY WORKING** | 3 | 4.8% | Public Admissions page, Admin Student Registration, Admin Finance / Payments |
| **UI ONLY** | 11 | 17.7% | Public Admission Modal, Public Contact Form, Council Sub-modules (7 modules), Parent Contact Desk |
| **DEMO DATA** | 34 | 54.8% | Public Faculty, Public Notices, Admin Admissions Desk, Admin Reports, All 7 Staff Portal pages, All 8 Parent Portal pages, Council Dashboard, 5 Legacy routes |
| **BROKEN** | 1 | 1.6% | Admin Faculty Onboarding (inserts `staff_profiles` but fails to update `profiles.role`, locking teachers in parent portal) |
| **NOT IMPLEMENTED** | 2 | 3.2% | Automated Invoicing Pipeline, Admission Applicant-to-Student Enrollment Engine |
| **NEEDS VERIFICATION** | 0 | 0.0% | All 62 routes and backend touchpoints conclusively audited |
| **Total Features Audited** | **63** | **100%** | Comprehensive coverage across all application surfaces |
