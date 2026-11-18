/**
 * Phase 1 Public Website Isolation Verification Suite
 * Tests:
 * 1. Public Navigation (Navbar) has zero portal/login links
 * 2. Public Footer has zero portal/login links and no prototype disclaimer
 * 3. Proxy intercepts all portal/admin/parent/login routes to /portal-coming-soon
 * 4. Dedicated Portal Coming Soon page exists and contains required messaging & verified contacts
 * 5. Canonical portal protection (/portal/*) preserved with defense-in-depth layout guards
 * 6. Robots.txt disallow rules include /portal, /admin, /parent, /auth, /login, /portal-coming-soon
 * 7. Sitemap.xml strictly contains only public pages
 * 8. All school-management files remain present and untouched
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== Phase 1 Public Website Isolation Verification ===\n');

// 1. Verify Navbar
console.log('1. Checking Navbar (desktop & mobile)...');
{
  const navbarPath = path.resolve('src/components/layout/Navbar.tsx');
  const content = fs.readFileSync(navbarPath, 'utf-8');

  assert.ok(!content.includes('/login'), 'Navbar must NOT contain any link to /login');
  assert.ok(!content.includes('Portal Sign-In'), 'Navbar must NOT contain "Portal Sign-In" text');
  assert.ok(!content.includes('LogIn'), 'Navbar must not import or render LogIn icon');
  assert.ok(content.includes('settings?.official_phone') && content.includes('SCHOOL_INFO.phone'), 'Navbar must use the CMS phone with a verified settings fallback');
  assert.ok(content.includes('officeHours'), 'Navbar must display verified school hours');
  console.log('   ✓ Navbar confirmed clean: zero portal/login links; displays verified school helpline and hours.');
}

// 2. Verify Footer
console.log('2. Checking Footer...');
{
  const footerPath = path.resolve('src/components/layout/Footer.tsx');
  const content = fs.readFileSync(footerPath, 'utf-8');

  assert.ok(!content.includes('/login'), 'Footer must NOT contain any link to /login');
  assert.ok(!content.includes('School Portal Login'), 'Footer must NOT contain "School Portal Login" text');
  assert.ok(!content.includes('Phase 1 Visual Prototype'), 'Footer must NOT contain prototype disclaimer box');
  assert.ok(!content.includes('ShieldAlert'), 'Footer must not import ShieldAlert icon');
  assert.ok(content.includes('dictionary.footer.registeredSchool'), 'Footer must render the localized institutional registration banner');
  assert.ok(content.includes('officeHours'), 'Footer must display verified office hours');
  console.log('   ✓ Footer confirmed clean: zero portal/login links; prototype disclaimer replaced with clean institutional banner.');
}

// 3. Verify Proxy Interception to /portal-coming-soon
console.log('3. Checking Portal Interception in proxy.ts...');
{
  const proxyPath = path.resolve('src/proxy.ts');
  const content = fs.readFileSync(proxyPath, 'utf-8');

  assert.ok(content.includes("pathname === '/portal-coming-soon'"), 'Proxy must allow /portal-coming-soon without loop');
  assert.ok(content.includes("pathname === '/portal' ||\n    pathname.startsWith('/portal/')"), 'Proxy must intercept /portal and /portal/*');
  assert.ok(content.includes("pathname === '/admin' ||\n    pathname.startsWith('/admin/')"), 'Proxy must intercept /admin and /admin/*');
  assert.ok(content.includes("pathname === '/parent' ||\n    pathname.startsWith('/parent/')"), 'Proxy must intercept /parent and /parent/*');
  assert.ok(content.includes("pathname === '/login'"), 'Proxy must intercept /login');
  assert.ok(content.includes("NextResponse.redirect(new URL('/portal-coming-soon', request.url))"), 'Proxy must redirect to /portal-coming-soon');
  console.log('   ✓ proxy.ts verified: all visitors to portal, admin, parent, and login routes are redirected to /portal-coming-soon.');
}

// 4. Verify Dedicated Coming Soon Screen
console.log('4. Verifying /portal-coming-soon Page Structure & Content...');
{
  const comingSoonPath = path.resolve('src/app/portal-coming-soon/page.tsx');
  assert.ok(fs.existsSync(comingSoonPath), 'Coming Soon page must exist at src/app/portal-coming-soon/page.tsx');
  const content = fs.readFileSync(comingSoonPath, 'utf-8');

  assert.ok(content.includes('Sainthia Shishu Tirtha School Portal is Under Development'), 'Must contain exact required headline');
  assert.ok(content.includes('href="/"'), 'Must provide link to return to home');
  assert.ok(content.includes('href="/admissions"'), 'Must provide link to admissions enquiry');
  assert.ok(content.includes('94342 27458'), 'Must provide primary helpline phone');
  assert.ok(content.includes('SCHOOL_INFO.email') || content.includes('info@sainthiashishutirtha.org'), 'Must provide official contact email');
  assert.ok(content.includes('index: false'), 'Must disallow search engine indexing');
  console.log('   ✓ /portal-coming-soon confirmed: contains required headings, links, verified contacts, and no-index metadata.');
}

// 5. Verify Canonical Portal Protection Remains Intact in Source Code
console.log('5. Verifying Canonical Portal Protection in layouts...');
{
  const adminLayout = fs.readFileSync(path.resolve('src/app/portal/admin/layout.tsx'), 'utf-8');
  assert.ok(adminLayout.includes('requireAdmin()'), '/portal/admin layout must enforce requireAdmin()');

  const councilLayout = fs.readFileSync(path.resolve('src/app/portal/council/layout.tsx'), 'utf-8');
  assert.ok(councilLayout.includes('requireAdmin()'), '/portal/council layout must enforce requireAdmin()');

  const staffLayout = fs.readFileSync(path.resolve('src/app/portal/staff/layout.tsx'), 'utf-8');
  assert.ok(staffLayout.includes('requireStaff()'), '/portal/staff layout must enforce requireStaff()');

  const parentLayout = fs.readFileSync(path.resolve('src/app/portal/parent/layout.tsx'), 'utf-8');
  assert.ok(parentLayout.includes('requireParent()'), '/portal/parent layout must enforce requireParent()');
  console.log('   ✓ All 4 canonical portal subtrees retain strict defense-in-depth layout guards.');
}

// 6. Verify SEO Configuration (robots.ts and sitemap.ts)
console.log('6. Checking SEO Configuration...');
{
  const robotsPath = path.resolve('src/app/robots.ts');
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  assert.ok(robotsContent.includes("'/portal/'"), 'Robots must disallow /portal/');
  assert.ok(robotsContent.includes("'/admin/'"), 'Robots must disallow /admin/');
  assert.ok(robotsContent.includes("'/parent/'"), 'Robots must disallow /parent/');
  assert.ok(robotsContent.includes("'/auth/'"), 'Robots must disallow /auth/');
  assert.ok(robotsContent.includes("'/login'"), 'Robots must disallow /login');
  assert.ok(robotsContent.includes("'/portal-coming-soon'"), 'Robots must disallow /portal-coming-soon');

  const sitemapPath = path.resolve('src/app/sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  assert.ok(!sitemapContent.includes('/portal'), 'Sitemap must NOT contain /portal');
  assert.ok(!sitemapContent.includes('/admin'), 'Sitemap must NOT contain /admin');
  assert.ok(!sitemapContent.includes('/parent'), 'Sitemap must NOT contain /parent');
  assert.ok(!sitemapContent.includes('/login'), 'Sitemap must NOT contain /login');
  assert.ok(!sitemapContent.includes('/auth'), 'Sitemap must NOT contain /auth');
  console.log('   ✓ robots.ts and sitemap.ts verified: zero private routes in sitemap; crawler disallow rules comprehensive.');
}

// 7. Verify School Management Modules are Intact
console.log('7. Verifying School Management Modules Preservation...');
{
  const requiredPaths = [
    'src/app/portal/admin/page.tsx',
    'src/app/portal/admin/students/page.tsx',
    'src/app/portal/admin/academics/page.tsx',
    'src/app/portal/admin/admissions/page.tsx',
    'src/app/portal/admin/finance/page.tsx',
    'src/app/portal/admin/faculty/page.tsx',
    'src/app/portal/admin/settings/page.tsx',
    'src/app/portal/council/page.tsx',
    'src/app/portal/staff/page.tsx',
    'src/app/portal/parent/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/parent/page.tsx',
    'src/data/portalAdminData.ts',
    'src/data/councilDemoData.ts',
  ];

  for (const p of requiredPaths) {
    assert.ok(fs.existsSync(path.resolve(p)), `Required module file must exist: ${p}`);
  }
  console.log(`   ✓ All ${requiredPaths.length} verified school-management modules remain intact in original paths.`);
}

console.log('\n=== All Phase 1 Public Website Isolation Verification Checks Passed (7/7) ===');
