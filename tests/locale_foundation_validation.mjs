import assert from 'node:assert/strict';
import {
  DEFAULT_LOCALE,
  LOCALE_DEFINITIONS,
  SUPPORTED_LOCALES,
  isLocale,
} from '../src/lib/i18n/locales.ts';
import {
  getLocaleFromPathname,
  getLocalePath,
  isSupportedLocale,
  stripLocalePrefix,
} from '../src/lib/i18n/routing.ts';
import { formatCurrency, formatDate, formatNumber } from '../src/lib/i18n/format.ts';
import { UI_DICTIONARIES, getUiDictionary } from '../src/lib/i18n/dictionaries.ts';

function leafPaths(value, prefix = '') {
  if (typeof value === 'string') return [prefix];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

function valueAtPath(value, path) {
  return path.split('.').reduce((current, key) => current[key], value);
}

console.log('======================================================================');
console.log('=== Step 7B.1 Locale Foundation Validation Suite                  ===');
console.log('======================================================================\n');

console.log('[1/4] Verifying the supported locale contract...');
assert.deepEqual(SUPPORTED_LOCALES, ['en', 'bn']);
assert.equal(DEFAULT_LOCALE, 'en');
assert.equal(LOCALE_DEFINITIONS.en.intlLocale, 'en-IN');
assert.equal(LOCALE_DEFINITIONS.bn.intlLocale, 'bn-IN');
assert.equal(isLocale('bn'), true);
assert.equal(isLocale('en-IN'), false);
assert.equal(isSupportedLocale('bn'), true);
assert.equal(isSupportedLocale('hi'), false);
console.log('✓ Only English and Bengali are accepted, with the approved India formats.');

console.log('\n[2/4] Verifying English-safe and Bengali-prefixed URL helpers...');
assert.equal(getLocaleFromPathname('/about'), 'en');
assert.equal(getLocaleFromPathname('/bn/about?from=switcher'), 'bn');
assert.equal(stripLocalePrefix('/bn/about?from=switcher#top'), '/about?from=switcher#top');
assert.equal(stripLocalePrefix('/bn'), '/');
assert.equal(getLocalePath('/about?from=switcher#top', 'bn'), '/bn/about?from=switcher#top');
assert.equal(getLocalePath('/bn/about?from=switcher#top', 'en'), '/about?from=switcher#top');
assert.equal(getLocalePath('/', 'bn'), '/bn');
console.log('✓ Existing English paths remain unprefixed and Bengali uses only /bn.');

console.log('\n[3/4] Verifying locale-aware formatting utilities...');
assert.equal(formatDate('2026-11-05T00:00:00.000Z', 'en', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }), '05/11/2026');
assert.match(formatDate('2026-11-05T00:00:00.000Z', 'bn', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }), /[০-৯]/);
assert.equal(formatNumber(123456, 'en'), '1,23,456');
assert.match(formatNumber(123456, 'bn'), /[০-৯]/);
assert.match(formatCurrency(750, 'en'), /₹/);
assert.throws(() => formatDate('not-a-date', 'en'), RangeError);
console.log('✓ Dates, numbers and currency use en-IN/bn-IN without a new dependency.');

console.log('\n[4/4] Verifying dictionary shape and translation completeness...');
const englishPaths = leafPaths(UI_DICTIONARIES.en);
assert.ok(englishPaths.length > 0);

for (const locale of SUPPORTED_LOCALES) {
  const dictionary = getUiDictionary(locale);
  assert.deepEqual(leafPaths(dictionary), englishPaths, `${locale} dictionary keys must match English.`);
  for (const path of englishPaths) {
    const value = valueAtPath(dictionary, path);
    assert.equal(typeof value, 'string', `${locale}.${path} must be a string.`);
    assert.ok(value.trim().length > 0, `${locale}.${path} must not be empty.`);
  }
}
assert.equal(getUiDictionary('bn').actions.applyNow, 'এখনই আবেদন করুন');
console.log('✓ English and Bengali UI dictionaries have matching, non-empty typed entries.');

console.log('\n======================================================================');
console.log('=== ALL STEP 7B.1 LOCALE FOUNDATION CHECKS PASSED (4/4)          ===');
console.log('======================================================================');
