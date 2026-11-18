/**
 * Sainthia Shishu Tirtha Public Website — Notice PDF Attachments Validation Suite
 * Tests:
 * 1. Public Media URL Resolution & Attachment Parsing contracts.
 * 2. CmsDocumentDownload contract (standard <a> tag, download attribute, no Next.js image optimization).
 * 3. NoticesFilterDirectory & NoticeDetailPage attachment contracts (no alert(), accessible links).
 * 4. Draft vs Published isolation contracts (no draft notice attachments exposed).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  resolvePublicMediaUrl,
  parseNoticeAttachments,
} from '../src/lib/media/resolveMediaUrl.ts';

console.log('======================================================================');
console.log('=== Public Website Notice PDF Attachments Validation Suite         ===');
console.log('======================================================================\n');

// Mock environment
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://tybaaqktbdlnqsgodkek.supabase.co';
process.env.NEXT_PUBLIC_HOSTINGER_MEDIA_URL = 'https://media.shishutirtha.org/uploads';

// -----------------------------------------------------------------------------
// [1/4] Attachment Parsing & Storage Provider Resolution
// -----------------------------------------------------------------------------
console.log('[1/4] Testing Attachment Parsing & Provider Resolution...');

// A. Empty / Null
assert.equal(resolvePublicMediaUrl(null), '');
assert.equal(resolvePublicMediaUrl(''), '');
assert.deepEqual(parseNoticeAttachments(null), []);

// B. Supabase storage prefixed and bucket paths
const supabasePrefixedPath = 'supabase:uploads/2026/11/sports_meet_schedule.pdf';
const resolvedPrefixedUrl = resolvePublicMediaUrl(supabasePrefixedPath);
assert.equal(
  resolvedPrefixedUrl,
  'https://tybaaqktbdlnqsgodkek.supabase.co/storage/v1/object/public/public-media/uploads/2026/11/sports_meet_schedule.pdf',
  'Supabase prefixed path must resolve to public-media bucket URL'
);

const supabaseBucketPath = 'public-media/uploads/2026/11/sports_meet_schedule.pdf';
const resolvedBucketUrl = resolvePublicMediaUrl(supabaseBucketPath);
assert.equal(
  resolvedBucketUrl,
  'https://tybaaqktbdlnqsgodkek.supabase.co/storage/v1/object/public/public-media/uploads/2026/11/sports_meet_schedule.pdf',
  'Supabase public-media bucket path must resolve to public-media bucket URL'
);

// C. Hostinger storage upload path
const hostingerPath = 'hostinger:uploads/2026/11/holiday_calendar.pdf';
const resolvedHostingerUrl = resolvePublicMediaUrl(hostingerPath);
assert.equal(
  resolvedHostingerUrl,
  'https://media.shishutirtha.org/uploads/2026/11/holiday_calendar.pdf',
  'Hostinger storage path must resolve to Hostinger media URL'
);

// D. Absolute URL remains unchanged
const absUrl = 'https://example.com/documents/circular.pdf';
assert.equal(resolvePublicMediaUrl(absUrl), absUrl);

// E. Multi-attachment JSON array
const multiJson = JSON.stringify([
  {
    url: 'https://tybaaqktbdlnqsgodkek.supabase.co/storage/v1/object/public/public-media/uploads/2026/11/notice1.pdf',
    title: 'Admissions Notice.pdf',
    fileSize: 1048576,
    mimeType: 'application/pdf',
  },
  {
    url: 'https://tybaaqktbdlnqsgodkek.supabase.co/storage/v1/object/public/public-media/uploads/2026/11/notice2.pdf',
    title: 'Fee Structure.pdf',
    fileSize: 524288,
    mimeType: 'application/pdf',
  },
]);

const parsedMulti = parseNoticeAttachments(multiJson);
assert.equal(parsedMulti.length, 2);
assert.equal(parsedMulti[0].title, 'Admissions Notice.pdf');
assert.equal(parsedMulti[0].fileSize, 1048576);
assert.equal(parsedMulti[1].title, 'Fee Structure.pdf');
assert.equal(parsedMulti[1].fileSize, 524288);

// F. Calling resolvePublicMediaUrl directly on JSON string must resolve first attachment safely without crashing
const resolvedJson = resolvePublicMediaUrl(multiJson);
assert.equal(
  resolvedJson,
  'https://tybaaqktbdlnqsgodkek.supabase.co/storage/v1/object/public/public-media/uploads/2026/11/notice1.pdf',
  'JSON attachment string passed to resolvePublicMediaUrl must safely extract and resolve first attachment URL'
);

console.log('✓ Public URL resolution and attachment parsing verified across all formats.');

// -----------------------------------------------------------------------------
// [2/4] CmsDocumentDownload Component Contract Verification
// -----------------------------------------------------------------------------
console.log('\n[2/4] Verifying CmsDocumentDownload Component Contract...');

const docDownloadSource = fs.readFileSync(
  path.join(process.cwd(), 'src/components/media/CmsDocumentDownload.tsx'),
  'utf-8'
);

// Must use native anchor tag with download attribute (NOT Next.js Image)
assert.ok(
  docDownloadSource.includes('<a') && docDownloadSource.includes('download'),
  'CmsDocumentDownload must render an <a> anchor tag with download attribute'
);
assert.ok(
  !docDownloadSource.includes("next/image"),
  'CmsDocumentDownload must never import or route PDF files through Next.js image optimization'
);
assert.ok(
  docDownloadSource.includes('resolvePublicMediaUrl'),
  'CmsDocumentDownload must use pure client-safe resolvePublicMediaUrl'
);
assert.ok(
  docDownloadSource.includes('target="_blank"'),
  'CmsDocumentDownload must specify target="_blank" for non-blocking downloads'
);

console.log('✓ CmsDocumentDownload component contract verified (pure <a> tag, download attribute, no Next/Image).');

// -----------------------------------------------------------------------------
// [3/4] Public Notices Filter Directory & Detail Page Contracts
// -----------------------------------------------------------------------------
console.log('\n[3/4] Verifying Public Notices Directory & Detail Page Contracts...');

const filterDirSource = fs.readFileSync(
  path.join(process.cwd(), 'src/components/notices/NoticesFilterDirectory.tsx'),
  'utf-8'
);

// Verify alert() is gone
assert.ok(
  !filterDirSource.includes('alert('),
  'NoticesFilterDirectory must NOT contain prototype alert() calls'
);

// Verify download anchor tag exists
assert.ok(
  filterDirSource.includes('<a') && filterDirSource.includes('download'),
  'NoticesFilterDirectory must render genuine download link'
);

const detailPageSource = fs.readFileSync(
  path.join(process.cwd(), 'src/app/notices/[id]/page.tsx'),
  'utf-8'
);

assert.ok(
  detailPageSource.includes('CmsDocumentDownload'),
  'NoticeDetailPage must render CmsDocumentDownload for official PDF attachments'
);
assert.ok(
  detailPageSource.includes('parseNoticeAttachments'),
  'NoticeDetailPage must parse attachment_path via parseNoticeAttachments'
);

console.log('✓ Public pages verified: zero alert() popups, official CmsDocumentDownload integrated.');

// -----------------------------------------------------------------------------
// [4/4] Draft Notice Isolation Contract
// -----------------------------------------------------------------------------
console.log('\n[4/4] Verifying Draft & Archived Notice Isolation in Content Service...');

const contentServiceSource = fs.readFileSync(
  path.join(process.cwd(), 'src/lib/cms/contentService.ts'),
  'utf-8'
);

assert.ok(
  contentServiceSource.includes(".eq('status', 'Published')"),
  'getPublishedNotices must strictly filter for status=Published'
);

console.log('✓ Public content queries strictly enforce published status isolation.');

console.log('\n======================================================================');
console.log('=== ALL PUBLIC NOTICE PDF VALIDATION CHECKS PASSED (4/4)           ===');
console.log('======================================================================\n');
