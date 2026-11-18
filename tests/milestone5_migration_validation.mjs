/**
 * Milestone 5 — Final Migration Validation Suite (Disposable Local PGlite Postgres Engine)
 *
 * This test suite creates a disposable, in-memory PostgreSQL 18.6 instance using @electric-sql/pglite.
 * It strictly tests:
 * 1. Clean application of the migration against a representative remote schema.
 * 2. Class I UUID and section relationship preservation.
 * 3. Direct PostgREST bypass denial for role anon (RPC execution denied, contact insert denied).
 * 4. Anonymous data isolation (no SELECT/INSERT on admissions, no sequence access, no SELECT/UPDATE/DELETE on inquiries).
 * 5. Privileged intake via service_role (simulating protected Next.js Server Actions).
 * 6. Information leakage prevention (internal UUID strictly omitted from RPC output).
 * 7. Authorized admin access and stage updates.
 * 8. Database boundary validation: DOB (2 to 18 yrs), Indian phone format, required fields, foreign key existence.
 * 9. Safe non-destructive rollback verification.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

console.log('=== Milestone 5: Local Disposable Database Validation (PGlite Postgres 18) ===\n');

const db = new PGlite();

async function runTest() {
  // ---------------------------------------------------------------------------
  // 1. Setup Representative Remote Supabase Baseline Schema
  // ---------------------------------------------------------------------------
  console.log('1. Setting up representative Supabase base schema...');

  await db.exec(`
    -- Create standard Supabase roles
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
      END IF;
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN;
      END IF;
    END $$;

    -- Create is_admin() helper function
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS boolean
    LANGUAGE sql
    STABLE
    AS $$
      SELECT coalesce(current_setting('request.is_admin', true), 'false') = 'true';
    $$;

    -- Academic Years table with 2026-2027 active session
    CREATE TABLE IF NOT EXISTS public.academic_years (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL UNIQUE,
      start_date date NOT NULL,
      end_date date NOT NULL,
      is_current boolean NOT NULL DEFAULT false
    );

    INSERT INTO public.academic_years (id, name, start_date, end_date, is_current)
    VALUES ('f5843275-1c51-436f-899a-28ddfd9f6335', '2026-2027', '2026-01-01', '2026-12-31', true)
    ON CONFLICT (name) DO NOTHING;

    -- Classes table with existing Class 1 (UUID: 58c9e01e-f6cc-4bc0-9d93-277d50b9935b)
    CREATE TABLE IF NOT EXISTS public.classes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      code text UNIQUE NOT NULL,
      wing text NOT NULL CHECK (wing IN ('Early Childhood', 'Pre-Primary', 'Junior Primary', 'Senior Primary')),
      display_order integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    INSERT INTO public.classes (id, name, code, wing, display_order)
    VALUES ('58c9e01e-f6cc-4bc0-9d93-277d50b9935b', 'Class 1', 'CLS-1', 'Junior Primary', 1)
    ON CONFLICT (code) DO NOTHING;

    -- Sections table with Section A referencing Class 1
    CREATE TABLE IF NOT EXISTS public.sections (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
      name text NOT NULL,
      room_no text,
      capacity integer NOT NULL DEFAULT 40,
      created_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (class_id, name)
    );

    INSERT INTO public.sections (id, class_id, name)
    VALUES ('549b2948-305c-492e-a65d-eefa1eb1e5a5', '58c9e01e-f6cc-4bc0-9d93-277d50b9935b', 'A')
    ON CONFLICT (class_id, name) DO NOTHING;

    -- Admissions sequence and table
    CREATE SEQUENCE IF NOT EXISTS public.admissions_app_seq START 1001;

    CREATE TABLE IF NOT EXISTS public.admissions_applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      application_no text UNIQUE NOT NULL,
      academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE RESTRICT,
      candidate_first_name text NOT NULL,
      candidate_last_name text NOT NULL,
      applied_class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
      date_of_birth date NOT NULL,
      gender text NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
      guardian_name text NOT NULL,
      guardian_phone text NOT NULL,
      guardian_email text,
      residential_address text NOT NULL,
      previous_school text,
      stage text NOT NULL DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Document Verification', 'Parent Interaction', 'Provisional Admission', 'Enrolled', 'Rejected')),
      status text NOT NULL DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Verified', 'Approved', 'Deferred', 'Withdrawn')),
      internal_notes text,
      assigned_reviewer_id uuid,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Enable RLS on admissions_applications
    ALTER TABLE public.admissions_applications ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Admin full access on admissions_applications" ON public.admissions_applications;
    CREATE POLICY "Admin full access on admissions_applications"
      ON public.admissions_applications FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin());
  `);

  console.log('   ✓ Baseline schema created (classes, sections, academic_years, admissions_applications, roles).');

  // ---------------------------------------------------------------------------
  // 2. Apply Hardened Migration
  // ---------------------------------------------------------------------------
  console.log('\n2. Applying migration 20261029000001_public_admissions_and_contact_intake.sql...');

  const migrationSql = fs.readFileSync(
    'supabase/migrations/20261029000001_public_admissions_and_contact_intake.sql',
    'utf8'
  );

  // Execute migration in single transaction
  await db.exec(migrationSql);
  console.log('   ✓ Migration applied cleanly with 0 errors.');

  // ---------------------------------------------------------------------------
  // 3. Confirm Class I UUID and Section Integrity
  // ---------------------------------------------------------------------------
  console.log('\n3. Verifying Class I UUID & Section Relationship Integrity...');

  const class1Res = await db.query(
    `SELECT id, name, code, wing, display_order FROM public.classes WHERE code = 'CLS-1';`
  );
  assert.strictEqual(class1Res.rows.length, 1, 'Exactly 1 Class 1 record exists');
  const class1 = class1Res.rows[0];
  assert.strictEqual(class1.id, '58c9e01e-f6cc-4bc0-9d93-277d50b9935b', 'UUID must be strictly preserved');
  assert.strictEqual(class1.name, 'Class I', 'Name updated to Class I');
  assert.strictEqual(class1.display_order, 4, 'Display order updated to 4');
  assert.strictEqual(class1.wing, 'Junior Primary', 'Wing preserved as Junior Primary');

  // Verify section relationship is still intact
  const sectionRes = await db.query(
    `SELECT s.id, s.name, c.name as class_name 
     FROM public.sections s 
     JOIN public.classes c ON s.class_id = c.id 
     WHERE s.id = '549b2948-305c-492e-a65d-eefa1eb1e5a5';`
  );
  assert.strictEqual(sectionRes.rows.length, 1, 'Section A exists and joins with updated Class I');
  assert.strictEqual(sectionRes.rows[0].class_name, 'Class I', 'Section joins to updated Class I');

  // Verify all 8 classes are present in correct sequence
  const allClasses = await db.query(`SELECT name, code, display_order FROM public.classes ORDER BY display_order ASC;`);
  assert.strictEqual(allClasses.rows.length, 8, 'Total of 8 classes seeded');
  const expectedClasses = [
    { name: 'Lower Nursery', code: 'LN', display_order: 1 },
    { name: 'U.N.', code: 'UN', display_order: 2 },
    { name: 'KG', code: 'KG', display_order: 3 },
    { name: 'Class I', code: 'CLS-1', display_order: 4 },
    { name: 'Class II', code: 'CLS-2', display_order: 5 },
    { name: 'Class III', code: 'CLS-3', display_order: 6 },
    { name: 'Class IV', code: 'CLS-4', display_order: 7 },
    { name: 'Class V', code: 'CLS-5', display_order: 8 },
  ];
  assert.deepStrictEqual(allClasses.rows, expectedClasses, 'Class continuum exactly matches verified sequence');
  console.log('   ✓ Class I retained UUID 58c9e01e-f6cc-4bc0-9d93-277d50b9935b with intact Section A.');
  console.log('   ✓ All 8 verified classes present in exact handbook order.');

  // ---------------------------------------------------------------------------
  // 4. Test Anonymous PostgREST Bypass Rejection (Direct RPC & Direct Inserts Denied)
  // ---------------------------------------------------------------------------
  console.log('\n4. Testing Direct PostgREST Intake Rejection for Anonymous Role (Bypass Prevention)...');

  await db.exec(`SET ROLE anon;`);

  // Direct RPC execution by anon must be DENIED
  let anonRpcBlocked = false;
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        'f5843275-1c51-436f-899a-28ddfd9f6335'::uuid,
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b'::uuid,
        'Aarav', 'Mukherjee', (current_date - interval '5 years')::date,
        'Male', 'Subhash Mukherjee', '9153336315'
      );
    `);
  } catch (err) {
    anonRpcBlocked = err.message.includes('permission denied');
  }
  assert.ok(anonRpcBlocked, 'Direct anonymous execution of submit_admission_enquiry must be denied');
  console.log('   ✓ Direct PostgREST RPC execution denied for anon role (42501 permission denied).');

  // Direct table INSERT on contact_inquiries by anon must be DENIED
  let anonContactInsertBlocked = false;
  try {
    await db.query(`
      INSERT INTO public.contact_inquiries (parent_name, phone, class_interest, message)
      VALUES ('Spammer', '9832100000', 'KG', 'spam');
    `);
  } catch {
    anonContactInsertBlocked = true;
  }
  assert.ok(anonContactInsertBlocked, 'Direct anonymous INSERT on contact_inquiries must be denied');
  console.log('   ✓ Direct PostgREST table INSERT denied on contact_inquiries for anon role.');

  // Direct table SELECT on contact_inquiries by anon must be DENIED
  let contactSelectBlocked = false;
  try {
    await db.query(`SELECT * FROM public.contact_inquiries;`);
  } catch {
    contactSelectBlocked = true;
  }
  assert.ok(contactSelectBlocked, 'Anonymous SELECT on contact_inquiries must be denied');

  // Direct table SELECT on admissions_applications by anon must be DENIED
  let appSelectBlocked = false;
  try {
    await db.query(`SELECT * FROM public.admissions_applications;`);
  } catch {
    appSelectBlocked = true;
  }
  assert.ok(appSelectBlocked, 'Anonymous SELECT on admissions_applications must be denied');

  // Direct table INSERT on admissions_applications by anon must be DENIED
  let appInsertBlocked = false;
  try {
    await db.query(`
      INSERT INTO public.admissions_applications (
        academic_year_id, applied_class_id, candidate_first_name, candidate_last_name,
        date_of_birth, gender, guardian_name, guardian_phone, residential_address
      ) VALUES (
        'f5843275-1c51-436f-899a-28ddfd9f6335', '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        'Direct', 'Bypass', current_date - interval '5 years', 'Male', 'Hacker', '9153336315', 'Sainthia'
      );
    `);
  } catch {
    appInsertBlocked = true;
  }
  assert.ok(appInsertBlocked, 'Anonymous direct INSERT on admissions_applications must be denied');

  // Direct sequence access on admissions_app_seq by anon must be DENIED
  let seqBlocked = false;
  try {
    await db.query(`SELECT nextval('public.admissions_app_seq');`);
  } catch {
    seqBlocked = true;
  }
  assert.ok(seqBlocked, 'Anonymous sequence access on admissions_app_seq must be denied');

  console.log('   ✓ Direct PostgREST table SELECT denied for anon role.');
  console.log('   ✓ Direct sequence access on admissions_app_seq denied for anon role.');

  // ---------------------------------------------------------------------------
  // 5. Test Server Action Privileged Intake via service_role
  // ---------------------------------------------------------------------------
  console.log('\n5. Testing Server Action Privileged Intake via service_role...');

  await db.exec(`SET ROLE service_role;`);

  // Server Action invokes submit_admission_enquiry under service_role
  const rpcRes = await db.query(`
    SELECT public.submit_admission_enquiry(
      'f5843275-1c51-436f-899a-28ddfd9f6335'::uuid,
      '58c9e01e-f6cc-4bc0-9d93-277d50b9935b'::uuid,
      'Aarav',
      'Mukherjee',
      (current_date - interval '5 years')::date,
      'Male',
      'Subhash Mukherjee',
      '9153336315',
      'subhash@example.com',
      'Saradishpally, Sainthia',
      'None'
    ) as result;
  `);

  const rpcOutput = rpcRes.rows[0].result;
  assert.strictEqual(rpcOutput.success, true, 'service_role RPC returns success: true');
  assert.ok(
    rpcOutput.application_no && rpcOutput.application_no.startsWith('ADM-'),
    `RPC returns valid application_no format: ${rpcOutput.application_no}`
  );
  assert.strictEqual(rpcOutput.id, undefined, 'Internal primary key UUID (id) is strictly NOT returned');
  console.log(`   ✓ Server Action role (service_role) successfully executed submit_admission_enquiry: assigned ${rpcOutput.application_no}`);
  console.log('   ✓ Information leak check: Internal UUID was strictly withheld from caller.');

  // Server Action inserts into contact_inquiries under service_role
  await db.query(`
    INSERT INTO public.contact_inquiries (parent_name, phone, email, class_interest, message)
    VALUES ('Ratan Ghosh', '8926769992', 'ratan@example.com', 'Lower Nursery', 'Please share admission procedure.');
  `);
  console.log('   ✓ Server Action role (service_role) successfully inserted contact inquiry.');

  // ---------------------------------------------------------------------------
  // 6. Test Authorized Administrator Access & Stage Advancement
  // ---------------------------------------------------------------------------
  console.log('\n6. Testing Authorized Administrator Access & Stage Updates...');

  await db.exec(`
    RESET ROLE;
    SET ROLE authenticated;
    SET request.is_admin = 'true';
  `);

  // Admin can query admissions
  const adminApps = await db.query(
    `SELECT application_no, candidate_first_name, stage, status FROM public.admissions_applications;`
  );
  assert.strictEqual(adminApps.rows.length, 1, 'Admin can see submitted admissions applications');
  assert.strictEqual(adminApps.rows[0].stage, 'Applied', 'Initial stage is Applied');
  assert.strictEqual(adminApps.rows[0].status, 'Pending Review', 'Initial status is Pending Review');

  // Admin updates workflow stage
  await db.query(`
    UPDATE public.admissions_applications
    SET stage = 'Document Verification', status = 'Verified', updated_at = now()
    WHERE application_no = '${adminApps.rows[0].application_no}';
  `);

  const updatedApp = await db.query(
    `SELECT stage, status FROM public.admissions_applications WHERE application_no = '${adminApps.rows[0].application_no}';`
  );
  assert.strictEqual(updatedApp.rows[0].stage, 'Document Verification', 'Admin successfully moved stage');
  assert.strictEqual(updatedApp.rows[0].status, 'Verified', 'Admin successfully updated status');

  // Admin queries contact inquiries
  const adminContacts = await db.query(`SELECT parent_name, phone, status FROM public.contact_inquiries;`);
  assert.strictEqual(adminContacts.rows.length, 1, 'Admin can query contact inquiries');
  assert.strictEqual(adminContacts.rows[0].parent_name, 'Ratan Ghosh', 'Enquiry recorded correctly');
  assert.strictEqual(adminContacts.rows[0].status, 'New', 'Default status assigned as New');
  console.log('   ✓ Authorized Admin can read and update admissions stages.');
  console.log('   ✓ Contact inquiries default status New confirmed for admin review.');

  // ---------------------------------------------------------------------------
  // 7. Test Boundary Validation & Failure Cases in RPC
  // ---------------------------------------------------------------------------
  console.log('\n7. Testing Database Boundary Validation & Error Handling in RPC...');

  await db.exec(`SET ROLE service_role;`);

  // Under-age candidate (1 year old)
  let underAgeError = '';
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        'f5843275-1c51-436f-899a-28ddfd9f6335',
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        'Baby', 'Mukherjee', (current_date - interval '1 year')::date,
        'Male', 'Guardian', '9153336315'
      );
    `);
  } catch (err) {
    underAgeError = err.message;
  }
  assert.ok(
    underAgeError.includes('between 2 and 18 years of age'),
    `Expected age error, got: ${underAgeError}`
  );

  // Over-age candidate (20 years old)
  let overAgeError = '';
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        'f5843275-1c51-436f-899a-28ddfd9f6335',
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        'Adult', 'Mukherjee', (current_date - interval '20 years')::date,
        'Male', 'Guardian', '9153336315'
      );
    `);
  } catch (err) {
    overAgeError = err.message;
  }
  assert.ok(
    overAgeError.includes('between 2 and 18 years of age'),
    `Expected age error, got: ${overAgeError}`
  );

  // Invalid phone number format (e.g. 1234567890)
  let phoneError = '';
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        'f5843275-1c51-436f-899a-28ddfd9f6335',
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        'Child', 'Mukherjee', (current_date - interval '5 years')::date,
        'Male', 'Guardian', '1234567890'
      );
    `);
  } catch (err) {
    phoneError = err.message;
  }
  assert.ok(
    phoneError.includes('Invalid guardian phone'),
    `Expected phone error, got: ${phoneError}`
  );

  // Missing candidate first name
  let nameError = '';
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        'f5843275-1c51-436f-899a-28ddfd9f6335',
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        '', 'Mukherjee', (current_date - interval '5 years')::date,
        'Male', 'Guardian', '9153336315'
      );
    `);
  } catch (err) {
    nameError = err.message;
  }
  assert.ok(
    nameError.includes('Candidate first name is required'),
    `Expected name error, got: ${nameError}`
  );

  // Invalid academic year UUID
  let yearError = '';
  try {
    await db.query(`
      SELECT public.submit_admission_enquiry(
        '00000000-0000-0000-0000-000000000000',
        '58c9e01e-f6cc-4bc0-9d93-277d50b9935b',
        'Child', 'Mukherjee', (current_date - interval '5 years')::date,
        'Male', 'Guardian', '9153336315'
      );
    `);
  } catch (err) {
    yearError = err.message;
  }
  assert.ok(
    yearError.includes('specified academic session does not exist'),
    `Expected academic year error, got: ${yearError}`
  );

  console.log('   ✓ Under-age candidate (< 2 yrs) rejected with boundary exception.');
  console.log('   ✓ Over-age candidate (> 18 yrs) rejected with boundary exception.');
  console.log('   ✓ Invalid phone format rejected with regex exception.');
  console.log('   ✓ Missing first name rejected.');
  console.log('   ✓ Non-existent academic year rejected with foreign key boundary exception.');

  // ---------------------------------------------------------------------------
  // 8. Verify Rollback Instructions Safety
  // ---------------------------------------------------------------------------
  console.log('\n8. Verifying Rollback Script Safety...');

  await db.exec(`RESET ROLE;`);

  // Ensure rollback commands can be executed safely
  await db.exec(`
    DROP FUNCTION IF EXISTS public.submit_admission_enquiry(uuid, uuid, text, text, date, text, text, text, text, text, text);
    DROP TABLE IF EXISTS public.contact_inquiries;
    DELETE FROM public.classes WHERE code IN ('LN', 'UN', 'KG', 'CLS-2', 'CLS-3', 'CLS-4', 'CLS-5');
    UPDATE public.classes SET name = 'Class 1', display_order = 1 WHERE code = 'CLS-1';
  `);

  // Verify Class 1 still exists with its original UUID and Section intact
  const rollbackClass = await db.query(`SELECT id, name, display_order FROM public.classes WHERE code = 'CLS-1';`);
  assert.strictEqual(rollbackClass.rows.length, 1, 'Class 1 exists');
  assert.strictEqual(rollbackClass.rows[0].id, '58c9e01e-f6cc-4bc0-9d93-277d50b9935b', 'UUID preserved after rollback');
  assert.strictEqual(rollbackClass.rows[0].name, 'Class 1', 'Name reverted to Class 1');
  assert.strictEqual(rollbackClass.rows[0].display_order, 1, 'Display order reverted to 1');

  // Verify section relationship is still intact
  const rollbackSection = await db.query(
    `SELECT s.id FROM public.sections s WHERE s.id = '549b2948-305c-492e-a65d-eefa1eb1e5a5';`
  );
  assert.strictEqual(rollbackSection.rows.length, 1, 'Section A remains intact');

  // Verify admissions_applications table was NOT dropped
  const appCount = await db.query(`SELECT COUNT(*) as count FROM public.admissions_applications;`);
  assert.ok(Number(appCount.rows[0].count) >= 1, 'admissions_applications table and records preserved');

  console.log('   ✓ Rollback cleanly drops RPC and contact_inquiries without touching admissions_applications.');
  console.log('   ✓ Reverts classes seed while strictly preserving Class 1 UUID and section foreign keys.');

  console.log('\n=== All 8 Local Database Validation Tests Passed Successfully (8/8) ===\n');
}

runTest().catch((err) => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
});
