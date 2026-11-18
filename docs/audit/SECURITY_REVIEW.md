# Shishutirtha — Security Advisor Findings & Security Architecture Review

**Document:** `docs/audit/SECURITY_REVIEW.md`  
**Phase:** Phase 3B (Authentication, Role Authorization & Security Remediation)  
**Date:** October 23, 2026  
**Status:** **AUDITED • REMEDIATION MIGRATION PREPARED (`20261023000001_security_advisor_remediation.sql`)**

---

## 1. Executive Security Analysis

Supabase Security Advisor and PostgreSQL best practices require that:
1. Functions (especially `SECURITY DEFINER` functions) specify an explicit, immutable `search_path` to prevent search_path hijacking attacks.
2. In accordance with the Principle of Least Privilege, internal functions and database triggers should not be executable by client roles (`PUBLIC`, `anon`, `authenticated`).
3. RLS helper functions must retain execution privileges for `authenticated` users so that row-level policies evaluate without permission denied errors, while remaining inaccessible to `anon` or `PUBLIC`.

The audit verified all 18 functions defined across the Shishutirtha schema migrations, resolving the 8 mutable `search_path` warnings and 11 `SECURITY DEFINER` execution findings without weakening RLS policies.

---

## 2. Function Audit & Classification Matrix

| # | Function Signature | Classification | Pre-Audit search_path | Pre-Audit Grants | Remediation Applied in `20261023000001` | RLS Policy Impact & Caller Context |
|---|---|---|---|---|---|---|
| 1 | `try_cast_uuid(text)` | Public Storage Utility | *None* (Mutable) | `PUBLIC` | `SET search_path = ''`; `GRANT EXECUTE TO anon, authenticated` | Needed by storage RLS policies (`student-documents`, `report-cards`, `homework-attachments`, `public-media`) to safely parse folder UUIDs without runtime casting crashes. |
| 2 | `protect_audit_log_immutability()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = ''`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.audit_logs`. Should never be directly callable via PostgREST RPC. Runs under table context. |
| 3 | `check_attendance_enrollment()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.attendance_records`. Prevents marking attendance for non-enrolled students. Trigger-only. |
| 4 | `check_assessment_mark_enrollment()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.assessment_marks`. Prevents entering marks for non-enrolled students. Trigger-only. |
| 5 | `protect_receipt_immutability()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.payments`. Forbids changing receipt numbers or payment amounts. Trigger-only. |
| 6 | `protect_payment_deletion()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = ''`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.payments`. Forbids deleting fee receipts. Trigger-only. |
| 7 | `sync_invoice_payment_allocation()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.payment_allocations`. Recalculates invoice paid balances and status. Trigger-only. |
| 8 | `handle_admissions_application_insert()` | Trigger-Only Function | *None* (Mutable) | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.admissions_applications`. Auto-generates application numbers and prevents unauthenticated privilege forging. Trigger-only. |
| 9 | `guard_profile_role_update()` | Trigger-Only Function | `public` | `PUBLIC` | `SET search_path = public`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `public.profiles`. Prevents users from self-promoting to `admin` or altering `id`. Trigger-only. |
| 10 | `handle_new_auth_user()` | Auth Trigger Function | `public` | `PUBLIC` | `SET search_path = public, auth`; `REVOKE ALL FROM PUBLIC, anon, authenticated` | Trigger on `auth.users`. Automatically provisions new profiles with `role = 'parent'`. Trigger-only. |
| 11 | `current_user_role()` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Used by RLS policies to check the active user role. Revoked from anon. |
| 12 | `is_admin()` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Used by RLS policies across 25 tables. Must be executable by `authenticated` to evaluate admin policies. |
| 13 | `is_staff()` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Used by staff RLS policies (`assessments`, `attendance_records`, `homework`, `notices`). |
| 14 | `is_parent()` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Used by parent RLS policies (`notices`, `student_remarks`). |
| 15 | `is_guardian_of(uuid)` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Enforces student-guardian isolation across invoices, payments, attendance, report cards. |
| 16 | `get_my_guardian_children_ids()` | RLS Helper / Table RPC | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Enables verified parents to fetch their enrolled linked child IDs. |
| 17 | `is_teacher_of_section(uuid)` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Checks whether staff is class teacher or subject teacher for section. |
| 18 | `is_teacher_of_student(uuid)` | RLS Helper | `public` | `PUBLIC` | `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO authenticated` | Checks whether teacher instructs a section where student is actively enrolled. |

---

## 3. Remediation Migration

The corrections are codified in the new reviewed migration:
📁 [`supabase/migrations/20261023000001_security_advisor_remediation.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261023000001_security_advisor_remediation.sql)

### Safety Guarantees:
- **Historical Migration Protection:** Historical migrations `20261022000001` through `20261022000007` are completely untouched.
- **Dry-Run Validation:** `npx supabase db push --dry-run` successfully verified the syntax and detected `20261023000001_security_advisor_remediation.sql` with Exit Code 0.
- **Deployment Control:** Migration will not be applied to the remote database until explicitly scheduled.

---

## 4. Application-Layer Security Architecture

### A. Next.js 16 Edge Proxy (`src/proxy.ts`)
- Implemented per the Next.js 16 file convention (renamed from `middleware.ts`).
- Executes `updateSession()` using `@supabase/ssr` cookies before route completion.
- Revalidates the user token with `supabase.auth.getUser()`.
- Unauthenticated requests targeting `/portal/*`, `/admin/*`, or `/parent/*` are immediately redirected to `/login`.
- **Open Redirect Protection:** Validates that `redirect` query parameters are strictly internal paths (`starts with '/'` and does not contain `//` or protocols `http:`, `https:`). External URLs are discarded.

### B. Server-Side Portal Layout Guards (`src/lib/auth/authorization.ts`)
Proxy acts as an initial routing guard, but layout-level Server Components provide deep defense-in-depth:
- `/portal/admin/*` and `/portal/council/*` execute `await requireAdmin()`.
- `/portal/staff/*` executes `await requireStaff()`.
- `/portal/parent/*` executes `await requireParent()`.
- If an authenticated parent attempts to manually load `/portal/admin`, `requireAdmin()` detects `profile.role !== 'admin'` and redirects the user to `/portal/parent`. No private administrative RSC payload or HTML is rendered.

### C. Secure Login & Inactive Account Protection
- `src/app/login/page.tsx` uses `supabase.auth.signInWithPassword()`.
- Displays a generic error message (`Invalid email or password`) for authentication failures to prevent account enumeration.
- Verifies `profile.is_active === true`. Deactivated accounts are immediately signed out.
- The prototype role switcher is gated behind `process.env.NODE_ENV !== 'production'`. In production, the switcher is omitted and users must input real credentials.

---

## 5. One-Time Initial Administrator Provisioning Procedure

To prevent public privilege escalation, public registration assigns `role = 'parent'`. To bootstrap the first administrative account:

1. **Create User in Supabase Auth:**
   The School Council designates an official email (e.g., `council@shishutirtha.org`). The account is created through the Supabase Dashboard Authentication panel or invited via administrative CLI.
2. **Promote Profile via Database Superuser Context:**
   Run the following query in the **Supabase Dashboard SQL Editor** (executing as `postgres` superuser):
   ```sql
   UPDATE public.profiles
   SET role = 'admin', is_active = true
   WHERE email = 'council@shishutirtha.org';
   ```
3. **Subsequent Accounts:**
   Once the initial administrator is created, all subsequent staff and administrator accounts are provisioned via `/portal/admin/faculty`. The database trigger `guard_profile_role_update` allows role modifications because the acting session passes `public.is_admin() === true`.
