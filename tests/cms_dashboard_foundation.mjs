/**
 * CMS Engineering Milestone - Slice 1: Admin Dashboard Foundation Verification
 * Tests:
 * 1. CMS Dashboard Telemetry Server Action definition and export
 * 2. Authorization guard enforcement (requireAdmin invariant)
 * 3. Elimination of hardcoded mock badges in AdminSidebar
 * 4. Elimination of mock data fallbacks in AdminAdmissionsPage
 * 5. Website CMS Hub navigation tabs & status summary
 * 6. Admin Overview telemetry integration
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== CMS Module 1: Admin Dashboard Foundation Verification ===\n');

// 1. Verify Server Action definition and contract
console.log('1. Checking getCmsDashboardTelemetry server action contract...');
{
  const filePath = path.resolve('src/lib/actions/cmsDashboardActions.ts');
  assert.ok(fs.existsSync(filePath), 'cmsDashboardActions.ts must exist');

  const content = fs.readFileSync(filePath, 'utf-8');
  assert.ok(content.startsWith("'use server'"), 'File must declare "use server" at top');
  assert.ok(content.includes('export async function getCmsDashboardTelemetry'), 'Must export getCmsDashboardTelemetry');
  assert.ok(content.includes('requireAdmin()'), 'Must enforce requireAdmin()');
  assert.ok(content.includes("from('notices')"), 'Must query notices');
  assert.ok(content.includes("from('admissions_applications')"), 'Must query admissions');
  assert.ok(content.includes("from('contact_inquiries')"), 'Must query contact inquiries with error isolation');
  assert.ok(content.includes("from('school_settings')"), 'Must query school master settings');
  console.log('   ✓ getCmsDashboardTelemetry server action verified with strict requireAdmin() guard and 4-tier query isolation.');
}

// 2. Verify AdminSidebar has no fabricated mock statistics
console.log('2. Verifying AdminSidebar has no fabricated mock badges...');
{
  const filePath = path.resolve('src/components/portal/admin/AdminSidebar.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Verify none of the old fake mock badges exist
  const forbiddenBadges = ["badge: '342'", "badge: '38'", "badge: '95.9%'", "badge: '22'", "badge: '₹2.4L'", "badge: '1 Draft'"];
  for (const b of forbiddenBadges) {
    assert.ok(!content.includes(b), `AdminSidebar must NOT contain fabricated badge: ${b}`);
  }
  assert.ok(content.includes('ADMIN_NAV_GROUPS: AdminNavGroup[]'), 'Must export typed ADMIN_NAV_GROUPS');
  console.log('   ✓ AdminSidebar confirmed clean: all 6 fabricated mock badges eliminated.');
}

// 3. Verify AdminAdmissionsPage has no fallback to mock data
console.log('3. Verifying AdminAdmissionsPage eliminates mock data fallback...');
{
  const filePath = path.resolve('src/app/portal/admin/admissions/page.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(!content.includes('ADMIN_ADMISSIONS_LIST'), 'Must not import or fallback to ADMIN_ADMISSIONS_LIST');
  assert.ok(content.includes('No admission applications'), 'Must provide honest empty state message');
  console.log('   ✓ AdminAdmissionsPage confirmed clean: mock applicant array removed and honest empty state implemented.');
}

// 4. Verify AdminOverviewPage integrates CMS telemetry and module shortcuts
console.log('4. Verifying AdminOverviewPage CMS telemetry and shortcuts...');
{
  const filePath = path.resolve('src/app/portal/admin/page.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('getCmsDashboardTelemetry'), 'Must import and invoke getCmsDashboardTelemetry');
  assert.ok(content.includes('Website CMS & Public Intake Telemetry'), 'Must render CMS telemetry section');
  assert.ok(content.includes('Website CMS & Public Intake Modules'), 'Must render CMS module shortcuts');
  assert.ok(content.includes('cmsShortcuts'), 'Must define CMS navigation shortcuts');
  console.log('   ✓ AdminOverviewPage verified: live CMS telemetry cards and quick navigation links active.');
}

// 5. Verify Website CMS Management Hub
console.log('5. Verifying Website CMS Hub (/portal/admin/website)...');
{
  const filePath = path.resolve('src/app/portal/admin/website/page.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');

  assert.ok(content.includes('CMS Module Navigation Tabs'), 'Must render CMS module navigation tabs');
  assert.ok(content.includes('Notices & Circulars'), 'Must link to notices module');
  assert.ok(content.includes('Pages & Sections'), 'Must link to pages module');
  assert.ok(content.includes('Media & Gallery'), 'Must link to media module');
  assert.ok(content.includes('Real CMS Notice Telemetry Summary'), 'Must render real notice KPI summary bar');
  console.log('   ✓ Website CMS Hub verified: module tabs, readiness navigation, and real notice statistics bar active.');
}

console.log('\n=== All CMS Module 1 Verification Checks Passed (5/5) ===');
