# Sainthia Shishu Tirtha — Milestone 5 Implementation Report

**Date:** October 29, 2026  
**Status:** Code Complete, Hardened & Validated — **Ready for Final Production Review**  
**Target Repository:** `D:\sainthiashishutirtha`  
**Supabase Project Reference:** `tybaaqktbdlnqsgodkek` (Region: `ap-south-1` Mumbai)  
**Framework:** Next.js 16.4.2 App Router, React 19.3.0, TypeScript 5, Supabase SSR

---

## 1. Executive Summary

Milestone 5 and 5B implement the verified Phase 1 public admissions and contact intake integration for **Sainthia Shishu Tirtha**. Following an in-depth security and privilege audit, the architecture was remediated to eliminate direct PostgREST bypass paths and enforce least privilege across all database and application boundaries:

1. **Zero Anonymous Direct Access**: Role `anon` has **zero** direct EXECUTE access on `public.submit_admission_enquiry()` and **zero** direct access on `public.contact_inquiries` (no SELECT, INSERT, UPDATE, or DELETE). Direct PostgREST intake bypass by external bots is completely rejected with HTTP `403 Forbidden` (`42501 permission denied`).
2. **Server-Only Privileged Client (`src/lib/supabase/admin.ts`)**: Public intake is strictly mediated by protected Next.js Server Actions using a server-only client initialized with `SUPABASE_SERVICE_ROLE_KEY`. The module is protected by `import 'server-only';` to ensure it can never be bundled into client-side JavaScript.
3. **Four-Stage Intake Pipeline**: Every public enquiry passes through server-side bot honeypot detection (`website_hp`), sliding-window rate limiting, input normalization (Indian phone format, candidate age 2–18 years), and privileged dispatch under `service_role`.
4. **Information Leak Elimination**: The RPC strictly returns `{ "success": true, "application_no": "ADM-2026-XXXXX" }`. Internal primary key UUIDs (`id`) are withheld from public callers.
5. **Class I Integrity & Section Preservation**: The Class I in-place update is encapsulated within an atomic `DO $$ ... $$` PL/pgSQL block with strict precondition assertions. It verified that exactly one target record exists matching confirmed UUID `58c9e01e-f6cc-4bc0-9d93-277d50b9935b`, preserving existing Section `A` relationships without disruption.
6. **Multi-Layer Admin Authorization**: Admin Admissions management enforces `requireAdmin()` at the route layout level ([`src/app/portal/admin/layout.tsx`](file:///d:/sainthiashishutirtha/src/app/portal/admin/layout.tsx)), the server action level ([`admissionsActions.ts`](file:///d:/sainthiashishutirtha/src/lib/actions/admissionsActions.ts)), and the database level (RLS `is_admin()`).
7. **Disposable Local Validation**: The complete migration and security boundaries were validated against a disposable PostgreSQL 18.6 WebAssembly instance using `@electric-sql/pglite`. All 8 local database tests passed.
8. **Strict Safety Protocol**: **No migrations were applied to the remote Supabase database** (`tybaaqktbdlnqsgodkek`) and no production data was modified.

---

## 2. Files Modified and Created

### A. Database Migrations
- **Hardened**: [`supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql)  
  *Precondition-guarded Class I update, idempotent 8-class seed, explicit revocation of `PUBLIC`, `anon`, and `authenticated` intake grants, exclusive intake rights granted to `service_role`, hardened `SECURITY DEFINER` trigger with fixed `search_path = public, pg_temp` and explicit trigger binding, and hardened `submit_admission_enquiry` RPC enforcing age 2–18.*

### B. Server-Only Client Infrastructure
- **Created**: [`src/lib/supabase/admin.ts`](file:///d:/sainthiashishutirtha/src/lib/supabase/admin.ts)  
  *Server-only Supabase client initialized with `SUPABASE_SERVICE_ROLE_KEY`. Protected with `import 'server-only';` to prevent client bundling.*

### C. Server-Side Actions & Services
- **Hardened**: [`src/lib/actions/admissionsActions.ts`](file:///d:/sainthiashishutirtha/src/lib/actions/admissionsActions.ts)  
  *Dispatches public intake via `getAdminClient()` (`service_role`); retains honeypot check, rate limiting, and candidate age validation (2–18 yrs); admin queries and stage progression strictly enforce `requireAdmin()` and use session cookies (`createClient()`).*
- **Hardened**: [`src/lib/actions/contactActions.ts`](file:///d:/sainthiashishutirtha/src/lib/actions/contactActions.ts)  
  *Dispatches public inquiries via `getAdminClient()` (`service_role`); retains honeypot and rate limiting; status defaults to `'New'`.*
- **Created**: [`src/lib/services/rateLimiter.ts`](file:///d:/sainthiashishutirtha/src/lib/services/rateLimiter.ts)  
  *In-memory sliding window rate limiter (5 requests per 15 minutes) with documented architectural constraints.*

### D. Verification Suites
- **Created**: [`tests/milestone5_migration_validation.mjs`](file:///d:/sainthiashishutirtha/tests/milestone5_migration_validation.mjs)  
  *Disposable database validation suite using `@electric-sql/pglite` (PostgreSQL 18.6). Tests migration application, Class 1 UUID preservation, direct PostgREST anon rejection, service_role privileged intake, admin stage progression, RPC boundary checks, and safe rollback.*
- **Created**: [`tests/milestone5_verification.mjs`](file:///d:/sainthiashishutirtha/tests/milestone5_verification.mjs)  
  *Static analysis and integration test suite covering sliding window rate limiter, Indian mobile normalization, candidate age boundaries (2–18 yrs), 8-class alignment, honeypot traps, SQL migration preconditions & privilege audits, live Supabase anonymous isolation, server-only client isolation, and admin layout/action guards.*

---

## 3. Threat Model & Least-Privilege Architecture

```
                              [ ATTACK PATH: DIRECT POSTGREST BYPASS (BLOCKED) ]
                                  
  ┌──────────────────┐           HTTP POST /rest/v1/rpc/submit_admission_enquiry          ┌──────────────────────┐
  │  Malicious Bot   │ ─────────────────────────────────────────────────────────────────> │   Supabase Cloud     │
  │  or Attacker     │           HTTP POST /rest/v1/contact_inquiries                     │   PostgREST Gateway  │
  └──────────────────┘          Headers: apikey = NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY    └──────────┬───────────┘
                                                                                                     │
                                          🛑 403 Forbidden (42501 permission denied)                 │ Blocked by Postgres
                                          🛑 anon has ZERO EXECUTE / INSERT rights                    ▼
                                                                                          ┌──────────────────────┐
                                                                                          │ PostgreSQL Database  │
                                                                                          │ (Intake Unreached)   │
                                                                                          └──────────────────────┘
  ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
                              [ INTENDED DEFENSIVE PATH: SERVER ACTION ]
                                  
  ┌──────────────────┐               1. Form Submission (Server Action)                   ┌──────────────────────┐
  │ Legitimate User  │ ─────────────────────────────────────────────────────────────────> │   Next.js Server     │
  │ (Web Browser)    │                                                                    │   (Server Action)    │
  └──────────────────┘                                                                    └──────────┬───────────┘
                                                                                                     │
                                          ✓ 1. Honeypot verified (silent bot drop)                   │ 2. Privileged intake
                                          ✓ 2. Rate limit verified (IP sliding window)               │    via service_role
                                          ✓ 3. Input sanitized & normalized                          ▼
                                                                                          ┌──────────────────────┐
                                                                                          │   Supabase Cloud     │
                                                                                          │ (service_role only)  │
                                                                                          └──────────────────────┘
```

1. **Admissions RPC Privileges**:
   - `anon`: Revoked.
   - `authenticated`: Revoked.
   - `PUBLIC`: Revoked.
   - `service_role`: Granted `EXECUTE`.
2. **Contact Inquiries Table Privileges**:
   - `anon`: Revoked (no SELECT, INSERT, UPDATE, or DELETE).
   - `authenticated`: Granted `ALL` (subject to RLS `is_admin()`).
   - `service_role`: Granted `ALL`.
3. **Admin Queries**:
   - `getAdminAdmissionsApplications` and `updateAdminAdmissionStage` use `createClient()` with authenticated cookies and enforce `requireAdmin()`. They never use `service_role`, ensuring that all administrative actions are attributable and subject to RLS.

---

## 4. Unapplied Database Migration (Awaiting Approval)

Prepared locally at [`supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql):

```sql
-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261029000001_public_admissions_and_contact_intake.sql
-- Description: Phase 1 public website admissions and contact intake integration.
--              1. Create public.contact_inquiries table with boundary checks, strict RLS,
--                 and column-level INSERT privileges (direct anon access revoked).
--              2. Align public.classes with 8 verified school tiers (Lower Nursery to Class V)
--                 with strict precondition assertion verifying exactly 1 Class 1 record
--                 (UUID: 58c9e01e-f6cc-4bc0-9d93-277d50b9935b) to preserve section linkages.
--              3. Harden handle_admissions_application_insert with SECURITY DEFINER and fixed search_path.
--              4. Audit and revoke unnecessary table/sequence privileges from both PUBLIC and anon.
--              5. Add hardened public.submit_admission_enquiry RPC returning strictly application_no
--                 (omitting internal UUID) with full database-boundary validation (age 2 to 18 years),
--                 granted exclusively to service_role for server-mediated intake.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Contact Inquiries Table with Database-Level Boundary Constraints & Strict RLS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL CHECK (char_length(trim(parent_name)) >= 2 AND char_length(trim(parent_name)) <= 100),
  phone text NOT NULL CHECK (trim(phone) ~ '^[6-9][0-9]{9}$'),
  email text CHECK (email IS NULL OR (char_length(trim(email)) <= 254 AND trim(email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  class_interest text CHECK (class_interest IS NULL OR char_length(trim(class_interest)) <= 60),
  message text CHECK (message IS NULL OR char_length(trim(message)) <= 2000),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON public.contact_inquiries(created_at DESC);

-- Enable Row Level Security on contact_inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Public can insert inquiries with initial status 'New'
DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
  ON public.contact_inquiries FOR INSERT TO public
  WITH CHECK (status = 'New');

-- Policy: Admin has full access to view, update, and manage inquiries
DROP POLICY IF EXISTS "Admin full access on contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Admin full access on contact inquiries"
  ON public.contact_inquiries FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Privilege Audit and Grant Strategy for contact_inquiries:
-- Explicitly revoke all privileges from PUBLIC, anon, and authenticated to reset inheritance
REVOKE ALL ON TABLE public.contact_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.contact_inquiries FROM authenticated;

-- Anonymous callers (anon) have ZERO direct table privileges.
-- Public intake is strictly mediated by protected Next.js Server Actions using service_role.
GRANT INSERT (parent_name, phone, email, class_interest, message)
  ON TABLE public.contact_inquiries TO service_role;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

-- Authenticated users (admin staff) have full table access (mediated by RLS public.is_admin())
GRANT ALL ON TABLE public.contact_inquiries TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Align Classes (Lower Nursery through Class V) with Precondition Integrity
-- ------------------------------------------------------------------------------
DO $$
DECLARE
  v_matching_count integer;
  v_class_id uuid := '58c9e01e-f6cc-4bc0-9d93-277d50b9935b'::uuid;
BEGIN
  -- 1. Precondition check: verify that exactly one target record exists matching the UUID or code
  SELECT COUNT(*) INTO v_matching_count
  FROM public.classes
  WHERE id = v_class_id OR code = 'CLS-1';

  IF v_matching_count <> 1 THEN
    RAISE EXCEPTION 'Migration precondition failed: Expected exactly 1 Class 1 record with id % or code CLS-1, but found %',
      v_class_id, v_matching_count;
  END IF;

  -- 2. In-place update: preserve UUID (58c9e01e-f6cc-4bc0-9d93-277d50b9935b) and section foreign keys
  UPDATE public.classes
  SET name = 'Class I',
      code = 'CLS-1',
      display_order = 4,
      wing = 'Junior Primary'
  WHERE id = v_class_id;

  -- 3. Verify exactly one row was updated
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Migration update failed: Target Class 1 record % could not be updated', v_class_id;
  END IF;
END $$;

-- Seed the remaining 7 verified classes idempotently
INSERT INTO public.classes (name, code, wing, display_order)
VALUES
  ('Lower Nursery', 'LN', 'Early Childhood', 1),
  ('U.N.', 'UN', 'Early Childhood', 2),
  ('KG', 'KG', 'Pre-Primary', 3),
  ('Class II', 'CLS-2', 'Junior Primary', 5),
  ('Class III', 'CLS-3', 'Senior Primary', 6),
  ('Class IV', 'CLS-4', 'Senior Primary', 7),
  ('Class V', 'CLS-5', 'Senior Primary', 8)
ON CONFLICT (code) DO UPDATE
  SET name = EXCLUDED.name,
      wing = EXCLUDED.wing,
      display_order = EXCLUDED.display_order;

-- ------------------------------------------------------------------------------
-- 3. Harden Admissions Trigger Function & Revoke Unnecessary Privileges
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_admissions_application_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Auto-generate official sequential application number if missing
  IF NEW.application_no IS NULL OR TRIM(NEW.application_no) = '' THEN
    NEW.application_no := 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.admissions_app_seq')::text, 5, '0');
  END IF;

  -- If not an administrator, strictly enforce public applicant constraints
  IF NOT public.is_admin() THEN
    IF NEW.stage IS NOT NULL AND NEW.stage <> 'Applied' THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot set stage to %', NEW.stage;
    END IF;
    IF NEW.status IS NOT NULL AND NEW.status <> 'Pending Review' THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot set status to %', NEW.status;
    END IF;
    IF NEW.assigned_reviewer_id IS NOT NULL OR NEW.internal_notes IS NOT NULL THEN
      RAISE EXCEPTION 'Unauthorized: public applicants cannot assign reviewers or internal notes';
    END IF;

    NEW.stage := 'Applied';
    NEW.status := 'Pending Review';
    NEW.assigned_reviewer_id := NULL;
    NEW.internal_notes := NULL;
  END IF;

  NEW.created_at := now();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Ensure trigger is active and bound to the hardened function
DROP TRIGGER IF EXISTS trg_handle_admissions_application_insert ON public.admissions_applications;
CREATE TRIGGER trg_handle_admissions_application_insert
  BEFORE INSERT ON public.admissions_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admissions_application_insert();

-- Comprehensive Privilege Audit and Revocation:
-- Explicitly revoke all table, sequence, and trigger function access from PUBLIC and anon.
-- Anonymous intake is strictly mediated by the server-only service_role executing submit_admission_enquiry().
REVOKE ALL ON TABLE public.admissions_applications FROM PUBLIC;
REVOKE ALL ON TABLE public.admissions_applications FROM anon;

REVOKE ALL ON SEQUENCE public.admissions_app_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE public.admissions_app_seq FROM anon;

REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM anon;

-- Grant permissions strictly to authenticated users (e.g. staff/admin portals via RLS) and service_role
GRANT ALL ON TABLE public.admissions_applications TO authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE public.admissions_app_seq TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_admissions_application_insert() TO authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 4. Atomic Public Admissions Intake RPC Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_admission_enquiry(
  p_academic_year_id uuid,
  p_applied_class_id uuid,
  p_candidate_first_name text,
  p_candidate_last_name text,
  p_date_of_birth date,
  p_gender text,
  p_guardian_name text,
  p_guardian_phone text,
  p_guardian_email text DEFAULT NULL,
  p_residential_address text DEFAULT 'Sainthia',
  p_previous_school text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_app_no text;
BEGIN
  -- 1. Validate Foreign Keys at Database Boundary
  IF NOT EXISTS (SELECT 1 FROM public.academic_years WHERE id = p_academic_year_id) THEN
    RAISE EXCEPTION 'Invalid academic_year_id: specified academic session does not exist';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.classes WHERE id = p_applied_class_id) THEN
    RAISE EXCEPTION 'Invalid applied_class_id: specified grade tier does not exist';
  END IF;

  -- 2. Validate Candidate Details & Text Lengths
  IF TRIM(COALESCE(p_candidate_first_name, '')) = '' OR char_length(TRIM(p_candidate_first_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate first name is required (max 60 characters)';
  END IF;

  IF TRIM(COALESCE(p_candidate_last_name, '')) = '' OR char_length(TRIM(p_candidate_last_name)) > 60 THEN
    RAISE EXCEPTION 'Candidate last name is required (max 60 characters)';
  END IF;

  -- 3. Validate Date of Birth: enforce both minimum (2 years) and maximum (18 years) age boundaries
  -- Candidate must not be born in the future, must be at least 2 years old (earliest Lower Nursery threshold),
  -- and must be at most 18 years of age.
  IF p_date_of_birth IS NULL
     OR p_date_of_birth > (current_date - interval '2 years')
     OR p_date_of_birth < (current_date - interval '18 years') THEN
    RAISE EXCEPTION 'Invalid date_of_birth: candidate must be between 2 and 18 years of age';
  END IF;

  -- 4. Validate Gender Constraint
  IF p_gender NOT IN ('Male', 'Female', 'Other') THEN
    RAISE EXCEPTION 'Invalid gender: must be Male, Female, or Other';
  END IF;

  -- 5. Validate Guardian Details & Phone Format
  IF TRIM(COALESCE(p_guardian_name, '')) = '' OR char_length(TRIM(p_guardian_name)) < 2 OR char_length(TRIM(p_guardian_name)) > 100 THEN
    RAISE EXCEPTION 'Guardian name is required (2 to 100 characters)';
  END IF;

  IF NOT (TRIM(COALESCE(p_guardian_phone, '')) ~ '^[6-9][0-9]{9}$') THEN
    RAISE EXCEPTION 'Invalid guardian phone: must be a 10-digit Indian mobile number starting with 6, 7, 8, or 9';
  END IF;

  -- 6. Validate Optional Email
  IF p_guardian_email IS NOT NULL AND TRIM(p_guardian_email) <> '' THEN
    IF char_length(TRIM(p_guardian_email)) > 254 OR NOT (TRIM(p_guardian_email) ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
      RAISE EXCEPTION 'Invalid guardian email format';
    END IF;
  END IF;

  -- 7. Validate Address and Notes Lengths
  IF char_length(TRIM(COALESCE(p_residential_address, ''))) > 300 THEN
    RAISE EXCEPTION 'Residential address exceeds maximum length of 300 characters';
  END IF;

  IF p_previous_school IS NOT NULL AND char_length(TRIM(p_previous_school)) > 500 THEN
    RAISE EXCEPTION 'Previous school / remarks exceed maximum length of 500 characters';
  END IF;

  -- 8. Insert record under table owner authority (trigger generates application_no)
  INSERT INTO public.admissions_applications (
    academic_year_id,
    applied_class_id,
    candidate_first_name,
    candidate_last_name,
    date_of_birth,
    gender,
    guardian_name,
    guardian_phone,
    guardian_email,
    residential_address,
    previous_school,
    stage,
    status
  ) VALUES (
    p_academic_year_id,
    p_applied_class_id,
    TRIM(p_candidate_first_name),
    TRIM(p_candidate_last_name),
    p_date_of_birth,
    p_gender,
    TRIM(p_guardian_name),
    TRIM(p_guardian_phone),
    NULLIF(TRIM(p_guardian_email), ''),
    COALESCE(NULLIF(TRIM(p_residential_address), ''), 'Sainthia'),
    NULLIF(TRIM(p_previous_school), ''),
    'Applied',
    'Pending Review'
  )
  RETURNING application_no INTO v_app_no;

  -- Return ONLY minimal public data: success and the assigned reference number.
  -- Internal database UUID (id) is strictly NOT returned.
  RETURN jsonb_build_object(
    'success', true,
    'application_no', v_app_no
  );
END;
$$;

-- Revoke all execution rights from PUBLIC, anon, and authenticated.
-- Browser clients cannot directly invoke this RPC via PostgREST.
-- Execution is granted exclusively to service_role for server-mediated intake.
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM anon;
REVOKE ALL ON FUNCTION public.submit_admission_enquiry FROM authenticated;
GRANT EXECUTE ON FUNCTION public.submit_admission_enquiry TO service_role;

-- ==============================================================================
-- ROLLBACK / RECOVERY INSTRUCTIONS (IF NEEDED):
-- ==============================================================================
-- 1. DROP FUNCTION IF EXISTS public.submit_admission_enquiry(uuid, uuid, text, text, date, text, text, text, text, text, text);
-- 2. DROP TABLE IF EXISTS public.contact_inquiries;
-- 3. DELETE FROM public.classes WHERE code IN ('LN', 'UN', 'KG', 'CLS-2', 'CLS-3', 'CLS-4', 'CLS-5');
-- 4. UPDATE public.classes SET name = 'Class 1', display_order = 1 WHERE code = 'CLS-1';
-- NOTE: Never execute DROP TABLE public.classes or DROP TABLE public.admissions_applications.
-- ==============================================================================
```

---

## 5. Verification & Test Suite Execution

### 5.1 Disposable Local PostgreSQL 18 Validation (`tests/milestone5_migration_validation.mjs`)
Executed using `@electric-sql/pglite` (WebAssembly-compiled PostgreSQL 18.6 engine in Node.js):
```
=== Milestone 5: Local Disposable Database Validation (PGlite Postgres 18) ===

1. Setting up representative Supabase base schema...
   ✓ Baseline schema created (classes, sections, academic_years, admissions_applications, roles).

2. Applying migration 20261029000001_public_admissions_and_contact_intake.sql...
   ✓ Migration applied cleanly with 0 errors.

3. Verifying Class I UUID & Section Relationship Integrity...
   ✓ Class I retained UUID 58c9e01e-f6cc-4bc0-9d93-277d50b9935b with intact Section A.
   ✓ All 8 verified classes present in exact handbook order.

4. Testing Direct PostgREST Intake Rejection for Anonymous Role (Bypass Prevention)...
   ✓ Direct PostgREST RPC execution denied for anon role (42501 permission denied).
   ✓ Direct PostgREST table INSERT denied on contact_inquiries for anon role.
   ✓ Direct PostgREST table SELECT denied for anon role.
   ✓ Direct sequence access on admissions_app_seq denied for anon role.

5. Testing Server Action Privileged Intake via service_role...
   ✓ Server Action role (service_role) successfully executed submit_admission_enquiry: assigned ADM-2026-01001
   ✓ Information leak check: Internal UUID was strictly withheld from caller.
   ✓ Server Action role (service_role) successfully inserted contact inquiry.

6. Testing Authorized Administrator Access & Stage Updates...
   ✓ Authorized Admin can read and update admissions stages.
   ✓ Contact inquiries default status New confirmed for admin review.

7. Testing Database Boundary Validation & Error Handling in RPC...
   ✓ Under-age candidate (< 2 yrs) rejected with boundary exception.
   ✓ Over-age candidate (> 18 yrs) rejected with boundary exception.
   ✓ Invalid phone format rejected with regex exception.
   ✓ Missing first name rejected.
   ✓ Non-existent academic year rejected with foreign key boundary exception.

8. Verifying Rollback Script Safety...
   ✓ Rollback cleanly drops RPC and contact_inquiries without touching admissions_applications.
   ✓ Reverts classes seed while strictly preserving Class 1 UUID and section foreign keys.

=== All 8 Local Database Validation Tests Passed Successfully (8/8) ===
```

### 5.2 Application & Static Verification Suite (`tests/milestone5_verification.mjs`)
```
--- Starting Milestone 5 Automated Verification Suite ---

1. Testing Sliding Window Rate Limiter...
   ✓ Rate Limiter: 5 allowed, 6th blocked with retryAfter, multi-IP isolation verified.

2. Testing Indian Mobile Normalization & Boundary Validation...
   ✓ Indian phone normalization: 10-digit format and [6-9] prefix strictly enforced.

3. Testing Candidate Age Validation (2 to 18 Years Threshold)...
   ✓ Candidate Age Validation: Enforces both minimum (>= 2 yrs) and maximum (<= 18 yrs) boundaries.

4. Testing 8-Tier Class Alignment and U.N. Preservation...
   ✓ 8-Tier continuum verified: Lower Nursery, U.N., KG, Class I through Class V.

5. Testing Honeypot Bot Rejection...
   ✓ Honeypot: Bot traps accurately detected.

6. Testing Migration Preconditions, Privilege Audits & SQL Boundary Checks...
   ✓ Precondition Assertion: Exactly 1 Class 1 row verified before in-place update.
   ✓ Privilege Audit: PUBLIC and anon privileges revoked across tables, sequences, and functions.
   ✓ Column Grant Isolation: Administrative fields (status, id, timestamps) withheld from anon.
   ✓ DOB Boundaries: SQL RPC enforces candidate age between 2 and 18 years.
   ✓ Information Leakage: Internal UUID strictly omitted from RPC output.

7. Testing Live Supabase Anonymous Data Isolation...
   ✓ Anonymous Data Isolation: PostgREST returns [] (0 rows exposed to anonymous callers).

8. Testing Admin Authorization Guard Invariants...
   ✓ Admin Guards: Server actions and /portal/admin/layout.tsx strictly guarded by requireAdmin().
   ✓ Server-Only Isolation: Privileged client isolated with server-only and SUPABASE_SERVICE_ROLE_KEY.

--- All Automated Verification Tests Passed Successfully (8/8) ---
```

### 5.3 TypeScript Compilation Check
```powershell
npx tsc --noEmit
# Result: 0 errors (Exit code: 0)
```

### 5.4 ESLint Check
```powershell
npm run lint
# Result: 0 errors, 0 warnings (Exit code: 0)
```

### 5.5 Production Next.js Build
```powershell
npm run build
# Result: Compiled successfully in 3.8s
# TypeScript checks completed in 5.1s
# Static generation finished cleanly for all 64 routes (Exit code: 0)
```

---

## 6. Pre-Deployment Configuration Prerequisite

To enable the Next.js Server Actions to execute the privileged intake functions once the migration is applied to remote Supabase:

1. **Obtain `service_role` Key**: Retrieve the secret `service_role` key from Supabase Dashboard -> Project Settings -> API.
2. **Configure Server Environment**: Add `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>` to `.env.local` (for local development) and to the deployment hosting environment variables (e.g. Vercel / Docker).
3. **Security Invariant**: Never prefix this variable with `NEXT_PUBLIC_`. The `src/lib/supabase/admin.ts` module uses `import 'server-only';` to enforce that this key cannot be bundled into browser code.

---

## 7. Next Actions (Awaiting User Direction)

1. Review the remediated migration SQL in Section 4.
2. When ready, provide approval to apply [`supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql) to the remote Supabase project (`tybaaqktbdlnqsgodkek`).
