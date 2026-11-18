import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

console.log('======================================================================');
console.log('=== Bilingual Public Website Integration Regression Suite         ===');
console.log('======================================================================');

console.log('\n[1/4] Verifying English URL compatibility and Bengali routing...');
const proxy = read('src/proxy.ts');
for (const route of ['/', '/about', '/academics', '/admissions', '/facilities', '/faculty', '/gallery', '/notices', '/blog', '/contact']) {
  assert.match(proxy, new RegExp(`['"]${route.replaceAll('/', '\\/')}['"]`), `${route} must remain in the public route contract.`);
}
assert.match(proxy, /pathname === BENGALI_PREFIX \? '\/' : pathname\.slice\(BENGALI_PREFIX\.length\)/);
assert.match(proxy, /NextResponse\.rewrite\(rewriteUrl/);
assert.doesNotMatch(proxy.match(/const BENGALI_PUBLIC_ROOTS[\s\S]*?\]\);/)?.[0] || '', /\/admin|\/portal|\/login/);
assert.match(proxy, /pathname === '\/portal'/, 'Existing portal isolation must remain active.');
console.log('✓ English paths remain unprefixed, /bn is internally rewritten, and protected roots are excluded.');

console.log('\n[2/4] Verifying locale-aware shell integration...');
const navbar = read('src/components/layout/Navbar.tsx');
const layout = read('src/app/layout.tsx');
assert.match(navbar, /<LanguageSwitcher/);
assert.ok((navbar.match(/<LanguageSwitcher/g) || []).length >= 2, 'Language switcher must appear in desktop and mobile navigation.');
assert.match(layout, /lang=\{localeDefinition\.htmlLang\}/);
assert.match(layout, /data-locale=\{locale\}/);
assert.match(layout, /Noto_Serif_Bengali/);
console.log('✓ Desktop/mobile navigation, document language, and Bengali typography are wired to request locale.');

console.log('\n[3/4] Verifying strict published-translation isolation...');
const localized = read('src/lib/cms/localizedContentService.ts');
assert.match(localized, /\.eq\('status', 'Published'\)/);
assert.match(localized, /\.eq\('is_complete', true\)/);
assert.match(localized, /const english = await getPublishedPage\(slug\)/);
assert.match(localized, /const masters = await getPublishedNotices/);
assert.match(localized, /const masters = await getPublishedFaculty/);
assert.match(localized, /return translation \? \[overlayBlogPost/);
assert.doesNotMatch(localized, /translate|Google Translate|fallback.*English/i, 'Bengali editorial content must not be machine-translated or silently replaced with English.');
const publicPage = read('src/lib/cms/publicPage.ts');
assert.match(publicPage, /locale === 'bn' && !settings \? null : pageData/);
assert.match(publicPage, /localizedSettings && bengaliPageAvailable \? \['en', 'bn'\] : \['en'\]/);
console.log('✓ Bengali reads require complete published translations and a still-published English master.');

console.log('\n[4/4] Verifying SEO discovery only exposes completed Bengali content...');
const sitemap = read('src/app/sitemap.ts');
assert.match(sitemap, /school_settings_translations/);
assert.match(sitemap, /website_page_translations/);
assert.match(sitemap, /\.eq\('status', 'Published'\)\.eq\('is_complete', true\)/);
assert.match(sitemap, /'x-default': englishUrl/);
assert.match(sitemap, /English sitemap intact and publish no speculative Bengali URLs/);
const revalidate = read('src/app/api/revalidate/route.ts');
assert.match(revalidate, /revalidatePath\('\/bn', 'layout'\)/);
assert.match(revalidate, /revalidateTag\(`\$\{targetTag\}:bn`/);
console.log('✓ Canonicals/hreflang, sitemap entries, and revalidation respect translation publication state.');

console.log('\n======================================================================');
console.log('=== ALL BILINGUAL PUBLIC INTEGRATION CHECKS PASSED (4/4)          ===');
console.log('======================================================================\n');
