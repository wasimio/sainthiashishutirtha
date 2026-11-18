# Shishutirtha — Master Feature Inventory & Functional Audit

**Document:** `docs/audit/FEATURE_INVENTORY.md`  
**Audit Date:** October 23, 2026  
**Scope:** Full repository audit spanning Public Website, Council Portal, Admin Portal, Staff Portal, Parent Portal, Legacy Prototypes, Database Schema, and Row-Level Security.  
**Total Discovered Features:** **101**

---

## 1. Classification & Status Definitions

Every feature is evaluated against strict evidence criteria:

- `WORKING_REAL_BACKEND`: Feature has end-to-end implementation (Frontend UI + Server Action/API + Supabase query/mutation + Database schema/trigger + RLS enforcement + Verified persistence).
- `PARTIAL`: Feature connects to a real backend but is missing server validation, error states, or full CRUD operations.
- `FRONTEND_ONLY` / `MOCK_OR_DEMO_DATA`: Complete, interactive UI rendered with components and client state, but data is sourced from static mock fixtures (`schoolData.ts`, `portalAdminData.ts`, `portalStaffData.ts`, `portalParentData.ts`, `councilDemoData.ts`). Mutations only alter local `useState` or trigger mock toasts (`(Demo simulation)`).
- `PLACEHOLDER`: Screen renders an informational placeholder card (`CouncilPlaceholderModule`) outlining planned capabilities without functional controls.
- `NOT_IMPLEMENTED`: Advertised feature is absent from both UI and backend.
- `BROKEN`: Feature has UI or route that fails, causes unhandled exceptions, or permits unauthorized access due to missing guards.
- `BLOCKED_BY_POLICY_DECISION`: Implementation is blocked pending school governance decisions (e.g. academic calendar start, grading thresholds, cash collection delegation).

---

## 2. Master Feature Table

### A. Public Website & Authentication (Features 1–24)

