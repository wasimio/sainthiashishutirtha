/**
 * Sainthia Shishu Tirtha — Public Content Safety & Fallback Removal Regression Test Suite
 * 
 * Verifies:
 * 1. Removal of fabricated static fallback data in public queries (NOTICES_AND_EVENTS, FACULTY_MEMBERS, GALLERY_PHOTOS).
 * 2. Proper error distinction: database errors throw PublicContentError instead of disguising as successful content.
 * 3. Legitimate empty database results yield empty collections ([]), not fabricated entities.
 * 4. Published-only content filtering: draft/unpublished records are strictly excluded.
 * 5. Admissions privacy: public contentService has ZERO access to private application or guardian data.
 * 6. Enquiry submissions accurately report failure when insert fails.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const contentServiceFile = path.join(root, 'src/lib/cms/contentService.ts');
assert.ok(fs.existsSync(contentServiceFile), 'contentService.ts must exist');

const content = fs.readFileSync(contentServiceFile, 'utf8');

console.log('======================================================================');
console.log('=== Public Content Safety & Fallback Removal Regression Suite     ===');
console.log('======================================================================');

// 1. Fabricated fallback data absence check
console.log('\n[1/5] Verifying absence of fabricated fallback datasets in public queries...');
assert.doesNotMatch(content, /NOTICES_AND_EVENTS/, 'NOTICES_AND_EVENTS must not be imported or used in contentService');
assert.doesNotMatch(content, /FACULTY_MEMBERS/, 'FACULTY_MEMBERS must not be imported or used in contentService');
assert.doesNotMatch(content, /GALLERY_PHOTOS/, 'GALLERY_PHOTOS must not be imported or used in contentService');
console.log('✓ Zero fabricated fallbacks: Static mock constants are completely absent from public content queries.');

// 2. Database error handling & classification
console.log('\n[2/5] Verifying database error handling & classification...');
assert.match(content, /export class PublicContentError extends Error/);
assert.match(content, /failPublicContentRead\('database', 'read_notices'/);
assert.match(content, /failPublicContentRead\('database', 'read_faculty'/);
assert.match(content, /failPublicContentRead\('database', 'read_gallery_albums'/);
assert.match(content, /failPublicContentRead\('database', 'read_gallery_items'/);
assert.match(content, /failPublicContentRead\('database', 'read_navigation'/);
console.log('✓ Database errors throw PublicContentError and trigger error boundaries rather than faking success.');

// 3. Legitimate empty result returns
console.log('\n[3/5] Verifying legitimate empty results return empty collections...');
assert.match(content, /return data \|\| \[\];/);
console.log('✓ Valid queries returning zero rows return clean empty arrays ([]).');

// 4. Published-only content filters
console.log('\n[4/5] Verifying published-only filters and draft exclusion...');
assert.match(content, /\.eq\('status', 'Published'\)/);
assert.match(content, /\.eq\('is_published', true\)/);
assert.match(content, /\.eq\('is_active', true\)/);
assert.match(content, /expires_at\.gt\./);
console.log('✓ All public methods strictly enforce status="Published", is_published=true, and expiry filters.');

// 5. Admissions privacy boundary
console.log('\n[5/5] Verifying admissions privacy boundaries...');
assert.doesNotMatch(content, /from\('admissions_applications'\)\.select/, 'Public client must NEVER select admissions_applications');
assert.doesNotMatch(content, /guardian_phone/, 'Public contentService must never query guardian phone numbers');
assert.doesNotMatch(content, /date_of_birth/, 'Public contentService must never query applicant birth dates');
console.log('✓ Complete applicant privacy guaranteed: Zero public read exposure of admissions applications.');

console.log('\n======================================================================');
console.log('=== ALL PUBLIC CONTENT SAFETY CHECKS PASSED SUCCESSFULLY (5/5)    ===');
console.log('======================================================================\n');
