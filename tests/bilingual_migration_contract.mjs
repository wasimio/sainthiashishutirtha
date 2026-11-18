import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const migrations = fs.readdirSync(path.join(root, 'supabase/migrations'));
const migrationName = migrations.find((name) => name.endsWith('_public_bilingual_content_architecture.sql'));
assert.ok(migrationName, 'The additive bilingual migration must exist.');
const sql = fs.readFileSync(path.join(root, 'supabase/migrations', migrationName), 'utf8');

console.log('======================================================================');
console.log('=== Additive Bilingual Migration Safety Contract                  ===');
console.log('======================================================================');

const tables = [
  'school_settings_translations', 'website_page_translations', 'website_section_translations',
  'website_navigation_translations', 'notice_translations', 'blog_post_translations',
  'faculty_member_translations', 'gallery_album_translations', 'gallery_item_translations',
  'media_asset_translations', 'academic_program_translations',
];

console.log('\n[1/4] Verifying additive companion tables...');
for (const table of tables) {
  assert.match(sql, new RegExp(`CREATE TABLE public\\.${table} \\(`));
}
assert.doesNotMatch(sql, /\b(?:DROP|TRUNCATE) TABLE\b/i);
assert.doesNotMatch(sql, /UPDATE\s+public\.(?:website_pages|notices|blog_posts|faculty_members|gallery_items)\b/i);
console.log('✓ Translation records are additive and do not mutate English master records.');

console.log('\n[2/4] Verifying completeness and publication guards...');
assert.ok((sql.match(/status <> 'Published' OR/g) || []).length >= 9);
assert.ok((sql.match(/is_complete boolean NOT NULL DEFAULT false/g) || []).length >= 10);
assert.match(sql, /CHECK \(locale = 'bn'\)/);
assert.match(sql, /UNIQUE \(locale, slug\)/);
console.log('✓ Draft-by-default records cannot be published unless required Bengali fields are complete.');

console.log('\n[3/4] Verifying RLS and English-master publication dependencies...');
assert.match(sql, /ALTER TABLE public\.%I ENABLE ROW LEVEL SECURITY/);
assert.ok((sql.match(/FOR SELECT TO anon/g) || []).length >= 10);
for (const master of ['website_pages', 'website_sections', 'website_navigation', 'notices', 'blog_posts', 'faculty_members', 'gallery_albums', 'gallery_items', 'media_assets']) {
  assert.match(sql, new RegExp(`FROM public\\.${master}\\b|JOIN public\\.${master}\\b`));
}
assert.match(sql, /n\.status = 'Published'/);
assert.match(sql, /b\.status = 'Published' AND b\.is_deleted = false/);
console.log('✓ Anonymous reads are RLS-gated and depend on each English master remaining public.');

console.log('\n[4/4] Verifying transactional publishing boundaries...');
assert.match(sql, /FUNCTION public\.cms_publish_page_translation/);
assert.match(sql, /FOR UPDATE/);
assert.match(sql, /Translation revision conflict/);
assert.match(sql, /SECURITY INVOKER/g);
assert.match(sql, /REVOKE ALL ON FUNCTION public\.cms_publish_page_translation\(uuid, integer\) FROM PUBLIC, anon/);
assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.cms_publish_page_translation\(uuid, integer\) TO authenticated/);
console.log('✓ Page/section publishing is transactional, optimistic, invoker-secured, and editor-only.');

console.log('\n======================================================================');
console.log('=== ALL BILINGUAL MIGRATION CONTRACT CHECKS PASSED (4/4)          ===');
console.log('======================================================================\n');
