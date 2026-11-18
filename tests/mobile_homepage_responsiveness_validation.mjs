import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const ticker = read('src/components/home/HomepageEnhancements.tsx');
const styles = read('src/app/globals.css');
const navbar = read('src/components/layout/Navbar.tsx');
const pageShell = read('src/components/cms/CmsWebsitePage.tsx');

assert.ok(ticker.includes('[false, true].map'), 'Ticker must render exactly one visual group and one seamless duplicate.');
assert.ok(!ticker.includes('groupCount'), 'Ticker must not calculate and render viewport-dependent duplicate rows.');
assert.match(styles, /\.homepage-ticker-track\s*\{[\s\S]*display:\s*inline-flex;/, 'Ticker track must remain horizontal.');
assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.homepage-ticker-group--duplicate/, 'Ticker must support a reduced-motion single-group fallback.');
assert.ok(navbar.includes('min-w-0 flex-1'), 'Mobile school identity must be allowed to shrink before the actions.');
assert.ok(!navbar.includes('block truncate text-xs'), 'Mobile school name must not be forcibly truncated.');
assert.ok(navbar.includes('<details ref={mobileMenuRef}'), 'Mobile menu must use a native disclosure fallback.');
assert.ok(navbar.includes('data-menu-toggle="mobile"'), 'Mobile menu must expose a stable interaction target for browser regression tests.');
assert.ok(styles.includes('nav:not(:has(.mobile-menu[open])) .mobile-navigation-panel'), 'Closed native disclosure must hide and disable its panel.');
assert.ok(pageShell.includes('pb-[5.5rem]'), 'Mobile content must reserve space for the fixed action bar.');

console.log('✓ Mobile homepage ticker, navigation, and action-bar regression contract passed.');