| Feature ID | Feature Name | Role | Route & Source Files | Implementation Status | Data Source & Tables | Reads Supabase | Writes Supabase | Required Role | Summary & Remaining Work |
|---|---|---|---|---|---|---|---|---|---|
| `PUB-NAV-001` | Global Public Navigation Header | Public | `/` (`src/components/layout/Navbar.tsx`) | `FRONTEND_ONLY` | Hardcoded navigation links | No | No | `anon` | Fully responsive navigation, mobile sheet drawer, portal quick links. Needs dynamic announcement badge from CMS. |
| `PUB-HOM-001` | Home Page Hero Presentation | Public | `/` (`src/app/page.tsx`, `HeroSection.tsx`) | `FRONTEND_ONLY` | `SCHOOL_INFO` in `schoolData.ts` | No | No | `anon` | Hero banner with editorial typography and CTA buttons. Needs dynamic session banner from `school_settings`. |
| `PUB-HOM-002` | Quick Action Floating Rail | Public | `/` (`src/components/common/QuickActionRail.tsx`) | `FRONTEND_ONLY` | Local state / modal trigger | No | No | `anon` | Fixed desktop side rail for Admission, Notice, and Contact modals. Working perfectly in frontend. |
| `PUB-HOM-003` | Academic Programs Overview | Public | `/` (`src/components/home/AcademicPrograms.tsx`) | `FRONTEND_ONLY` | Static arrays in `schoolData.ts` | No | No | `anon` | Cards for Nursery, KG, Classes I-IV. Needs real class capacities and active session from `classes` table. |
| `PUB-HOM-004` | School at a Glance Metric Strip | Public | `/` (`src/components/home/SchoolAtAGlance.tsx`) | `FRONTEND_ONLY` | Static constants in `schoolData.ts` | No | No | `anon` | Student-to-teacher ratio (18:1), section caps (30). Needs telemetry rollup from `students` and `teacher_allocations`. |
| `PUB-HOM-005` | Teaching Facilities Showcase | Public | `/` (`src/components/home/TeachingFacilities.tsx`) | `FRONTEND_ONLY` | `FACILITIES` in `schoolData.ts` | No | No | `anon` | Classroom, playground, library presentation. Visual component complete. |
| `PUB-HOM-006` | Public Notices & Events Feed | Public | `/` (`src/components/home/NoticesAndEvents.tsx`) | `MOCK_OR_DEMO_DATA` | `NOTICES_AND_EVENTS` in `schoolData.ts` | No | No | `anon` | Displays top 3 notices. Must query `public.notices` where `status = 'Published' AND target_audience IN ('All', 'Public')`. |
| `PUB-HOM-007` | Photo Gallery Preview Carousel | Public | `/` (`src/components/home/PhotoGallery.tsx`) | `FRONTEND_ONLY` | `GALLERY_IMAGES` in `schoolData.ts` | No | No | `anon` | Grid of campus activities and celebrations. Must link to Supabase Storage `public-media` bucket. |
| `PUB-HOM-008` | Admission Enquiry CTA Banner | Public | `/` (`src/components/home/AdmissionEnquiryCTA.tsx`) | `FRONTEND_ONLY` | Local state modal trigger | No | No | `anon` | Banner triggering digital application modal. |
| `PUB-HOM-009` | School Footer & Legal Metadata | Public | `/` (`src/components/layout/Footer.tsx`) | `FRONTEND_ONLY` | `SCHOOL_INFO` in `schoolData.ts` | No | No | `anon` | U-DISE (19082200103), affiliation, contact details. Complete frontend. |
| `PUB-ABT-001` | About Us & Institutional History | Public | `/about` (`src/app/about/page.tsx`) | `FRONTEND_ONLY` | Static content in page | No | No | `anon` | Founding philosophy, leadership message, core values. Complete frontend. |
| `PUB-ACA-001` | Academics & Curriculum Guide | Public | `/academics` (`src/app/academics/page.tsx`) | `FRONTEND_ONLY` | Static content in page | No | No | `anon` | Foundational Literacy & Numeracy (FLN) details, weekly structure. Complete frontend. |
| `PUB-ACA-002` | Grade-Specific Academic Detail | Public | `/academics/[classId]` (`src/app/academics/[classId]/page.tsx`) | `FRONTEND_ONLY` | `generateStaticParams` / `schoolData.ts` | No | No | `anon` | Pre-rendered static pages for each class level. Needs dynamic syllabus data from `subjects`. |
| `PUB-ADM-001` | Admission Guidelines & Age Rules | Public | `/admissions` (`src/app/admissions/page.tsx`) | `FRONTEND_ONLY` | `ADMISSION_DETAILS` in `schoolData.ts` | No | No | `anon` | Four-step admission journey, age cut-off table, FAQs. Complete frontend. |
| `PUB-ADM-002` | Online Admission Enquiry Form | Public | Modal (`src/components/modals/AdmissionModal.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `anon` | Collects candidate, guardian, grade, phone. Generates mock `ST-2026-XXXX` reference. Must persist to `public.admissions_applications`. |
| `PUB-FAC-001` | Faculty Directory & Mentors | Public | `/faculty` (`src/app/faculty/page.tsx`) | `MOCK_OR_DEMO_DATA` | `FACULTY_MEMBERS` in `schoolData.ts` | No | No | `anon` | Staff qualifications and roles. Must query `public.staff_profiles` join `profiles` for public-facing teachers. |
| `PUB-FCL-001` | Campus Facilities Overview | Public | `/facilities` (`src/app/facilities/page.tsx`) | `FRONTEND_ONLY` | Static content in page | No | No | `anon` | Safe campus, water, sanitation, activity spaces. Complete frontend. |
| `PUB-GAL-001` | Comprehensive Photo Gallery | Public | `/gallery` (`src/app/gallery/page.tsx`) | `MOCK_OR_DEMO_DATA` | `GALLERY_IMAGES` in `schoolData.ts` | No | No | `anon` | Category filters ('All', 'Campus', 'Academic', 'Events'). Needs Supabase Storage `public-media` integration. |
| `PUB-NOT-001` | Official Circulars & Notices Board | Public | `/notices` (`src/app/notices/page.tsx`) | `MOCK_OR_DEMO_DATA` | `NOTICES_AND_EVENTS` in `schoolData.ts` | No | No | `anon` | Search keyword and category filtering. Must query `public.notices` with RLS. |
| `PUB-NOT-002` | Notice Document Reader | Public | `/notices/[id]` (`src/app/notices/[id]/page.tsx`) | `MOCK_OR_DEMO_DATA` | `NOTICES_AND_EVENTS` in `schoolData.ts` | No | No | `anon` | Individual notice reader with metadata. Must query `public.notices` by ID. |
| `PUB-CON-001` | Contact Page & Campus Office | Public | `/contact` (`src/app/contact/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `anon` | Form submits to local state `isSubmitted = true`. Must write to an inquiries table or dispatch notification email. |
| `AUTH-001` | Multi-Role Portal Login Interface | Public | `/login` (`src/app/login/page.tsx`) | `WORKING_REAL_BACKEND` | `auth.users`, `public.profiles` | Yes | Yes | `anon` | Real Supabase Auth login via `signInWithPassword()`. Validates credentials, verifies active profile, and routes to role-specific portal. |
| `AUTH-002` | Prototype Role Quick Switcher | Public | `/login` (`src/app/login/page.tsx`) | `WORKING_REAL_BACKEND` | Development persona selector | No | No | `anon` | Prefills test emails in development mode (`NODE_ENV !== 'production'`). Automatically omitted from production builds. |
| `AUTH-003` | Session Auth & Route Protection | System | `src/proxy.ts` & portal `layout.tsx` | `WORKING_REAL_BACKEND` | `public.profiles`, Supabase SSR session | Yes | No | All roles | Next.js 16 Edge Proxy intercepts unauthenticated portal requests. Server layouts enforce role authorization (`requireAdmin`, `requireStaff`, `requireParent`). |
| `AUTH-004` | Server-Side Sign-Out Route | System | `/auth/signout` (`src/app/auth/signout/route.ts`) | `WORKING_REAL_BACKEND` | Supabase Auth session cookies | No | Yes | All roles | Server-side sign-out handler invalidates Supabase sessions, clears cookies, and redirects to `/login`. |

---

### B. Admin & Council Portal (Features 25–63)

| Feature ID | Feature Name | Role | Route & Source Files | Implementation Status | Data Source & Tables | Reads Supabase | Writes Supabase | Required Role | Summary & Remaining Work |
|---|---|---|---|---|---|---|---|---|---|
| `ADM-NAV-001` | Admin Sidebar Navigation | Admin | `/portal/admin/*` (`AdminSidebar.tsx`) | `FRONTEND_ONLY` | Static menu items | No | No | `admin` | Collapsible sidebar, active route indicators, logout trigger. Working in frontend. |
| `ADM-NAV-002` | Admin Topbar & Mobile Menu | Admin | `/portal/admin/*` (`AdminTopbar.tsx`) | `FRONTEND_ONLY` | Static metadata | No | No | `admin` | Search button, notification bell, user avatar, mobile drawer trigger. |
| `ADM-CMD-001` | Admin Command Palette (⌘K) | Admin | Global dialog (`AdminCommandDialog.tsx`) | `FRONTEND_ONLY` | Static quick links & actions | No | No | `admin` | Quick navigation to all modules. Working in frontend. |
| `ADM-DSH-001` | Admin Overview Telemetry | Admin | `/portal/admin` (`src/app/portal/admin/page.tsx`) | `MOCK_OR_DEMO_DATA` | `COUNCIL_KPIS` in `councilDemoData.ts` | No | No | `admin` | KPIs: 342 students, 93.6% attendance, ₹4.82L fees, 18 staff. Must compute dynamically from database. |
| `ADM-STU-001` | Student SIS Master Roster | Admin | `/portal/admin/students` (`students/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ADMIN_STUDENTS_LIST` in `portalAdminData.ts` | No | No | `admin` | Table of 12 sample students with Scholar ID, Grade, Guardian, Fee status. Must read `public.students` & `student_enrollments`. |
| `ADM-STU-002` | Student Search & Grade Filter | Admin | `/portal/admin/students` (`students/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering of demo array | No | No | `admin` | Filters by text and grade ('All', 'KG', 'Class I', etc.). Must bind to Supabase query with pagination. |
| `ADM-STU-003` | Student Record Detail Modal | Admin | `/portal/admin/students` (`students/page.tsx`) | `FRONTEND_ONLY` | Selected demo student | No | No | `admin` | Displays Scholar ID, DOB, Guardian details, Bus route, Fee standing. Must query student profile and guardian links. |
| `ADM-STU-004` | Student Roster CSV Export | Admin | `/portal/admin/students` (`students/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Shows toast `(Demo simulation)`. Needs real CSV stream generation from active enrollment dataset. |
| `ADM-STU-005` | New Admission Entry Action | Admin | `/portal/admin/students` (`students/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Shows toast. Needs full enrollment modal writing to `students` and `student_enrollments`. |
| `ADM-ADM-001` | Admissions Pipeline Desk | Admin | `/portal/admin/admissions` (`admissions/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ADMIN_ADMISSIONS_LIST` in `portalAdminData.ts` | No | No | `admin` | Tracks applicants across Applied, Document Verification, Parent Interaction, Enrolled. Must read `public.admissions_applications`. |
| `ADM-ADM-002` | Admissions Search & Filter | Admin | `/portal/admin/admissions` (`admissions/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering | No | No | `admin` | Search by applicant name, app no, guardian, or stage. Needs real PostgREST query. |
| `ADM-ADM-003` | Application Inspection Modal | Admin | `/portal/admin/admissions` (`admissions/page.tsx`) | `FRONTEND_ONLY` | Selected demo application | No | No | `admin` | Displays applicant details, previous school, reviewer notes. Must connect to Supabase. |
| `ADM-ADM-004` | Advance Application Stage | Admin | `/portal/admin/admissions` (`admissions/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Shows toast `(Demo simulation)`. Must execute `UPDATE admissions_applications SET stage = ..., status = ...`. |
| `ADM-ADM-005` | Manual Inquiry Registration | Admin | `/portal/admin/admissions` (`admissions/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Shows toast. Needs intake form inserting into `admissions_applications`. |
| `ADM-ACA-001` | Academic Class Architecture | Admin | `/portal/admin/academics` (`academics/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ACADEMIC_CLASSES` in page | No | No | `admin` | Grade wings, sections, class teachers, capacities. Must query `public.classes`, `sections`, and `academic_years`. |
| `ADM-ACA-002` | Class Capacity & Subjects | Admin | `/portal/admin/academics` (`academics/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ACADEMIC_CLASSES` in page | No | No | `admin` | Subject breakdown chips and seat limits. Must query `public.subjects` and `sections`. |
| `ADM-ATT-001` | Daily Attendance Oversight | Admin | `/portal/admin/attendance` (`attendance/page.tsx`) | `MOCK_OR_DEMO_DATA` | `COUNCIL_ATTENDANCE_SNAPSHOT` | No | No | `admin` | Class-wise present/total counts and school overall percentage. Must query `attendance_sessions` and `attendance_records`. |
| `ADM-ATT-002` | Daily Absentee Roster | Admin | `/portal/admin/attendance` (`attendance/page.tsx`) | `MOCK_OR_DEMO_DATA` | `absenteeSample` in page | No | No | `admin` | Absentee list with guardian phone numbers for follow-up. Must query `attendance_records` where `status = 'absent'`. |
| `ADM-ATT-003` | Attendance Lock Override | Admin | `/portal/admin/attendance` (`attendance/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Badge displays "Locked". Admin override action must update `attendance_sessions.is_locked`. |
| `ADM-FAC-001` | Staff Directory & Accounts | Admin | `/portal/admin/faculty` (`faculty/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ADMIN_FACULTY_LIST` in `portalAdminData.ts` | No | No | `admin` | Lists 6 teacher accounts with designation, employee ID, section mentor. Must read `staff_profiles` join `profiles`. |
| `ADM-FAC-002` | Faculty Search & Filter | Admin | `/portal/admin/faculty` (`faculty/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering | No | No | `admin` | Search by name, employee ID, or subject. Needs real query. |
| `ADM-FAC-003` | Faculty Detail & Allocation | Admin | `/portal/admin/faculty` (`faculty/page.tsx`) | `FRONTEND_ONLY` | Selected demo faculty | No | No | `admin` | Displays contact, qualifications, teaching load. Must read `teacher_allocations`. |
| `ADM-FIN-001` | Fee Collection Ledgers | Admin | `/portal/admin/finance` (`finance/page.tsx`) | `MOCK_OR_DEMO_DATA` | `COUNCIL_FEE_SUMMARY` & `ADMIN_FEE_TRANSACTIONS` | No | No | `admin` | Billed, Collected, Outstanding, Collection Rate metrics. Must compute from `invoices` and `payments`. |
| `ADM-FIN-002` | Transaction Search & Filter | Admin | `/portal/admin/finance` (`finance/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering | No | No | `admin` | Search by student name, receipt number, scholar ID. Needs real query. |
| `ADM-FIN-003` | Fee Receipt Voucher Modal | Admin | `/portal/admin/finance` (`finance/page.tsx`) | `FRONTEND_ONLY` | Selected demo transaction | No | No | `admin` | Shows itemized receipt with Tuition, Exam, Development fees. Needs real payment receipt generation. |
| `ADM-FIN-004` | Counter Payment Recording | Admin | `/portal/admin/finance` (`finance/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `admin` | Shows toast. Must provide counter form inserting into `payments` and `payment_allocations`. |
| `ADM-CMS-001` | Website Circulars CMS Desk | Admin | `/portal/admin/website` (`website/page.tsx`) | `MOCK_OR_DEMO_DATA` | `ADMIN_CMS_NOTICES` in `portalAdminData.ts` | No | No | `admin` | Lists published and draft circulars with audience tag. Must read/write `public.notices`. |
| `ADM-CMS-002` | Notice Search & Category Filter | Admin | `/portal/admin/website` (`website/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering | No | No | `admin` | Filters by status and category. Needs real query. |
| `ADM-CMS-003` | Create New Circular Modal | Admin | `/portal/admin/website` (`website/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `admin` | Prepends new notice to local state. Must execute `INSERT INTO notices (...)` with author ID. |
| `ADM-REP-001` | Governance & Regulatory Reports | Admin | `/portal/admin/reports` (`reports/page.tsx`) | `FRONTEND_ONLY` | Static report cards in page | No | No | `admin` | U-DISE telemetry, attendance register, fee realization summary, term academic dossier. Needs SQL aggregation. |
| `ADM-SET-001` | Governance & School Settings | Admin | `/portal/admin/settings` (`settings/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `admin` | Form with school name, U-DISE, address, session. Saves locally with toast. Must read/write `public.school_settings`. |
| `CNC-DSH-001` | Council Governance Dashboard | Council | `/portal/council` (`src/app/portal/council/page.tsx`) | `MOCK_OR_DEMO_DATA` | `COUNCIL_KPIS` in `councilDemoData.ts` | No | No | `admin` | Real-time administrative telemetry, enrollment distribution, fee realization, pending queues. Needs live database metrics. |
| `CNC-MOD-001` | Council Students Placeholder | Council | `/portal/council/students-admissions` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned capabilities for Council student oversight. Needs functional view. |
| `CNC-MOD-002` | Council Academics Placeholder | Council | `/portal/council/academics` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned FLN syllabus velocity and textbook highlights. Needs functional view. |
| `CNC-MOD-003` | Council Finance Placeholder | Council | `/portal/council/finance` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned institutional ledger audit views. Needs functional view. |
| `CNC-MOD-004` | Council Faculty Access Placeholder | Council | `/portal/council/faculty-access` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned teacher allocation and credential logs. Needs functional view. |
| `CNC-MOD-005` | Council Website CMS Placeholder | Council | `/portal/council/website` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned circular approval workflow. Needs functional view. |
| `CNC-MOD-006` | Council Reports Placeholder | Council | `/portal/council/reports` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned annual governance dossiers. Needs functional view. |
| `CNC-MOD-007` | Council Settings Placeholder | Council | `/portal/council/settings` | `PLACEHOLDER` | `CouncilPlaceholderModule` | No | No | `admin` | Displays planned institutional policy locks. Needs functional view. |

---

### C. Staff & Faculty Portal (Features 64–80)

| Feature ID | Feature Name | Role | Route & Source Files | Implementation Status | Data Source & Tables | Reads Supabase | Writes Supabase | Required Role | Summary & Remaining Work |
|---|---|---|---|---|---|---|---|---|---|
| `STA-NAV-001` | Staff Sidebar Navigation | Staff | `/portal/staff/*` (`StaffSidebar.tsx`) | `FRONTEND_ONLY` | Static menu items | No | No | `staff` | Collapsible sidebar with Classes, Attendance, Homework, Assessments, Remarks, Profile. Complete frontend. |
| `STA-NAV-002` | Staff Topbar & Mobile Menu | Staff | `/portal/staff/*` (`StaffTopbar.tsx`) | `FRONTEND_ONLY` | Static metadata | No | No | `staff` | Topbar with teacher avatar, mobile toggle. Complete frontend. |
| `STA-DSH-001` | Staff Dashboard Overview | Staff | `/portal/staff` (`src/app/portal/staff/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_PROFILE` in `portalStaffData.ts` | No | No | `staff` | Today's periods, pending attendance, recent homework, student remarks feed. Needs real data from allocations. |
| `STA-CLA-001` | Assigned Classes & Rosters | Staff | `/portal/staff/classes` (`classes/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_ATTENDANCE_REGISTER` | No | No | `staff` | Shows Class II-A roster (32 students) with roll numbers and guardians. Must query `teacher_allocations` & `student_enrollments`. |
| `STA-CLA-002` | Class Student Search | Staff | `/portal/staff/classes` (`classes/page.tsx`) | `FRONTEND_ONLY` | In-memory filtering | No | No | `staff` | Search by student name, roll no, or scholar ID. Needs real query. |
| `STA-ATT-001` | Daily Roll Call Register | Staff | `/portal/staff/attendance` (`attendance/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_ATTENDANCE_REGISTER` | No | No | `staff` | Interactive status radio buttons ('present', 'absent', 'late') per student. Must read active session from `attendance_sessions`. |
| `STA-ATT-002` | Mark All Present Action | Staff | `/portal/staff/attendance` (`attendance/page.tsx`) | `FRONTEND_ONLY` | Client state (`setRegister`) | No | No | `staff` | One-click button marking all 20 demo students present. Must update state bound to submission form. |
| `STA-ATT-003` | Save Attendance Register | Staff | `/portal/staff/attendance` (`attendance/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `staff` | Toast: "saved locally (Demo simulation — no database record altered)". Must insert/upsert into `attendance_records`. |
| `STA-HWK-001` | Homework Diary List | Staff | `/portal/staff/homework` (`homework/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_HOMEWORK_LIST` in `portalStaffData.ts` | No | No | `staff` | List of assigned tasks, due dates, submission counters. Must query `public.homework`. |
| `STA-HWK-002` | New Homework Assignment Modal | Staff | `/portal/staff/homework` (`homework/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `staff` | Form with title, subject, grade, due date, instructions. Prepends to local state. Must insert into `homework`. |
| `STA-HWK-003` | Homework Submissions Modal | Staff | `/portal/staff/homework` (`homework/page.tsx`) | `FRONTEND_ONLY` | Mock dialog | No | No | `staff` | Shows student submission status. Must query `public.homework_submissions`. |
| `STA-ASM-001` | Terminal Marks Roster | Staff | `/portal/staff/assessments` (`assessments/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_MARKS_ROSTER` in `portalStaffData.ts` | No | No | `staff` | Student marks table for Term 1 English (Full marks 50). Must query `assessments` and `assessment_marks`. |
| `STA-ASM-002` | Score Entry & Auto-Grade Calc | Staff | `/portal/staff/assessments` (`assessments/page.tsx`) | `FRONTEND_ONLY` | Client computation (`calculateGrade`) | No | No | `staff` | Real-time grade letter computation (A+, A, B+, B, C, D) as marks are typed. Client logic complete. |
| `STA-ASM-003` | Save Assessment Marks Action | Staff | `/portal/staff/assessments` (`assessments/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `staff` | Toast: "saved locally (Demo simulation — no database altered)". Must upsert into `public.assessment_marks`. |
| `STA-REM-001` | Student Remarks Roster | Staff | `/portal/staff/remarks` (`remarks/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_STUDENT_REMARKS` | No | No | `staff` | Behavioral and academic remarks feed with visibility badges. Must read `public.student_remarks`. |
| `STA-REM-002` | Add Student Remark Dialog | Staff | `/portal/staff/remarks` (`remarks/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `staff` | Modal collecting student, category, text, visibility. Must insert into `student_remarks`. |
| `STA-PRF-001` | Staff Teacher Profile View | Staff | `/portal/staff/profile` (`profile/page.tsx`) | `MOCK_OR_DEMO_DATA` | `STAFF_PROFILE` in `portalStaffData.ts` | No | No | `staff` | Teacher name, employee ID, assigned subjects, phone. Must query `staff_profiles` join `profiles`. |

---

### D. Parent & Guardian Portal (Features 81–96)

| Feature ID | Feature Name | Role | Route & Source Files | Implementation Status | Data Source & Tables | Reads Supabase | Writes Supabase | Required Role | Summary & Remaining Work |
|---|---|---|---|---|---|---|---|---|---|
| `PAR-NAV-001` | Parent Sidebar Navigation | Parent | `/portal/parent/*` (`ParentSidebar.tsx`) | `FRONTEND_ONLY` | Static menu items | No | No | `parent` | Sidebar with Attendance, Homework, Report Cards, Fees, Leave, Notices, Contact. Complete frontend. |
| `PAR-NAV-002` | Parent Topbar | Parent | `/portal/parent/*` (`ParentTopbar.tsx`) | `FRONTEND_ONLY` | Static metadata | No | No | `parent` | Shows school session, guardian avatar, mobile trigger. Complete frontend. |
| `PAR-CTX-001` | Sibling Context Switcher | Parent | Global context (`ParentContext.tsx`, `page.tsx`) | `MOCK_OR_DEMO_DATA` | `SIBLING_CHILDREN` in `portalParentData.ts` | No | No | `parent` | Switches active child between Aarav Sen (Class II) and Diya Sen (Nursery). Must query `get_my_guardian_children_ids()`. |
| `PAR-DSH-001` | Child Overview Dashboard | Parent | `/portal/parent` (`src/app/portal/parent/page.tsx`) | `MOCK_OR_DEMO_DATA` | Selected child in `portalParentData.ts` | No | No | `parent` | Scholar ID, roll no, mentor, attendance % (92.5%), active homework (3), fee status. Must query student summary. |
| `PAR-ATT-001` | Student Attendance Calendar | Parent | `/portal/parent/attendance` (`attendance/page.tsx`) | `MOCK_OR_DEMO_DATA` | `PARENT_ATTENDANCE_HISTORY` | No | No | `parent` | Monthly presence breakdown, working days, excused leaves. Must query `public.attendance_records` for linked child. |
| `PAR-HWK-001` | Daily Homework Diary | Parent | `/portal/parent/homework` (`homework/page.tsx`) | `MOCK_OR_DEMO_DATA` | `PARENT_HOMEWORK_ITEMS` | No | No | `parent` | List of homework assignments by subject, instructions, due dates. Must query `public.homework` for child's section. |
| `PAR-HWK-002` | Homework Worksheet Download | Parent | `/portal/parent/homework` (`homework/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `parent` | Toast: "Worksheet downloaded (sample file)". Needs real Supabase Storage download from `homework-attachments`. |
| `PAR-REP-001` | Terminal Report Card Viewer | Parent | `/portal/parent/report-cards` (`report-cards/page.tsx`) | `MOCK_OR_DEMO_DATA` | `PARENT_REPORT_CARDS` | No | No | `parent` | Itemized marks, full marks, letter grades, mentor observations. Must query published `assessment_marks` / `report_cards`. |
| `PAR-REP-002` | Report Card PDF Download | Parent | `/portal/parent/report-cards` (`report-cards/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `parent` | Toast: "downloaded as PDF (Sample representation)". Needs PDF generation or Supabase Storage `report-cards` download. |
| `PAR-FEE-001` | Fee Invoices & Payment Ledger | Parent | `/portal/parent/fees` (`fees/page.tsx`) | `MOCK_OR_DEMO_DATA` | `PARENT_FEE_INVOICES` | No | No | `parent` | Term invoice list, paid receipts, due amounts. Must query `public.invoices` where `is_guardian_of(student_id)`. |
| `PAR-FEE-002` | Fee Invoice Itemized Breakdown | Parent | `/portal/parent/fees` (`fees/page.tsx`) | `FRONTEND_ONLY` | Selected demo invoice breakdown | No | No | `parent` | Modal showing tuition, activity, tiffin breakdown. Must query `invoice_items`. |
| `PAR-FEE-003` | Fee Payment Gateway Simulation | Parent | `/portal/parent/fees` (`fees/page.tsx`) | `FRONTEND_ONLY` | Mock toast notification | No | No | `parent` | Simulates payment gateway with toast. Needs real payment gateway integration (UPI / Razorpay / counter vouchers). |
| `PAR-ABS-001` | Leave Applications History | Parent | `/portal/parent/absence` (`absence/page.tsx`) | `MOCK_OR_DEMO_DATA` | `PARENT_ABSENCE_REQUESTS` | No | No | `parent` | List of past absence requests and approval status. Must query `public.absence_requests`. |
| `PAR-ABS-002` | Apply for Student Leave Form | Parent | `/portal/parent/absence` (`absence/page.tsx`) | `FRONTEND_ONLY` | Client state (`useState`) | No | No | `parent` | Modal collecting dates, category, reason. Prepends locally. Must insert into `public.absence_requests`. |
| `PAR-NOT-001` | Parent Bulletins & Notices | Parent | `/portal/parent/notices` (`notices/page.tsx`) | `MOCK_OR_DEMO_DATA` | `NOTICES_AND_EVENTS` | No | No | `parent` | Parent-targeted circulars, exam dates, vacation schedules. Must query `public.notices` for audience `Parents Only`. |
| `PAR-CON-001` | School & Class Mentor Contact | Parent | `/portal/parent/contact` (`contact/page.tsx`) | `FRONTEND_ONLY` | Static contact cards | No | No | `parent` | Mentor phone, office hours, campus desk. Working in frontend. |

---

### E. Legacy Routes (Features 97–101)

| Feature ID | Feature Name | Role | Route & Source Files | Implementation Status | Data Source & Tables | Reads Supabase | Writes Supabase | Required Role | Summary & Remaining Work |
|---|---|---|---|---|---|---|---|---|---|
| `LEG-ADM-001` | Legacy Admin Overview | Admin | `/admin` (`src/app/admin/page.tsx`) | `FRONTEND_ONLY` | Hardcoded demo metrics | No | No | None | Prototype route displaying legacy banner pointing to `/portal/admin`. Functional prototype. |
| `LEG-ADM-002` | Legacy Admin Admissions | Admin | `/admin/admissions` (`admin/admissions/page.tsx`) | `FRONTEND_ONLY` | `SAMPLE_ADMISSIONS` | No | No | None | Prototype admissions queue pointing to `/portal/admin/admissions`. |
| `LEG-PAR-001` | Legacy Parent Overview | Parent | `/parent` (`src/app/parent/page.tsx`) | `FRONTEND_ONLY` | Hardcoded demo student | No | No | None | Prototype dashboard pointing to `/portal/parent`. |
| `LEG-PAR-002` | Legacy Parent Attendance | Parent | `/parent/attendance` (`parent/attendance/page.tsx`) | `FRONTEND_ONLY` | `SAMPLE_ATTENDANCE_MONTH` | No | No | None | Prototype attendance view. |
| `LEG-PAR-003` | Legacy Parent Homework | Parent | `/parent/homework` (`parent/homework/page.tsx`) | `FRONTEND_ONLY` | Static demo homework items | No | No | None | Prototype homework view. |

---

## 3. Summary of Implementation Counts

- **Total Features Cataloged:** `102`
- **Working Real Backend (`WORKING_REAL_BACKEND`):** `4` (3.9% — `AUTH-001`, `AUTH-002`, `AUTH-003`, `AUTH-004`)
- **Partially Implemented (`PARTIAL`):** `0` (0.0%)
- **Frontend Only / Mock Data (`FRONTEND_ONLY` / `MOCK_OR_DEMO_DATA`):** `91` (89.2%)
- **Placeholder Modules (`PLACEHOLDER`):** `7` (6.9%)
- **Critical Flaws / Broken (`BROKEN`):** `0` (0.0% — `AUTH-003` resolved via `src/proxy.ts` and server layout guards)
