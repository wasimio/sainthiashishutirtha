# Sainthia Shishutirtha — Demo Data Cleanup & Replacement Plan

**Document:** `docs/audit/DEMO_DATA_CLEANUP_PLAN.md`  
**Phase:** Phase 4A — Admin-First School Management Implementation  
**Date:** October 23, 2026  
**Status:** **ACTIVE PLAN — EXECUTION IN PROGRESS**  

---

## 1. Objectives & Scope

This document specifies the exact plan for eliminating deceptive mock data, fabricated dashboard statistics, and simulated action toasts from the Sainthia Shishutirtha Admin Portal, replacing them with authentic Supabase queries and honest, helpful empty states.

---

## 2. Classification of Data Sources

### Group A: UI-Only Mock Data & Hardcoded Sample Arrays (To Be Replaced in Code)
These files exist solely in the frontend codebase and feed mock records to React components:

1. **`src/data/portalAdminData.ts`:**
   - `ADMIN_STUDENTS_LIST` (8 mock scholars)
   - `ADMIN_FACULTY_LIST` (8 mock teachers)
   - `ADMIN_FEE_TRANSACTIONS` (6 mock receipts)
   - `ADMIN_ADMISSIONS_LIST` (8 mock applications)
   - `ADMIN_CMS_NOTICES` (5 mock circulars)
   - *Action:* Disconnect all imports in `/portal/admin/*`. Replace with real Supabase client queries via `adminService.ts`. Retain the file only as a development fallback if explicitly gated behind `process.env.NEXT_PUBLIC_USE_MOCKS === 'true'`.

2. **`src/data/councilDemoData.ts`:**
   - `COUNCIL_KPIS` (Fabricated 342 scholars, 22 staff, 89.2% attendance, ₹18.42L realized)
   - `COUNCIL_ATTENDANCE_SNAPSHOT` (Fabricated class-by-class attendance counts)
   - `COUNCIL_FEE_SUMMARY` (Fabricated ₹24.8L billed, ₹18.4L collected)
   - *Action:* Replace with database aggregate queries (`SELECT count(*)` and `SELECT sum()`). When the database is empty, display real zero values with explanatory empty states.

3. **`src/app/portal/admin/academics/page.tsx`:**
   - `ACADEMIC_CLASSES` (Hardcoded array of 6 class standards)
   - *Action:* Query `public.classes` and `public.sections`. Provide an "Add Standard / Class" creation form.

4. **`src/app/portal/admin/attendance/page.tsx`:**
   - `absenteeSample` (Hardcoded list of 4 absent scholars)
   - *Action:* Query `public.attendance_records` where `status = 'absent'`.

5. **`src/app/portal/admin/reports/page.tsx`:**
   - `reportItems` (Static download cards)
   - *Action:* Connect to real telemetry exports.

---

### Group B: Development Fixtures & Seed Scripts (Preserved for Isolated Staging)
1. **`supabase/seed.sql`:**
   - Contains reference seed data:
     - 1 Academic Year (`2026-2027`)
     - 6 Classes (`Nursery`, `KG`, `Class I`, `Class II`, `Class III`, `Class IV`)
     - 8 Subjects (`Bengali`, `English`, `Mathematics`, etc.)
     - 4 Fee Heads (`Admission Fee`, `Tuition Fee`, `Annual Session Charges`, `Examination Fee`)
   - *Safety Rule:* This file is version-controlled and is **NOT** executed automatically against the production Supabase database. It can only be executed manually or in local Supabase emulators.

---

### Group C: Live Supabase Database Records (Verified Empty)
Live inspection via `npx supabase db query --linked` confirms:
- `students`: **0**
- `academic_years`: **0**
- `classes`: **0**
- `sections`: **0**
- `fee_structures`: **0**
- `invoices`: **0**
- `payments`: **0**
- `notices`: **0**
- `staff_profiles`: **0**

*Conclusion:* There are **ZERO live demo records** in the remote Supabase database. Therefore, no destructive SQL `DELETE`, `TRUNCATE`, or cascading cleanups are required on the remote database.

---

### Group D: Public Website Content & Media (Preserved Intact)
1. **`src/data/schoolData.ts`:**
   - Contains verified school history, vision, contact details, and institutional copy.
   - *Preservation Rule:* Retained intact. The public website remains operational and unaffected. When notices or faculty records are added via the Admin Portal, the public website can gracefully merge or prioritize published database records.

2. **Placeholder Assets (`public/images/`):**
   - Campus photographs, student activity previews, and historical school building images.
   - *Preservation Rule:* Retained intact.

---

## 3. Honest Empty-State Architecture

When a portal page loads and the database has zero records, the UI must never fabricate statistics. It must display clear, styled, and actionable empty states:

| Page / Section | Empty Condition | Honest UI Representation | Actionable Next Step |
|---|---|---|---|
| **Admin Overview KPIs** | 0 Students, 0 Staff | Display `0` scholars, `0` staff, `₹0.00` collections | Render an Onboarding Stepper guiding setup |
| **Student Directory** | `students.length === 0` | *"No students have been enrolled yet in the school database."* | Primary button: **Register Student** |
| **Faculty Directory** | `staff_profiles.length === 0` | *"No faculty or staff members have been added to the directory."* | Primary button: **Add Staff Member** |
| **Academic Setup** | `classes.length === 0` | *"No academic tiers or classes have been configured."* | Primary button: **Configure Classes** |
| **Financial Treasury** | `payments.length === 0` | *"Zero payment collections recorded for this academic session."* | Primary button: **Create Fee Structure** |
| **Daily Attendance** | `sessions.length === 0` | *"No attendance registers have been opened for today. Morning registers are initiated by class teachers."* | Status badge: `Register Idle` |
| **Notices & CMS** | `notices.length === 0` | *"No official notices or circulars are currently published."* | Primary button: **Create Notice** |

---

## 4. Replacement Implementation Strategy

1. **Create Unified Admin Service (`src/lib/services/adminService.ts`):**
   Implement type-safe, error-handled query and mutation functions for all core entities:
   - Students, Guardians, Enrollments
   - Classes, Sections, Academic Years, Subjects
   - Staff Profiles & Allocations
   - Fee Heads, Fee Structures, Invoices, Payments
   - School Settings & Notices
   - Dashboard Aggregates

2. **Wire Real Data Hooks & Server Calls into Admin Pages:**
   - Each admin page will load real records on mount using `createClient()`.
   - While loading, display a clean skeleton or spinner.
   - When loaded with 0 records, display the honest empty state with active creation modal.
   - When records are created, refresh state immediately.
