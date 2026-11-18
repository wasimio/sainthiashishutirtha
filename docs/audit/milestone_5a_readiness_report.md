# Sainthia Shishutirtha — Milestone 5A: Admissions & Contact Integration Readiness Audit

**Date:** October 29, 2026  
**Status:** Audit Completed — Inspection Only (Zero Schema/Code Modifications)  
**Target Repository:** `D:\sainthiashishutirtha`  
**Supabase Project Reference:** `tybaaqktbdlnqsgodkek` (Region: `ap-south-1` Mumbai)  
**Framework:** Next.js 16.4.2 App Router, React 19.3.0, TypeScript 5, Supabase SSR  
**Verified Data Addendum:** [`docs/audit/MILESTONE_5A_VERIFIED_SCHOOL_DATA_ADDENDUM.md`](file:///d:/sainthiashishutirtha/docs/audit/MILESTONE_5A_VERIFIED_SCHOOL_DATA_ADDENDUM.md)

> [!NOTE]
> **School Handbook Update Incorporated**: Verified institutional data (Name: "Sainthia Shishu Tirtha", address at Saradishpally opposite Reliance Smart Point, 2 phone numbers, WBBPE board wording, seasonal timings, and the full 8-class continuum from Lower Nursery through Class V) have been reviewed and documented in the dedicated [Verified School Data Addendum](file:///d:/sainthiashishutirtha/docs/audit/MILESTONE_5A_VERIFIED_SCHOOL_DATA_ADDENDUM.md).

---

## 1. Executive Summary

Milestone 5A is an inspection-only audit designed to verify the readiness of the Supabase database schema, Row-Level Security (RLS) policies, application reference number generation, and UI form implementations before wiring the public admissions and contact intake forms.

### Primary Audit Findings
1. **`public.admissions_applications` Exists**: The admissions table and sequential reference number generator (`public.admissions_app_seq`) exist in migration [`20261022000005_communications_and_settings.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261022000005_communications_and_settings.sql) and are deployed to the remote database.
2. **Contact Inquiries Table Does NOT Exist**: There is no database table for contact inquiries (`contact_inquiries`, `contact_messages`, etc.) in any migration or in the remote database. The contact form on the public website currently has no persistence layer.
3. **Trigger Permission Blocker for Anonymous Users**: The BEFORE INSERT trigger function `public.handle_admissions_application_insert()` was revoked from `PUBLIC`, `anon`, and `authenticated` in migration [`20261023000001_security_advisor_remediation.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261023000001_security_advisor_remediation.sql), and is **not** declared `SECURITY DEFINER`. Furthermore, it internally invokes `public.is_admin()`, which was also revoked from `anon`. Unauthenticated public submissions will abort with PostgreSQL permission errors unless adjusted.
4. **RLS Prevents Anonymous Reference Number Retrieval via Direct Client `.select()`**: `public.admissions_applications` has no `SELECT` policy for role `anon` (essential for applicant privacy). Consequently, a client-side call using `.insert(...).select('application_no')` will have the returned row filtered out by PostgreSQL RLS. The applicant cannot receive their generated `application_no` via direct client PostgREST calls without compromising privacy.
5. **Class Schema Mismatch & Missing Remote Classes**: The database enforces `applied_class_id uuid NOT NULL REFERENCES public.classes(id)`. However, the remote database contains only **1 class record** (`Class 1`). Classes for Nursery/Pre-Primary, Kindergarten (KG), Class II, Class III, and Class IV do not exist in `public.classes`, causing foreign key constraint failures if selected.
6. **Gender Constraint Mismatch**: The UI modal submits `'Boy' | 'Girl'`, but the database enforces `CHECK (gender IN ('Male', 'Female', 'Other'))`. Submissions would immediately fail check constraints without a transformation layer.
7. **Current UI Behavior is 100% Mock**: Both [`AdmissionModal.tsx`](file:///d:/sainthiashishutirtha/src/components/modals/AdmissionModal.tsx) and [`ContactFormClient.tsx`](file:///d:/sainthiashishutirtha/src/components/contact/ContactFormClient.tsx) use in-memory React state. The admission modal generates a fabricated reference number (`ST-2026-XXXX`), sends zero network traffic, and loses state upon closing.

---

## 2. Existing Forms and Their Current Behavior

### 2.1 Public Admission Enquiry Modal
- **Component File**: [`src/components/modals/AdmissionModal.tsx`](file:///d:/sainthiashishutirtha/src/components/modals/AdmissionModal.tsx)
- **Invocation Points**: Triggered from Navbar CTAs, Hero CTA, QuickActionRail, and the dedicated [`/admissions`](file:///d:/sainthiashishutirtha/src/app/admissions/page.tsx) page via [`AdmissionModalContext.tsx`](file:///d:/sainthiashishutirtha/src/components/modals/AdmissionModalContext.tsx).
- **Form State Structure**:
  ```typescript
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Boy', // 'Boy' | 'Girl'
    applyingGrade: defaultGrade || 'Kindergarten (KG)',
    parentName: '',
    relationship: 'Mother', // 'Mother' | 'Father' | 'Guardian'
    phone: '',
    email: '',
    residentialArea: 'Sainthia Town',
    remarks: ''
  });
  ```
- **Validation**:
  - Uses native HTML5 `required` attributes on `studentName`, `parentName`, `phone`, and `admissionGrade`.
  - Does not validate phone number length or formatting (allows arbitrary non-numeric text if typed).
  - Date of birth (`dob`) is optional in the UI, but **mandatory** in the database.
- **Current Submission Flow**:
  ```typescript
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.phone) return;
    const randomId = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(randomId);
  };
  ```
  - Generates a client-side pseudo-random reference code (`ST-2026-XXXX`).
  - No database interaction or network call occurs.
  - Closing the modal resets state; reference numbers are lost permanently.

### 2.2 Public Contact & Visit Request Form
- **Component File**: [`src/components/contact/ContactFormClient.tsx`](file:///d:/sainthiashishutirtha/src/components/contact/ContactFormClient.tsx)
- **Page Route**: [`src/app/contact/page.tsx`](file:///d:/sainthiashishutirtha/src/app/contact/page.tsx)
- **Form State Structure**:
  ```typescript
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    classInterest: 'Kindergarten (KG)',
    message: ''
  });
  ```
- **Current Submission Flow**:
  ```typescript
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;
    setIsSubmitted(true);
  };
  ```
  - Flips `isSubmitted` to `true` and renders a mock confirmation card.
  - Zero network dispatch; zero persistence.

---

## 3. Verified Database Schema, Tables, and Columns

### 3.1 Table: `public.admissions_applications`
Created in [`supabase/migrations/20261022000005_communications_and_settings.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261022000005_communications_and_settings.sql#L10-L30):

| Column Name | Data Type | Nullable | Default | Constraints & Foreign Keys |
| :--- | :--- | :---: | :--- | :--- |
| `id` | `uuid` | No | `gen_random_uuid()` | PRIMARY KEY |
| `application_no` | `text` | No | *Trigger-assigned* | UNIQUE NOT NULL |
| `academic_year_id` | `uuid` | No | *None* | REFERENCES `public.academic_years(id)` ON DELETE RESTRICT |
| `candidate_first_name`| `text` | No | *None* | NOT NULL |
| `candidate_last_name` | `text` | No | *None* | NOT NULL |
| `applied_class_id` | `uuid` | No | *None* | REFERENCES `public.classes(id)` ON DELETE RESTRICT |
| `date_of_birth` | `date` | No | *None* | NOT NULL |
| `gender` | `text` | No | *None* | `CHECK (gender IN ('Male', 'Female', 'Other'))` |
| `guardian_name` | `text` | No | *None* | NOT NULL |
| `guardian_phone` | `text` | No | *None* | NOT NULL |
| `guardian_email` | `text` | Yes | `NULL` | |
| `residential_address` | `text` | No | *None* | NOT NULL |
| `previous_school` | `text` | Yes | `NULL` | |
| `stage` | `text` | No | `'Applied'` | `CHECK (stage IN ('Applied', 'Document Verification', 'Parent Interaction', 'Provisional Admission', 'Enrolled', 'Rejected'))` |
| `status` | `text` | No | `'Pending Review'` | `CHECK (status IN ('Pending Review', 'Verified', 'Approved', 'Deferred', 'Withdrawn'))` |
| `internal_notes` | `text` | Yes | `NULL` | |
| `assigned_reviewer_id`| `uuid` | Yes | `NULL` | REFERENCES `public.profiles(id)` |
| `created_at` | `timestamptz` | No | `now()` | NOT NULL |
| `updated_at` | `timestamptz` | No | `now()` | NOT NULL |

### 3.2 Sequence and Trigger Definition
- **Sequence**: `public.admissions_app_seq START 1001`
- **Trigger**: `trg_handle_admissions_application_insert` BEFORE INSERT ON `public.admissions_applications` FOR EACH ROW EXECUTE FUNCTION `public.handle_admissions_application_insert()`
- **Trigger Logic**:
  ```sql
  IF NEW.application_no IS NULL OR TRIM(NEW.application_no) = '' THEN
    NEW.application_no := 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.admissions_app_seq')::text, 5, '0');
  END IF;

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
  ```

### 3.3 Contact Inquiries Table Audit
- **Status**: **NOT FOUND**.
- Exhaustive search across all migrations (`20261022000001` through `20261023000001`) and the remote database schema confirmed that no table exists for public general or campus visit inquiries.
- **Requirement**: A dedicated table `public.contact_inquiries` must be planned and provisioned.

### 3.4 Remote Database Live State (Verified via Read-Only Queries)
- **`public.academic_years`**: Exactly 1 active record found:
  - `id`: `f5843275-1c51-436f-899a-28ddfd9f6335`
  - `name`: `'2026-2027'`
  - `is_current`: `true`
- **`public.classes`**: Exactly 1 record found:
  - `id`: `58c9e01e-f6cc-4bc0-9d93-277d50b9935b`
  - `name`: `'Class 1'`
  - `code`: `'CLS-1'`
  - `wing`: `'Junior Primary'`
  - *Missing*: Kindergarten (KG), Pre-Primary / Nursery, Class II, Class III, Class IV are not present in the database.
- **`public.admissions_applications`**: 0 records found.

---

## 4. Relevant Row-Level Security Policies and Grants

### 4.1 `public.admissions_applications` Policies
In [`supabase/migrations/20261022000006_row_level_security_policies.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261022000006_row_level_security_policies.sql#L531-L544):

1. **Public INSERT Policy**:
   ```sql
   CREATE POLICY "Public can submit admission applications"
     ON public.admissions_applications FOR INSERT TO public
     WITH CHECK (
       status = 'Pending Review'
       AND stage = 'Applied'
       AND assigned_reviewer_id IS NULL
       AND internal_notes IS NULL
     );
   ```
2. **Admin Full Access Policy**:
   ```sql
   CREATE POLICY "Admin full access on admissions applications"
     ON public.admissions_applications FOR ALL TO authenticated
     USING (public.is_admin()) WITH CHECK (public.is_admin());
   ```

### 4.2 Privacy & Read Access Evaluation
- **Can anonymous visitors view existing applications?**: **NO**.
  - There is zero `SELECT` policy granted to `public` or `anon`.
  - When querying `admissions_applications` as `anon`, PostgREST returns an empty array `[]` (HTTP 200) with 0 rows exposed. Applicant personal data is completely shielded from unauthorized public eyes.

---

## 5. Security Risks, Defects & Blockers Identified

```
                       ANONYMOUS CLIENT SUBMISSION BREAKDOWN
                     
      [ Browser / Anonymous User ]
                  │
                  ▼
         Direct PostgREST INSERT
                  │
      ┌───────────┴─────────────────────────────────────────┐
      │                                                     │
      ▼                                                     ▼
❌ Trigger Permission Denied                     ❌ PostgREST RLS Filter
  • Trigger function not SECURITY DEFINER          • anon has NO SELECT policy
  • Calls is_admin() (revoked from anon)           • RETURNING application_no filtered
  • Result: ERROR: permission denied               • Result: Empty response / PGRST116
```

### Risk 1: Execution Privilege Failure on `handle_admissions_application_insert()`
- In migration [`20261023000001_security_advisor_remediation.sql`](file:///d:/sainthiashishutirtha/supabase/migrations/20261023000001_security_advisor_remediation.sql#L213):
  ```sql
  REVOKE ALL ON FUNCTION public.handle_admissions_application_insert() FROM PUBLIC, anon, authenticated;
  ```
- The function was declared as standard `SECURITY INVOKER` (default). When role `anon` inserts a row, PostgreSQL evaluates the trigger under role `anon`.
- Because `EXECUTE` was revoked from `anon`, and because the function calls `public.is_admin()` (which was also revoked from `anon` on line 280), any unauthenticated insert will abort immediately with:
  `ERROR: permission denied for function handle_admissions_application_insert` or `permission denied for function is_admin`.

### Risk 2: Client Cannot Receive `application_no` via Direct PostgREST
- In PostgreSQL RLS, an `INSERT ... RETURNING application_no` evaluates the table's `SELECT` RLS policy against the returned row.
- Because `anon` intentionally has no `SELECT` policy on `admissions_applications`, PostgREST silently filters out the returning payload.
- If the client calls `.select('application_no').single()`, PostgREST throws code `PGRST116` ("JSON object requested, multiple (or no) rows returned").
- **Do not open `SELECT` on `admissions_applications` to `anon`**: Granting `anon` select permissions would create serious data privacy vulnerabilities (allowing enumeration of applicant names, contact numbers, and home addresses).

### Risk 3: Foreign Key Failures on `applied_class_id`
- The admission modal allows selecting:
  - *Pre-Primary / Nursery*
  - *Kindergarten (KG)*
  - *Class I*
  - *Class II*
  - *Class III*
  - *Class IV*
- The database requires a UUID referencing `public.classes(id)`.
- However, the remote database only has a record for `Class 1`. Any application for KG, Nursery, or Classes II–IV will trigger:
  `ERROR: insert or update on table "admissions_applications" violates foreign key constraint "admissions_applications_applied_class_id_fkey"`.

### Risk 4: Form Data vs Database Constraint Mismatches
1. **Gender Check Constraint**: UI sets `Boy` or `Girl`. Database requires `Male`, `Female`, or `Other`. Unmapped strings will fail `CHECK (gender IN ('Male', 'Female', 'Other'))`.
2. **Name Fields**: UI provides a single string `studentName`. Database requires `candidate_first_name` and `candidate_last_name`.
3. **Mandatory Date of Birth**: UI treats DOB as optional. Database requires `date_of_birth date NOT NULL`.

### Risk 5: Spam, Abuse & Denial-of-Service
- Direct public insertion without validation, rate limiting, or honeypot fields exposes the admissions pipeline to script automation, spam bot flooding, and database exhaustion.

---

## 6. Admin CMS Review and Access Isolation

### 6.1 Review Interface Status
- **Current Route**: [`src/app/portal/admin/admissions/page.tsx`](file:///d:/sainthiashishutirtha/src/app/portal/admin/admissions/page.tsx)
- Currently renders static mock records (`ADMIN_ADMISSIONS_LIST` from `portalAdminData.ts`).
- It has not yet been connected to `public.admissions_applications`.

### 6.2 Administrative Access Boundaries
- **Server Guard**: The layout [`src/app/portal/admin/layout.tsx`](file:///d:/sainthiashishutirtha/src/app/portal/admin/layout.tsx) invokes `requireAdmin()`.
- **Authorization Implementation**:
  - Validates active Supabase session via `auth.getUser()`.
  - Queries `public.profiles` to verify `profile.role === 'admin'` and `profile.is_active === true`.
  - Redirects non-admins to `/portal/staff`, `/portal/parent`, or `/login`.
- **Database RLS**:
  - `public.admissions_applications` grants `ALL` to authenticated users where `public.is_admin() = true`.
  - Parents and teachers have zero access to the admissions table.
- **Conclusion**: Once wired to Supabase, administrators can securely review applicant dossiers, filter by stage, and update review statuses without exposing applicant data to unauthorized roles.

---

## 7. Recommended Architecture

To achieve absolute security, zero data leaks, spam resilience, and guaranteed reference number delivery, we recommend a **Server-Mediated Architecture** utilizing Next.js Server Actions rather than direct client-side PostgREST calls.

```
                           RECOMMENDED SUBMISSION ARCHITECTURE
                         
  [ Browser Client ]
         │
         │  1. Submits form data + honeypot token
         ▼
  [ Next.js Server Action: submitAdmissionApplication() ]
         │
         ├─► A. Validate Honeypot (reject if filled)
         ├─► B. Enforce Rate Limiting (IP/Cookie: max 5 req / 15 min)
         ├─► C. Validate with Zod Schema (transform 'Boy' -> 'Male', split names)
         ├─► D. Resolve Class UUID from 'Kindergarten (KG)' -> public.classes
         │
         │  2. Execute mutation via Server Client / Dedicated RPC
         ▼
  [ Supabase Database ]
         │
         ├─► trg_handle_admissions_application_insert generates 'ADM-2026-01001'
         │   (Function configured with SECURITY DEFINER)
         │
         │  3. Returns strictly { application_no: 'ADM-2026-01001' } to Server Action
         ▼
  [ Next.js Server Action ]
         │
         │  4. Returns { success: true, applicationNo: 'ADM-2026-01001' }
         ▼
  [ Admission Modal UI ]
         │
         └─► Displays official ticket with verified reference number
```

### Why This Architecture is Strictly Required:
1. **Solves the RLS Dilemma Safely**: The Server Action executes the insert and returns *only* the generated reference number to the client. The applicant never requires read permissions on the table, preserving applicant confidentiality.
2. **Eliminates Permission Failures**: The database trigger function can be set to `SECURITY DEFINER` (or wrapped in a dedicated RPC function), running with table owner privileges rather than `anon` privileges.
3. **Comprehensive Anti-Spam Protection**: Enables honeypot verification and server-side rate limiting before touching the database.
4. **Data Normalization**: Handles name splitting, gender enum mapping, and grade-to-UUID resolution cleanly on the server.
5. **Graceful Degraded Handling**: If the database is temporarily unreachable, the Server Action catches the exception and returns a structured, friendly error message (with school phone helpline) without crashing the client or exposing connection strings.

---

## 8. Recommended Application-Number Strategy

- **Retain the Existing Database Sequence**: Keep `public.admissions_app_seq` and the `ADM-YYYY-XXXXX` format.
  - Generates: `ADM-2026-01001`, `ADM-2026-01002`, etc.
  - Ensures atomic, collision-free numbers across concurrent submissions.
- **Fix the Trigger Function**:
  Update `public.handle_admissions_application_insert()` to include `SECURITY DEFINER` and `SET search_path = public`:
  ```sql
  CREATE OR REPLACE FUNCTION public.handle_admissions_application_insert()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$ ... $$;
  ```
  This allows the trigger to query `public.is_admin()` and invoke `nextval('public.admissions_app_seq')` under the function owner's authority without failing when an anonymous user submits.

---

## 9. Minimal Implementation Plan for Milestone 5

### Phase 1: Database Preparation (Migration)
1. **Create `public.contact_inquiries` Table**:
   - Fields: `id`, `parent_name`, `phone`, `email`, `class_interest`, `message`, `status`, `created_at`.
   - Enable RLS: Allow public `INSERT` (with status = 'New'); allow `ALL` strictly to `is_admin()`.
2. **Seed 8 Verified Classes in `public.classes` (Handbook-Aligned)**:
   - Insert and align the full school continuum (Lower Nursery through Class V):
     - `Lower Nursery` (code: `LN`, wing: `Early Childhood`, display_order: 1)
     - `U.N.` (code: `UN`, wing: `Early Childhood`, display_order: 2 — preserved strictly as "U.N.")
     - `KG` (code: `KG`, wing: `Pre-Primary`, display_order: 3)
     - `Class I` (code: `CLS-1`, wing: `Junior Primary`, display_order: 4 — re-order existing Class 1)
     - `Class II` (code: `CLS-2`, wing: `Junior Primary`, display_order: 5)
     - `Class III` (code: `CLS-3`, wing: `Senior Primary`, display_order: 6)
     - `Class IV` (code: `CLS-4`, wing: `Senior Primary`, display_order: 7)
     - `Class V` (code: `CLS-5`, wing: `Senior Primary`, display_order: 8 — newly confirmed tier)
3. **Harden Trigger Privileges**:
   - Add `SECURITY DEFINER` to `public.handle_admissions_application_insert()`.

### Phase 2: Service Layer & Server Actions
1. **Admissions Service & Action**:
   - Implement `submitAdmissionApplication(formData)` in `src/lib/actions/admissionsActions.ts`.
   - Zod validation, honeypot checking, phone regex validation.
   - Grade mapping from label to `class_id`.
   - Return `{ success: true, applicationNo: string }` or `{ success: false, error: string }`.
2. **Contact Service & Action**:
   - Implement `submitContactInquiry(formData)` in `src/lib/actions/contactActions.ts`.
   - Insert inquiry into `public.contact_inquiries`.

### Phase 3: UI Integration
1. **Update [`AdmissionModal.tsx`](file:///d:/sainthiashishutirtha/src/components/modals/AdmissionModal.tsx)**:
   - Add honeypot field (`website_hp`, hidden with `display: none` and `tabIndex={-1}`).
   - Connect `handleSubmit` to `submitAdmissionApplication()`.
   - Display pending/submitting spinner state.
   - Render real `applicationNo` on the confirmation ticket.
   - Provide fallback phone call link if submission fails.
2. **Update [`ContactFormClient.tsx`](file:///d:/sainthiashishutirtha/src/components/contact/ContactFormClient.tsx)**:
   - Connect `handleSubmit` to `submitContactInquiry()`.
   - Display pending/submitting spinner and error toast on network failure.

### Phase 4: Admin Portal Admissions Desk Connection
1. **Update [`src/app/portal/admin/admissions/page.tsx`](file:///d:/sainthiashishutirtha/src/app/portal/admin/admissions/page.tsx)**:
   - Fetch real records from `public.admissions_applications` joined with `public.classes`.
   - Implement live stage advancing (`Applied` -> `Document Verification` -> `Parent Interaction` -> `Provisional Admission` -> `Enrolled`).

---

## 10. Test Matrix for Milestone 5

| ID | Test Scenario | Expected Outcome |
| :--- | :--- | :--- |
| **TC-01** | Anonymous user submits valid admission form for Kindergarten | Application inserted; database assigns real sequential `ADM-2026-XXXXX`; modal displays reference number. |
| **TC-02** | Anonymous user submits contact form | Inquiry inserted into `public.contact_inquiries`; success banner displayed. |
| **TC-03** | Anonymous user attempts to query `admissions_applications` via REST | Returns 0 rows (`[]`); zero personal data accessible. |
| **TC-04** | Spam bot fills out hidden honeypot field | Submission silently rejected with generic acknowledgment; zero database writes. |
| **TC-05** | Rate limit exceeded (>5 requests in 15 mins from same IP) | Throttled with friendly cooldown message. |
| **TC-06** | Invalid phone number or non-matching gender | Client/server validation flags field before database transaction. |
| **TC-07** | Network failure or database offline | UI shows clear error alert with administrative telephone helpline; no broken crash. |
| **TC-08** | Authorized Admin views Admissions Desk (`/portal/admin/admissions`) | Newly submitted application appears in real-time with full guardian and candidate details. |
| **TC-09** | Non-admin user tries to access `/portal/admin/admissions` | Blocked and redirected by `requireAdmin()`. |
