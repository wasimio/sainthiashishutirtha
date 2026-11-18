import assert from 'node:assert/strict';
import {
  isMarkdownContent,
  normalizeContentToHtml,
  sanitizeBlogHtml,
  extractPlainTextSnippet,
} from '../src/lib/blog/contentProcessor.ts';

console.log('======================================================================');
console.log('=== Public Website Blog Rendering & Backward Compatibility Suite   ===');
console.log('======================================================================\n');

// 1. Legacy Markdown Article Parsing & Rendering
console.log('[1/5] Testing public rendering for existing legacy Markdown posts...');
const legacySample = `### Foundational Learning in Primary Years
Children develop cognitive confidence through unhurried phonemic awareness and mother tongue fluency.

- **Bengali Literature:** Timeless literature like *Sahaj Path*.
- **Conversational English:** Daily rhythmic vocabulary games.

1. Read aloud daily
2. Celebrate effort over accuracy`;

assert.equal(isMarkdownContent(legacySample), true);
const html = normalizeContentToHtml(legacySample);
const cleanHtml = sanitizeBlogHtml(html);

assert.ok(cleanHtml.includes('<h3>Foundational Learning in Primary Years</h3>'));
assert.ok(cleanHtml.includes('<strong>Bengali Literature:</strong>'));
assert.ok(cleanHtml.includes('<em>Sahaj Path</em>'));
assert.ok(cleanHtml.includes('<ul>'));
assert.ok(cleanHtml.includes('<ol>'));
console.log('✓ Legacy Markdown articles parse and sanitize cleanly into semantic HTML.');

// 2. Rich Text Image & Caption Block Rendering
console.log('\n[2/5] Testing public rendering for rich text images and captions...');
const imageContent = `<p>Annual Celebration highlights:</p>
<figure data-type="blog-image" class="blog-image-block my-6 text-center">
  <img src="https://example.com/gallery/sports-2026.jpg" alt="Students in relay race" data-asset-id="ast-456" data-provider="supabase" />
  <figcaption class="text-xs text-slate-500 text-center mt-2 italic">Annual Sports Meet 2026</figcaption>
</figure>`;

const renderedImage = sanitizeBlogHtml(normalizeContentToHtml(imageContent));
assert.ok(renderedImage.includes('<figure'));
assert.ok(renderedImage.includes('<img'));
assert.ok(renderedImage.includes('alt="Students in relay race"'));
assert.ok(renderedImage.includes('<figcaption'));
assert.ok(renderedImage.includes('Annual Sports Meet 2026'));
console.log('✓ Accessible image blocks, captions, and metadata render properly.');

// 3. YouTube Embed Transformation & Sandboxing
console.log('\n[3/5] Testing public video embed security attributes...');
const videoContent = `<p>Watch our Annual Day cultural performance:</p>
<div data-youtube-video><iframe src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></iframe></div>`;

const renderedVideo = sanitizeBlogHtml(normalizeContentToHtml(videoContent));
assert.ok(renderedVideo.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));
assert.ok(renderedVideo.includes('loading="lazy"'));
assert.ok(renderedVideo.includes('sandbox="allow-scripts allow-same-origin allow-presentation"'));
assert.ok(renderedVideo.includes('referrerpolicy="strict-origin-when-cross-origin"'));
console.log('✓ YouTube embeds normalized to privacy-enhanced nocookie domain with lazy loading and sandboxing.');

// 4. Safe External Link Rel Enforcement
console.log('\n[4/5] Testing automatic rel="noopener noreferrer" on external links...');
const linkContent = `<p>Check the official notification at <a href="https://birbhum.gov.in">Birbhum District Portal</a>.</p>`;
const renderedLink = sanitizeBlogHtml(normalizeContentToHtml(linkContent));
assert.ok(renderedLink.includes('target="_blank"'));
assert.ok(renderedLink.includes('rel="noopener noreferrer"'));
console.log('✓ External links automatically receive target="_blank" and rel="noopener noreferrer".');

// 5. Plain Text Snippet Safety for Previews and Meta
console.log('\n[5/8] Testing excerpt and meta snippet tag stripping...');
const mixedPost = `<h1>Headline</h1><p>First paragraph with <a href="/link">a link</a> and <strong>bold text</strong>.</p>`;
const snippet = extractPlainTextSnippet(mixedPost, 40);
assert.equal(snippet.includes('<'), false);
assert.ok(snippet.startsWith('Headline First paragraph'));
console.log('✓ Snippet extractor reliably strips HTML tags for cards and SEO descriptions.');

// 6. Table Rendering and Responsive Wrapper on Public Site
console.log('\n[6/8] Testing table sanitization and horizontal scrolling wrapper on public site...');
const tableHtml = `<table>
  <thead>
    <tr><th colspan="2">Term Schedule</th><th>Details</th></tr>
  </thead>
  <tbody>
    <tr><td>Term 1</td><td>Assessment 1</td><td>July 2026</td></tr>
  </tbody>
</table>`;
const renderedTable = sanitizeBlogHtml(normalizeContentToHtml(tableHtml));
assert.ok(renderedTable.includes('<div class="table-wrapper">'), 'Must wrap table in .table-wrapper');
assert.ok(renderedTable.includes('<th colspan="2">Term Schedule</th>'), 'Must preserve th colspan');
assert.ok(renderedTable.includes('<td>July 2026</td>'), 'Must preserve td contents');
console.log('✓ Public tables rendered with responsive wrapper and preserved table attributes.');

// 7. Responsive YouTube Embed Sizing
console.log('\n[7/8] Testing YouTube dimension stripping for 16:9 mobile responsiveness...');
const rawEmbed = `<div data-youtube-video><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="640" height="360" allowfullscreen="true"></iframe></div>`;
const renderedEmbed = sanitizeBlogHtml(normalizeContentToHtml(rawEmbed));
assert.ok(!renderedEmbed.includes('width="640"'), 'Fixed width 640 must be stripped');
assert.ok(!renderedEmbed.includes('height="360"'), 'Fixed height 360 must be stripped');
assert.ok(renderedEmbed.includes('data-youtube-video'), 'data-youtube-video preserved');
console.log('✓ YouTube embeds on public site fluidly scale to container width.');

// 8. Typography Elements Retention
console.log('\n[8/8] Testing H1, H2, H3, and Blockquote retention on public site...');
const typoContent = `<h1>Main Article Heading</h1><h2>Section Subheading</h2><h3>Subsection Focus</h3><blockquote>A quote from Rabindranath Tagore</blockquote>`;
const renderedTypo = sanitizeBlogHtml(normalizeContentToHtml(typoContent));
assert.ok(renderedTypo.includes('<h1>Main Article Heading</h1>'));
assert.ok(renderedTypo.includes('<h2>Section Subheading</h2>'));
assert.ok(renderedTypo.includes('<h3>Subsection Focus</h3>'));
assert.ok(renderedTypo.includes('<blockquote>A quote from Rabindranath Tagore</blockquote>'));
console.log('✓ Typography headings and blockquotes verified on public site.');

console.log('\n======================================================================');
console.log('=== ALL PUBLIC BLOG RENDERING VALIDATION CHECKS PASSED (8/8)       ===');
console.log('======================================================================');
