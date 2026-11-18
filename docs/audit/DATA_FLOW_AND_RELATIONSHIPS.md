# Sainthia Shishutirtha — Data Flow & Relationship Architecture

**Document Date:** October 27, 2026  
**Auditor:** Antigravity (Advanced Agentic AI Assistant)  
**Database System:** Supabase PostgreSQL (`tybaaqktbdlnqsgodkek`, Region `ap-south-1`)  
**Scope:** Authoritative architectural blueprint of entity relationships, lifecycles, and data transitions.

---

## 1. Authentication & Profile Authorization Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Staff / Parent
    participant Auth as Supabase Auth (auth.users)
    participant Trg as Trigger: on_auth_user_created
    participant Profile as public.profiles
    participant Guard as Trigger: trg_guard_profile_role_update
    participant NextProxy as Next.js 16 Proxy / Middleware
    participant RouteGuard as requireRole() Server Action

    User->>Auth: Sign Up / Sign In (email, password)
    Auth->>Trg: AFTER INSERT on auth.users
    Trg->>Profile: INSERT INTO public.profiles (role: 'parent', is_active: true)
    User->>NextProxy: HTTP GET /portal/* (with session cookie)
    NextProxy->>Auth: getUser() (refresh token & validate session)
    NextProxy->>RouteGuard: Forward authenticated request
    RouteGuard->>Profile: SELECT role, is_active FROM profiles WHERE id = auth.uid()
    
    alt Profile.role == 'admin'
        RouteGuard-->>User: Allow access to /portal/admin
    else Profile.role == 'staff'
        RouteGuard-->>User: Allow access to /portal/staff
    else Profile.role == 'parent'
        RouteGuard-->>User: Allow access to /portal/parent
    end

    opt Unauthorized Role Escalation Attempt
        User->>Profile: UPDATE profiles SET role = 'admin' WHERE id = auth.uid()
        Profile->>Guard: BEFORE UPDATE on profiles
        Guard-->>User: RAISE EXCEPTION '42501: Privilege escalation violation'
    end
```

### Architectural Realities & Defect Analysis
1. **Default Role Trap**: `handle_new_auth_user()` hardcodes `role := 'parent'` for all new registrations. There is no automated provision for teachers or administrators to be assigned their role upon sign-up.
2. **SQL Editor Execution Context**: In the Supabase SQL Editor, `auth.uid()` evaluates to `NULL`. Because `guard_profile_role_update()` enforces `IF NOT public.is_admin()`, direct SQL updates executed by database administrators fail with privilege escalation errors unless `trg_guard_profile_role_update` is temporarily disabled inside a transactional block (`BEGIN ... COMMIT`).
3. **Staff Onboarding Gap**: When an administrator registers a teacher in `/portal/admin/faculty`, a record is inserted into `public.staff_profiles`, but `public.profiles.role` is left unchanged as `'parent'`. Consequently, the teacher remains trapped in `/portal/parent`.

---

## 2. Student Registration & Academic Placement Data Flow

```mermaid
erDiagram
    academic_years ||--o{ classes : "scopes"
    academic_years ||--o{ sections : "schedules"
    academic_years ||--o{ student_enrollments : "defines"
    classes ||--o{ sections : "contains"
    sections ||--o{ student_enrollments : "enrolls"
    students ||--o{ student_enrollments : "holds"
    students ||--o{ student_guardians : "linked_to"
    guardians ||--o{ student_guardians : "cares_for"
    profiles |o--o| guardians : "claims_identity"

    students {
        uuid id PK
        text scholar_id UK "e.g. ST-2026-0001"
        text first_name
        text last_name
        text gender
        date date_of_birth
        text blood_group
        text status "Enrolled, Under Review, TC Issued"
        text emergency_contact_phone
        text medical_notes
    }

    guardians {
        uuid id PK
        uuid profile_id FK "References profiles(id) - Currently NULL"
        text guardian_code UK "e.g. GRD-928173"
        text primary_guardian_name
        text primary_phone
        text residential_address
        text verification_status "verified, pending, rejected"
    }

    student_guardians {
        uuid student_id FK
        uuid guardian_id FK
        text relationship "Father, Mother, Legal Guardian"
        boolean is_primary
    }

    student_enrollments {
        uuid id PK
        uuid student_id FK
        uuid section_id FK
        uuid academic_year_id FK
        integer roll_number
        text status "active, promoted, transferred"
    }
```

### Transactional Mechanics of `registerStudent()`
In `src/lib/services/adminService.ts`, the student registration executes the following sequential steps:
1. **Insert `students`**: Generates a new student row with scholar ID (e.g. `ST-2026-0001`) and demographic details.
2. **Insert `guardians`**: Creates a guardian record with generated code `GRD-${Date.now().slice(-6)}`.
3. **Insert `student_guardians`**: Maps `student.id` to `guardian.id` with `relationship` and `is_primary = true`.
4. **Insert `student_enrollments`**: Places the student into a specific `section_id` and `academic_year_id` with an assigned `roll_number`.

### Critical Architecture Gaps
* **Guardian Orphanage**: `guardians.profile_id` is left `NULL`. The parent has no linked auth user, preventing parent portal login.
* **Sibling Linkage Failure**: Every student registered creates an independent guardian row, even if the phone number and guardian name match an existing parent. Siblings cannot be grouped under a single parent account.

---

## 3. Admission Enquiry to Enrolled Student Lifecycle

```mermaid
flowchart TD
    A["Public Website Visitor (/admissions)"] -->|"Fills AdmissionModal"| B["Frontend React State (Currently Discarded)"]
    
    subgraph Target Production Flow
        B -.->|"POST / Insert"| C["public.admissions_applications\nstage = 'Applied'\nstatus = 'Pending Review'\napplication_no = 'ADM-2026-XXXXX'"]
        C --> D["Admin Admissions Desk (/portal/admin/admissions)"]
        D -->|"Review & Document Check"| E["stage = 'Document Verification'"]
        E -->|"Parent Interview"| F["stage = 'Parent Interaction'"]
        F -->|"Seat Allotment"| G["stage = 'Provisional Admission'"]
        G -->|"Fee Cleared & Final TC"| H["stage = 'Enrolled'\nstatus = 'Approved'"]
        
        H -->|"Automated Transition Function"| I["1. Create public.students record"]
        H -->|"Automated Transition Function"| J["2. Create/Link public.guardians record"]
        H -->|"Automated Transition Function"| K["3. Create public.student_enrollments record"]
        H -->|"Automated Transition Function"| L["4. Issue guardian invitation token"]
    end

    style B fill:#fee2e2,stroke:#ef4444,stroke-width:2px;
    style C fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
    style H fill:#dcfce7,stroke:#22c55e,stroke-width:2px;
```

### Current Status vs. Intended Flow
* **Current State**: Step `B` terminates inside `src/components/modals/AdmissionModal.tsx` by setting a random string in React state. Step `D` reads from static mock array `ADMIN_ADMISSIONS_LIST`. Steps `E` through `L` do not exist in code.
* **Required Implementation**:
  1. Update `AdmissionModal.tsx` to insert directly into `public.admissions_applications` (permitted by public RLS).
  2. Implement `getAdmissionsApplications()` and `updateAdmissionStage()` in `adminService.ts`.
  3. Implement `promoteApplicationToEnrolledStudent(applicationId, sectionId, rollNumber)` to automate the conversion into SIS tables.

---

## 4. Classroom Attendance Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Teacher as Class Teacher (/portal/staff/attendance)
    participant StaffUI as Staff Portal UI (React)
    participant PostgREST as Supabase PostgREST
    participant Sess as public.attendance_sessions
    participant Rec as public.attendance_records
    participant AdminUI as Admin Dashboard (/portal/admin/attendance)

    Note over Teacher,StaffUI: Currently stops here (Mock Simulation Toast)
    Teacher->>StaffUI: Mark Morning Roll Call (Present / Absent / Late)
    StaffUI->>PostgREST: INSERT INTO attendance_sessions (section_id, session_date, marked_by)
    PostgREST->>Sess: Row created with id = session_id
    StaffUI->>PostgREST: BULK INSERT INTO attendance_records (session_id, student_id, status, remarks)
    PostgREST->>Rec: Records inserted for all enrolled scholars
    
    AdminUI->>PostgREST: getDailyAttendanceSummary(targetDate)
    PostgREST->>Sess: SELECT sessions WHERE session_date = targetDate
    PostgREST->>Rec: SELECT records WHERE session_id IN (sessions)
    PostgREST-->>AdminUI: { totalSessions, totalPresent, totalAbsent, absentees: [...] }
    AdminUI-->>AdminUI: Render campus telemetry & absentee ledger
```

### Key Integration Failure
* `/portal/admin/attendance` is fully written and tested to query `attendance_sessions` and `attendance_records`.
* `/portal/staff/attendance` is completely disconnected and never performs steps 2, 3, 4, and 5.
* **Fix Required**: Wire `StaffDailyAttendancePage` to load enrolled students from `student_enrollments` for the teacher's section and execute the batch insert into `attendance_sessions` and `attendance_records`.

---

## 5. Financial Ledger & Automated Invoicing Architecture

```mermaid
erDiagram
    fee_heads ||--o{ fee_structures : "defines"
    academic_years ||--o{ fee_structures : "applies_to"
    classes ||--o{ fee_structures : "charges"
    academic_years ||--o{ invoices : "bills_for"
    students ||--o{ invoices : "billed_to"
    invoices ||--o{ invoice_items : "itemizes"
    fee_heads ||--o{ invoice_items : "categorizes"
    students ||--o{ payments : "paid_by"
    guardians |o--o{ payments : "remitted_by"
    payments ||--o{ payment_allocations : "clears"
    invoices ||--o{ payment_allocations : "settled_by"

    fee_structures {
        uuid id PK
        uuid academic_year_id FK
        uuid class_id FK
        uuid fee_head_id FK
        text term_title "e.g. Term 1 Tuition"
        numeric amount "e.g. 3600.00"
        date due_date
    }

    invoices {
        uuid id PK
        text invoice_no UK "e.g. INV-2026-10024"
        uuid student_id FK
        uuid academic_year_id FK
        text title
        date issue_date
        date due_date
        numeric total_amount
        numeric paid_amount
        text status "Issued, Partially Paid, Paid, Overdue"
    }

    payments {
        uuid id PK
        text receipt_no UK "e.g. REC-2026-92812"
        uuid student_id FK
        numeric amount
        date payment_date
        text payment_mode "UPI, Cash at Counter, NEFT, Cheque"
        text transaction_reference
        text status "Completed, Bounced, Refunded"
    }

    payment_allocations {
        uuid id PK
        uuid payment_id FK
        uuid invoice_id FK
        numeric allocated_amount
    }
```

### Missing Engine: Invoice Generation
Currently, an administrator can define a `fee_structure` (e.g. Class II Tuition: ₹3,600) and can manually record a `payment`. However:
1. No background job or trigger generates `invoices` for students enrolled in that class.
2. When a payment is recorded, `payment_allocations` is never populated, so `invoices.paid_amount` remains `0` and `invoices.status` remains `Issued`.
3. The parent portal (`/portal/parent/fees`) cannot display dues because the student has 0 generated invoices in the database.

---

## 6. Parent-Child Sibling Access & RLS Flow

```mermaid
sequenceDiagram
    autonumber
    actor Parent as Authenticated Parent (auth.uid)
    participant PostgREST as Supabase PostgREST
    participant SG as public.student_guardians
    participant G as public.guardians
    participant S as public.students
    participant RLS as RLS Policy: is_guardian_of()

    Parent->>PostgREST: GET /rest/v1/students?select=*,enrollments(*)
    PostgREST->>RLS: Evaluate: is_guardian_of(students.id)
    RLS->>SG: SELECT 1 FROM student_guardians sg
    SG->>G: JOIN guardians g ON g.id = sg.guardian_id
    Note over RLS,G: Condition: g.profile_id = auth.uid() AND g.verification_status = 'verified'
    
    alt g.profile_id == auth.uid()
        RLS-->>PostgREST: ALLOW (Returns student & sibling records)
        PostgREST-->>Parent: JSON array of linked children
    else g.profile_id is NULL (Current State)
        RLS-->>PostgREST: DENY (Returns empty array [])
        PostgREST-->>Parent: []
    end
```

### The Sibling Connection Solution
To allow parents to see their children and switch between siblings:
1. When a student is enrolled, check if a guardian with the same `primary_phone` already exists. If so, reuse that `guardian_id`.
2. Generate an invitation record in `public.guardian_invitations` with a secure token.
3. When the parent registers or logs in with that phone or email, execute a claiming function:
   `UPDATE public.guardians SET profile_id = auth.uid() WHERE id = claimed_guardian_id;`
4. Once `guardians.profile_id = auth.uid()`, the existing `is_guardian_of()` RLS policy automatically unlocks access to all children linked via `student_guardians`!

---

## 7. Future Multi-School Tenant Isolation Data Model

The user request specifies: *identify the changes needed for school-level tenant isolation without redesigning or migrating anything yet.*

### Architectural Analysis
The existing schema was engineered as a single-institution system. To support multiple schools (e.g. Sainthia Shishutirtha, Rampurhat Shishutirtha, Suri Shishutirtha) within a single Supabase project while maintaining rigorous isolation:

```mermaid
erDiagram
    schools ||--o{ profiles : "users_belong_to"
    schools ||--o{ academic_years : "owns"
    schools ||--o{ classes : "owns"
    schools ||--o{ students : "enrolls"
    schools ||--o{ staff_profiles : "employs"
    schools ||--o{ fee_structures : "configures"
    schools ||--o{ notices : "publishes"
    schools ||--o{ school_settings : "configures"

    schools {
        uuid id PK
        text code UK "e.g. SAINTHIA, RAMPURHAT"
        text name
        text subdomain UK "e.g. sainthia.shishutirtha.org"
        text district "Birbhum"
        boolean is_active
        timestamp created_at
    }
```

### Required Adaptations (Blueprint Only)

1. **New Tenant Master Entity**:
   ```sql
   CREATE TABLE public.schools (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     code text UNIQUE NOT NULL,
     name text NOT NULL,
     subdomain text UNIQUE NOT NULL,
     udise_code text UNIQUE,
     is_active boolean NOT NULL DEFAULT true,
     created_at timestamptz NOT NULL DEFAULT now()
   );
   ```

2. **Foreign Key Addition**:
   Add `school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE RESTRICT` to:
   - `academic_years`, `classes`, `sections`, `subjects`
   - `students`, `guardians`, `student_enrollments`
   - `staff_profiles`, `teacher_allocations`
   - `attendance_sessions`, `homework`, `assessments`, `report_cards`
   - `fee_heads`, `fee_structures`, `invoices`, `payments`
   - `admissions_applications`, `notices`, `school_settings`

3. **Compound Unique Constraints**:
   Replace single-column unique constraints with tenant-scoped constraints:
   - `students.scholar_id`: Unique per school `UNIQUE(school_id, scholar_id)`.
   - `classes.code`: Unique per school `UNIQUE(school_id, code)`.
   - `academic_years.code`: Unique per school `UNIQUE(school_id, code)`.
   - `admissions_applications.application_no`: Unique per school `UNIQUE(school_id, application_no)`.

4. **Multi-Tenant User Association**:
   Instead of `profiles` belonging to only one school, implement a membership table:
   ```sql
   CREATE TABLE public.school_memberships (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     school_id uuid NOT NULL REFERENCES public.schools(id),
     profile_id uuid NOT NULL REFERENCES public.profiles(id),
     role app_role NOT NULL,
     is_active boolean NOT NULL DEFAULT true,
     UNIQUE(school_id, profile_id)
   );
   ```

5. **Tenant-Aware RLS Functions**:
   Update helper functions to evaluate the active tenant:
   ```sql
   CREATE OR REPLACE FUNCTION public.current_school_id()
   RETURNS uuid STABLE AS $$
     SELECT NULLIF(current_setting('request.headers', true)::jsonb->>'x-school-id', '')::uuid;
   $$ LANGUAGE sql;
   ```

6. **Next.js Hostname Routing**:
   In `src/proxy.ts`, resolve `x-school-id` from the request hostname (subdomain) or custom header and forward it in downstream Supabase client requests.
