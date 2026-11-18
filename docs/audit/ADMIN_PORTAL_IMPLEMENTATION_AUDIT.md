# Sainthia Shishutirtha — Admin Portal Implementation Audit

**Document:** `docs/audit/ADMIN_PORTAL_IMPLEMENTATION_AUDIT.md`  
**Phase:** Phase 4A — Admin-First School Management Implementation  
**Date:** October 23, 2026  
**Status:** **AUDITED — READ-ONLY BASELINE ESTABLISHED**  
**Linked Remote Project:** `tybaaqktbdlnqsgodkek` (`sainthiashishutirtha`, `ap-south-1`)  
**Database Host:** `db.tybaaqktbdlnqsgodkek.supabase.co` (PostgreSQL 17.11.0.003)  
**Target Administrator:** `wasimakhtar.me@gmail.com`  

---

## 1. Executive Summary

This audit establishes the comprehensive baseline of the Sainthia Shishutirtha application as it transitions from a prototype with mock UI fixtures to a fully operational, production-grade school management system.

### Key Discoveries:
1. **Initial Auth User Verified:** User `wasimakhtar.me@gmail.com` exists in `auth.users` with UUID `e67f0c0c-0b2e-46c1-8adc-3599c74d6165` and confirmed email.
2. **Profile Role Status:** The user's row in `public.profiles` currently has `role = 'parent'`. This was automatically assigned by the database trigger `on_auth_user_created` (`public.handle_new_auth_user()`). This accurately explains why the user is redirected to `/portal/parent` upon login.
3. **Database Population:** The remote database is completely empty: exactly **0** students, **0** academic years, **0** classes, **0** sections, **0** fee structures, **0** invoices, **0** payments, **0** staff profiles, and **0** notices.
4. **Admin Portal UI Mocks:** All routes under `/portal/admin/*` currently render hardcoded sample fixtures from `src/data/portalAdminData.ts` and `src/data/councilDemoData.ts`. Buttons like "New Admission Entry", "Add Faculty Member", "Record Manual Payment", and "Export" only trigger simulated timeout toasts without calling Supabase.
5. **Architectural Readiness:** The database schema has all 32 required tables in place with RLS enabled (`relrowsecurity = true`), 81 public policies, 10 storage policies, hardened `search_path` configurations, and Next.js 16 server-side role guards (`requireAdmin`).

---

## 2. Authentication, Session & Routing Architecture

### 2.1 Login & Session Lifecycle
- **Browser Client:** [`src/lib/supabase/client.ts`](file:///d:/sainthiashishutirtha/src/lib/supabase/client.ts) initializes `@supabase/ssr` `createBrowserClient<Database>()`.
- **Server Client:** [`src/lib/supabase/server.ts`](file:///d:/sainthiashishutirtha/src/lib/supabase/server.ts) initializes `@supabase/ssr` `createServerClient<Database>()` using Next.js 16 asynchronous cookie store (`await cookies()`).
- **Edge Route Protection:** [`src/proxy.ts`](file:///d:/sainthiashishutirtha/src/proxy.ts) intercepts requests to `/portal/*` and legacy `/admin`, `/parent`. It invokes `updateSession()` to sync auth cookies and redirects unauthenticated visitors to `/login?redirect=...`.
- **Open Redirect Defense:** [`src/proxy.ts`](file:///d:/sainthiashishutirtha/src/proxy.ts) and [`src/app/login/page.tsx`](file:///d:/sainthiashishutirtha/src/app/login/page.tsx) enforce `isValidInternalRedirect()`, discarding external protocol URLs (`http:`, `https:`, `//`).

### 2.2 Deep Server-Side Role Enforcement
- Defined in [`src/lib/auth/authorization.ts`](file:///d:/sainthiashishutirtha/src/lib/auth/authorization.ts).
- `getAuthenticatedUser()`: Retrieves `auth.users` record via `supabase.auth.getUser()`.
- `getCurrentProfile()`: Queries `public.profiles` for the active user.
- `requireRole(allowedRoles)`:
  - If unauthenticated, redirects to `/login`.
  - If `profile.is_active === false`, redirects to `/login?error=account_deactivated`.
  - If `profile.role` is not in `allowedRoles`, redirects to the portal matching their actual database role:
    - `admin` -> `/portal/admin`
    - `staff` -> `/portal/staff`
    - `parent` -> `/portal/parent`
- Layout guards for both `/portal/admin/layout.tsx` and `/portal/council/layout.tsx` execute `await requireAdmin()`. Non-administrators cannot render administrative RSC payloads or access data.

### 2.3 Role Escalation & Identity Protection Triggers
- `on_auth_user_created` fires `AFTER INSERT ON auth.users`: Executes [`public.handle_new_auth_user()`](file:///d:/sainthiashishutirtha/supabase/migrations/20261022000001_core_identity_and_roles.sql#L258-L289). Sets `role = 'parent'` unconditionally; ignores user metadata to block client privilege self-assignment.
- `trg_guard_profile_role_update` fires `BEFORE UPDATE ON public.profiles`: Executes [`public.guard_profile_role_update()`](file:///d:/sainthiashishutirtha/supabase/migrations/20261022000001_core_identity_and_roles.sql#L204-L233). Forbids changing `id`. If `role` or `is_active` changes, requires `public.is_admin() === true`.

---

## 3. Route-by-Route Implementation Inventory

| Route | Primary Responsibility | Current Data Source | Functional Status | Classification |
|---|---|---|---|---|
| `/login` | Password sign-in & role routing | Supabase Auth + `public.profiles` | Real password auth; profile verification; dynamic routing | **Working with real Supabase data** |
| `/auth/signout` | Server-side cookie clear & session revoke | Supabase Auth (`signOut()`) | Clears cookies, issues 303 redirect to `/login` | **Working with real Supabase data** |
| `/portal/admin` | Executive institutional oversight | Hardcoded `COUNCIL_KPIS` in `councilDemoData.ts` | Renders mock stats (342 students, ₹18.42L fees, 89.2% attendance) | **Using dummy/mock data** |
| `/portal/admin/students` | Student Information System (SIS) | `ADMIN_STUDENTS_LIST` in `portalAdminData.ts` | Search/filter works on 8 mock rows; "New Admission" shows mock toast | **Using dummy/mock data & UI-only** |
| `/portal/admin/faculty` | Staff directory & role permissions | `ADMIN_FACULTY_LIST` in `portalAdminData.ts` | Search works on mock faculty; "Add Faculty" shows mock toast | **Using dummy/mock data & UI-only** |
| `/portal/admin/academics` | Classes, sections, subjects, years | `ACADEMIC_CLASSES` constant array in `page.tsx` | Static standard cards; no creation forms or database connection | **Using dummy/mock data & UI-only** |
| `/portal/admin/admissions` | Online application review pipeline | `ADMIN_ADMISSIONS_LIST` in `portalAdminData.ts` | Stage filter works on 8 mock applications; no state transitions | **Using dummy/mock data & UI-only** |
| `/portal/admin/attendance` | Campus attendance telemetry | `COUNCIL_ATTENDANCE_SNAPSHOT` & `absenteeSample` | Displays mock 89.2% attendance and hardcoded absentee table | **Using dummy/mock data & UI-only** |
| `/portal/admin/finance` | Fee invoicing, receipts & dues | `ADMIN_FEE_TRANSACTIONS` & `COUNCIL_FEE_SUMMARY` | Mock collection bars; "Record Manual Payment" shows mock toast | **Using dummy/mock data & UI-only** |
| `/portal/admin/reports` | U-DISE & compliance reporting | Static `reportItems` array in `page.tsx` | Download buttons trigger mock simulation toast | **UI-only or nonfunctional** |
| `/portal/admin/settings` | School identity & session settings | Local React `useState` defaults in `page.tsx` | Save button triggers mock toast; does not write to `school_settings` | **UI-only or nonfunctional** |
| `/portal/admin/website` | Noticeboard CMS & publications | `ADMIN_CMS_NOTICES` in `portalAdminData.ts` | "Create Notice" adds to local React state only; no DB persistence | **Using dummy/mock data & UI-only** |
| `/portal/council` | Governing council dashboard | `COUNCIL_KPIS` in `councilDemoData.ts` | Renders mock council metrics and shortcuts | **Using dummy/mock data** |
| `/portal/staff` | Teacher daily classroom register | `portalStaffData.ts` | Mock teacher schedule, attendance roster, and marks entry | **Using dummy/mock data & UI-only** |
| `/portal/parent` | Guardian child monitoring portal | `portalParentData.ts` | Mock children (Aarav, Ananya), mock fees, and mock diary remarks | **Using dummy/mock data & UI-only** |
| `/` (Homepage) | Public school landing page | `src/data/schoolData.ts` | Static institutional copy, features, philosophy | **Working (Static Content)** |
| `/notices` | Public circulars bulletin | `NOTICES_AND_EVENTS` in `schoolData.ts` | Search/filter works on static notice array | **Partially implemented (Reads static copy)** |
| `/faculty` | Public teacher & staff directory | `FACULTY_MEMBERS` in `schoolData.ts` | Filter works on static faculty array | **Partially implemented (Reads static copy)** |
| `/academics` | Public curriculum overview | Static copy in `schoolData.ts` | Static presentation of primary curriculum | **Working (Static Content)** |
| `/admissions` | Public admission criteria & form | Static copy + `AdmissionModal.tsx` | Modal form renders; submits mock data | **UI-only or nonfunctional** |

---

## 4. Hardcoded Sample & Demo Data Inventory

| File Path | Variable / Export | Purpose / Contents | Strategy for Removal / Replacement |
|---|---|---|---|
| `src/data/portalAdminData.ts` | `ADMIN_STUDENTS_LIST` | 8 mock student records with scholar IDs and fee statuses | Replace with real query on `public.students` + `public.student_enrollments`. Show honest empty state when 0 scholars exist. |
| `src/data/portalAdminData.ts` | `ADMIN_FACULTY_LIST` | 8 mock teacher profiles with employee IDs and subjects | Replace with real query on `public.staff_profiles` + `public.profiles`. Show honest empty state. |
| `src/data/portalAdminData.ts` | `ADMIN_FEE_TRANSACTIONS` | 6 mock fee receipts with amounts and payment modes | Replace with real query on `public.payments`. Show honest zero ledger. |
| `src/data/portalAdminData.ts` | `ADMIN_ADMISSIONS_LIST` | 8 mock admission applications with stages | Replace with real query on `public.admissions_applications`. Show honest empty pipeline. |
| `src/data/portalAdminData.ts` | `ADMIN_CMS_NOTICES` | 5 mock circulars and bulletins | Replace with real query on `public.notices`. Show honest empty noticeboard. |
| `src/data/councilDemoData.ts` | `COUNCIL_KPIS` | Fabricated 342 scholars, 22 staff, 89.2% attendance, ₹18.42L | Replace with database aggregate queries (`count(*)`). Show real zeros when database is unpopulated. |
| `src/data/councilDemoData.ts` | `COUNCIL_ATTENDANCE_SNAPSHOT` | Fabricated grade-wise attendance counts | Replace with query on `public.attendance_sessions` for `current_date`. Show "No sessions today". |
| `src/data/councilDemoData.ts` | `COUNCIL_FEE_SUMMARY` | Fabricated ₹24.8L billed, ₹18.4L collected | Replace with SUM queries on `invoices` and `payments`. |
| `src/app/portal/admin/academics/page.tsx` | `ACADEMIC_CLASSES` | Hardcoded standard cards (Pre-Primary through Class IV) | Replace with query on `public.classes` and `public.sections`. Provide "Add Class" workflow. |
| `src/app/portal/admin/attendance/page.tsx` | `absenteeSample` | 4 hardcoded absentee students with phone numbers | Replace with query on `public.attendance_records` where `status = 'absent'`. |
| `src/app/portal/admin/reports/page.tsx` | `reportItems` | 4 hardcoded report packages | Replace with real report generation queries. |

---

## 5. Live Database State vs. Target Requirements

### 5.1 Remote Database Object Counts (Live Verified via Management API)
- `auth.users`: **1** (`wasimakhtar.me@gmail.com`)
- `public.profiles`: **1** (`role = 'parent'`, `is_active = true`)
- `public.students`: **0**
- `public.academic_years`: **0**
- `public.classes`: **0**
- `public.sections`: **0**
- `public.fee_heads`: **0**
- `public.fee_structures`: **0**
- `public.invoices`: **0**
- `public.payments`: **0**
- `public.notices`: **0**
- `public.staff_profiles`: **0**

### 5.2 Key Requirement: Honest Empty States
Because the school database contains zero student or financial records, displaying 342 students or ₹18.42L collected is misleading. The application must display honest, actionable empty states:
- *"No students have been enrolled yet. Click 'Register Student' to enroll the first scholar."*
- *"No academic year configured. Please configure an active academic session to begin operations."*
- *"No fee structures defined. Configure fee heads and term schedules in Financial Treasury."*
- *"Zero payment collections recorded for this session."*

---

## 6. Build, Typecheck & Quality Baseline

- **TypeScript Typecheck:** `npx tsc --noEmit` exits with **Code 0** (0 errors).
- **ESLint:** `npm run lint` exits with **Code 0** (0 errors, 0 warnings).
- **Next.js Production Build:** `npm run build` exits with **Code 0** across all 62 routes.
- **Git Working Tree:** Preserved clean on branch `main` with uncommitted files tracked safely.
