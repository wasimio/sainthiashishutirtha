# Step 7B.0 — Public Website Redesign & Bilingual Architecture Audit

**Date:** 5 November 2026  
**Scope:** `D:\sainthiashishutirtha` (public website), with read-only contract inspection of `D:\sainthia-shishu-tirtha-cms` (CMS).  
**Method:** Source, migration, type, and validation-command review only. No application code, database data, schema, policy, authentication, CMS publishing behaviour, dependency, deployment, or configuration was changed.

## 1. Executive summary

The public site is a Next.js **16.4.2** / React 19 App Router application using Tailwind CSS v4, Supabase public reads, and a reusable CMS page shell. It already has a promising foundation for the requested redesign: central `CmsWebsitePage`, `Navbar`, `Footer`, page-section renderer, published-only Supabase readers, cache tags, on-demand revalidation, responsive layout utilities, accessibility primitives, and Bengali-capable web fonts.

It is **not yet an internationalized application**. The root HTML language is fixed to English; public URLs, navigation, metadata, structured data, validation feedback, CMS schemas, published content readers, date formatting, and most UI strings are English-only. Bengali occurs in school-data content and font setup, rather than as a selectable locale. There is no language switcher, locale persistence, locale route namespace, dictionary layer, or `hreflang` metadata.

The smallest reliable architecture is an explicit two-locale model: retain the present English routes as canonical (`/about`, `/blog/foo`) and add Bengali only below `/bn` (`/bn/about`, `/bn/blog/foo`). Keep locale-neutral IDs and media assets, but add locale-scoped text records and publication completeness checks in the CMS before a locale becomes public. This preserves every current English URL and lets existing published English content remain live during Bengali editorial work.

The current CMS publishing model is robust for one language: page drafts are revisioned and atomically published, public readers exclude draft fields, notices/blog have explicit status lifecycles, and CMS changes invoke the public-site revalidation endpoint. It is not presently capable of independently drafting/publishing English and Bengali versions; that needs an approved schema and CMS workflow extension before implementation.

## 2. Repository and current route inventory

### Runtime and structure

| Area | Finding |
| --- | --- |
| Framework | Next.js 16.4.2, App Router under `src/app`; `cacheComponents` and `partialPrefetching` enabled. |
| Routing interceptor | `src/proxy.ts` is correctly named for Next 16. It refreshes Supabase sessions and redirects `/portal`, `/admin`, `/parent`, and `/login` paths to `/portal-coming-soon`. It has no locale behavior. |
| Root layout | `src/app/layout.tsx` owns fonts, global CSS, `lang="en"`, static institution metadata, skip link, and admission modal provider. |
| Layout hierarchy | There is one root layout; protected portal subtrees have their own layouts. Public pages use either `CmsWebsitePage` or direct `Navbar`/`Footer` composition. |
| Loading/error states | Public root has `error.tsx` and `not-found.tsx`; no public route-specific `loading.tsx` files were found. CMS contains its own editor loading states. |
| Redirects/canonicals | No `redirects()` configuration or public rewrite configuration exists. Proxy redirects only private/legacy portal paths. Blog articles are the only audited public templates with explicit canonical metadata; no site-wide `metadataBase`, canonical policy, or language alternates exist. |
| Crawl controls | `robots.ts` excludes portal/admin/parent/auth/login/coming-soon paths. `sitemap.ts` lists English static, academic, notice, and blog URLs only. |

### Public URL inventory

| Current URL | Template/data source | Metadata/status observations | Bilingual redesign note |
| --- | --- | --- | --- |
| `/` | CMS page slug `home` via `CmsWebsitePage` | CMS title/description with English fallback; `notFound()` when unpublished | Preserve as English canonical home; Bengali counterpart `/bn`. |
| `/about` | CMS page slug `about` | CMS metadata fallback | Good candidate for locale-aware CMS page template. |
| `/academics` | CMS page slug plus hard-coded `ACADEMIC_PROGRAMS` catalogue | CMS metadata fallback | Split current code-owned program copy into locale content/config or a dedicated curriculum contract. |
| `/academics/[classId]` | Hard-coded `CLASS_DETAILS`, three generated params | Dynamic segment is currently English slug/data only | Retain English class slugs; plan stable `content_id` and locale-specific slug mapping if Bengali slugs are desired. |
| `/admissions` | CMS page plus hard-coded `ADMISSION_DETAILS`, shared admission modal | CMS metadata fallback; public write form remains English | Localize presentation, validation/error text, and selects; do not change existing application RPC contract in first rollout. |
| `/facilities` | CMS page plus hard-coded `SCHOOL_FACILITIES` | CMS metadata fallback | Move descriptive/card content to localized content contract. |
| `/faculty` | CMS page plus published `faculty_members` | Uses live published rows; public fallback image remains in code | Faculty name can be shared; role, department, qualification, bio and alt text need locale fields. |
| `/gallery` | CMS page plus published `gallery_items` | Uses live published rows and media URL resolver | Titles, captions, alt text, category labels need locale fields; image/media IDs stay shared. |
| `/notices` | CMS page plus published `notices` | Published/expiry filters; dates forced to `en-GB` | Give notice body/title/summary/meta a locale version, then format as `bn-IN` for Bengali. |
| `/notices/[id]` | Published notice by slug or UUID | English breadcrumbs, labels and dates; no canonical explicit | Preserve current English slug/UUID lookup; Bengali must resolve a locale version rather than overwrite it. |
| `/blog` | Published `blog_posts`, categories, query filters/pagination | Dynamic metadata; English search/filter labels | Locale-aware category names, query strings, date format, navigation and metadata required. |
| `/blog/[slug]` | Published blog post and related posts | Explicit English canonical/OG/Twitter/BlogPosting data | Stable post identity plus locale-specific slug/content/canonical is required. |
| `/contact` | CMS page slug `contact` | CMS metadata fallback; contact form is rendered from section content | Localize all form copy, client validation, success/error states, contact labels and map accessibility text. |
| `/portal-coming-soon` | Code-owned static public-facing notice | `noindex, nofollow` | Keep outside locale rollout unless a Bengali operational version is approved. |
| `/robots.txt`, `/sitemap.xml` | Metadata routes | English-only public URLs in sitemap | Generate explicit English and Bengali entries after `hreflang`/locale publishing rules are approved. |

### Non-public / operational routes observed

`/admin`, `/admin/admissions`, `/parent/*`, `/login`, and `/portal/{admin,council,parent,staff}/*` exist in the App Router but are intercepted by Proxy to `/portal-coming-soon`. `/auth/signout` and `/api/revalidate` are route handlers. They are not part of the public redesign and should not be locale-prefixed. Their current isolation is validated by the test suite.

## 3. Localization findings

### Current capability assessment

| Concern | Current state | Audit conclusion |
| --- | --- | --- |
| Locale selection/routing | None. No `[locale]` segment, locale matcher, redirect, rewrite, cookie, or path helper. | Required work. |
| Language switcher | None in desktop or mobile navigation. | Required work. |
| Translation runtime/package | No i18n package or dictionaries found. | A small native server dictionary layer is sufficient for two locales; do not add a package unless CMS editing needs make one beneficial. |
| English strings | Extensive hard-coded English in `Navbar`, `Footer`, page headers, quick action rail, error pages, notices/blog templates, forms, static school data, and CMS section renderer. | Must be systematically extracted by component/domain; not only page body copy. |
| Bengali data | Bengali curriculum/book-title samples occur in `src/data/schoolData.ts`; these are not full Bengali translations. | Existing Bengali text cannot be treated as a Bengali locale implementation. |
| Fonts | `Noto_Serif_Bengali` and `Hind_Siliguri` are loaded using `next/font/google`, exposed in Tailwind v4 tokens and utility classes. | Strong foundation. Apply by locale at the document/root-template level and preserve Latin fallback. |
| HTML language | Root layout fixes `<html lang="en">`. | Bengali pages must render `lang="bn"`; script metadata should also reflect Bengali. |
| Date/number formatting | Notice and blog dates use `toLocaleDateString('en-GB')`; portal currency uses `en-IN`. | Centralize `Intl.DateTimeFormat(locale)` and `Intl.NumberFormat(locale)` utilities. Use `en-IN` for English India and `bn-IN` for Bengali India. |
| Form validation and errors | Client forms and server actions return/display English messages; labels/default class values are English. | Copy should come from locale dictionaries. Validation error codes should remain stable and be mapped to locale messages at the presentation boundary. |
| Metadata/SEO | Static English root metadata; CMS page metadata is one text field set; blog per-post metadata is one text field set. | Each publicly addressable locale needs its own title, description, canonical and alternate URLs. |

### Recommended minimal localization architecture

1. Define the closed locale set `en` and `bn` in a small server-safe module (`Locale`, `DEFAULT_LOCALE`, `isLocale`, route helpers). English is implicit at the root; Bengali is explicit only under `/bn`.
2. Use a route-group/shared-template approach so English pages retain their present paths while Bengali resolves the same page template with `locale = 'bn'`. Do **not** redirect existing English paths to `/en` and do not place current English URLs behind a new locale segment.
3. Keep UI chrome in typed, version-controlled dictionaries: navigation labels, buttons, aria labels, breadcrumbs, pagination, empty states, status text, and form display messages. Server Components load the dictionary; small client components receive only their scoped copy as props. This avoids a client-wide translation bundle and fits Next 16 App Router behavior.
4. Keep editorial content in Supabase locale records, not in the UI dictionary. Use explicit locale values rather than guessing from browser headers.
5. Make language selection deterministic: switch to the equivalent localized URL when published; otherwise switch to the locale’s section/index URL or show English only according to an approved fallback policy. Persist an explicit choice in a `locale` cookie only for return preference; never use it to rewrite canonical English URLs.
6. Use the documented Next 16 approach for dynamic route locale segments and locale validation. The already-read Next documentation confirms `app/[lang]`, a single `proxy.ts`, root parameters, and server dictionary loading are supported patterns. Because English must remain unprefixed, adapt that pattern instead of adopting its “prefix every locale” redirect example.

### Translation fallback rule

For public editorial records, **no mixed-language page should be published**: Bengali routes display only when the Bengali content version is complete and published. English remains independently published and unchanged. CMS drafts may be incomplete in either locale. For chrome/static UI strings, ship complete `en` and `bn` dictionaries in the same release; do not fall back silently to English for an individual Bengali control.

## 4. CMS and Supabase content integration matrix

The public reader uses the Supabase publishable/anon client with `persistSession: false`, `use cache`, cache tags, and published-only filters. The CMS calls the public site’s authenticated `/api/revalidate` endpoint after content publication. Public website and CMS repositories share common migrations, while the CMS contains additional transactional page/section migrations; migration coordination is a release dependency.

| Public concern | Current public contract | Current publish/read rule | Bilingual dependency |
| --- | --- | --- | --- |
| School profile / identity | `school_settings` one `primary_config` record: identity, contact, address, hours, academic summary, branding URLs, social links | Public reader merges published fields over code defaults; CMS profile uses a draft/publish workflow | Keep structural facts/media shared; add locale text companion for display fields such as name variant, tagline, about, address representation, timings/labels, facilities summary and SEO. Avoid duplicating statutory identifiers. |
| CMS pages | `website_pages` has one slug/title/meta record; `website_sections` contains title/subtitle/`content_json`, sort order and draft columns | Public read requires `is_published=true`; drafts intentionally excluded. CMS has revisioned atomic page/section save/publish RPCs | Current row is one language. Add locale child/version records (or locale-specific sibling tables) with independent draft/published state, metadata and section payload. Keep a locale-neutral page key/ID. |
| Notices | `notices`: title, slug, category, content, summary, attachments, SEO fields, status/dates | Public reader requires `status='Published'`, filters expired notices; RLS limits public selection | Add locale versions for title/content/summary/meta/category display label and a locale-specific slug. Keep status/effective dates/attachments/author/pinning on master unless requirements differ. |
| Blog posts | `blog_posts`: article body, title/slug/excerpt, cover/alt, category/tags, author, status, SEO, canonical/OG | Public reader requires `Published` and `is_deleted=false`; CMS supports draft/publish/archive/soft-delete and category management | Add locale versions for title, slug, excerpt, content, alt, category name/tags, SEO/canonical and OG alt. Preserve one content identity, publication date and media asset references. |
| Faculty | `faculty_members`: name, designation, department, qualification, experience, bio, photo, sort/publish flags | Public reader requires `is_published=true` and `is_active=true` | Retain identity/photo/order as master. Localize designation, department display name, qualification/bio, specialization and image alt. |
| Gallery | `gallery_albums` and `gallery_items`: title/slug/description/category/cover and item title/caption/alt/image | Public reads published items/albums, resolves provider URLs | Retain media item/album identity and media reference. Localize title, description, caption, alt and category label; decide whether album slugs are language-specific. |
| Media | `media_assets`: file information, provider, public/thumbnail URLs, caption, alt, category, readiness/public flags | Public media RLS exposes only ready published assets; resolver supports Supabase, Hostinger, and absolute URLs | The binary/media URL remains shared. Add localized alt/caption records as necessary; do not clone files per language. |
| Navigation | `website_navigation`: one label, URL, location, external flag, target, sort/publish state | Public reader loads published rows; Navbar consumes all passed rows, Footer filters quick links | Add locale label plus locale route generation rather than storing hard-coded `/bn` URLs per row. Preserve external links and target semantics. |
| Admissions | Public modal/action writes `admissions_applications`; classes/academic years support the existing RPC | Public test suite confirms no public read exposure and validated writes | Keep submitted data contract locale-neutral. Add `submission_locale` only if reporting/audit needs it; localize UI and validation messages without changing acceptance rules. |
| Contact | Public client action writes `contact_inquiries` | Validated public write and CMS visibility workflow | Same approach as admissions; optional `submission_locale` is a later approved change. |

### Proposed schema changes — later approval only

No schema change was made. Recommended implementation design is a small **localized-content companion layer**, not duplicate school databases or tenant infrastructure:

- Locale registry/check constraint limited to `en` and `bn`.
- Master records retain immutable identity, lifecycle, sort order, relationships, publication date and shared media reference.
- Per-resource translation rows use `(master_id, locale)` uniqueness and contain translatable text, locale slug where the URL is public, SEO fields, `draft_*`/revision fields or a matching translation-level workflow, plus `is_published` and `published_at`.
- A page/section translation design should preserve the existing atomic CMS consistency guarantees. Publishing Bengali needs a transactional completeness validation that checks metadata and all required published section translations before it can expose `/bn/...`.
- Slug uniqueness must be scoped by content type and locale. Do not globally mutate existing English `slug` values.
- Generated TypeScript database types, RLS policies, CMS editor forms/actions, revalidation tags, and sitemap queries must be updated as a single approved migration series.

## 5. Design-system findings

### Existing strengths

- Tailwind v4 theme tokens in `src/app/globals.css` provide the approved **Warm Heritage × Modern Joy** palette: heritage teal, terracotta, mustard, leaf green, warm ivory/card surfaces, semantic states, announcement states, and compatibility aliases.
- Shared responsive primitives exist: `site-container`, fluid heading/body helpers, primary Bengali font utilities, shared `PageHeader`, `SkipToContent`, `QuickActionRail`, `Navbar`, `Footer`, CMS section renderer and `ui/` primitives.
- Plus Jakarta Sans/Fraunces and the two Bengali font families are already self-hosted through `next/font` runtime handling.
- The navigation drawer, quick-action rail/bottom bar, form controls and several cards use touch-target minima and `focus-visible` rings. `PageHeader` includes accessible breadcrumbs; JSON-LD helpers support School and BreadcrumbList. Blog rendering sanitizes rich content and handles responsive tables/video embeds.
- The dependency list contains no heavy animation library; interaction is CSS-transition and native React/browser based.

### Inconsistencies and redesign implications

| Finding | Impact/recommendation |
| --- | --- |
| Components frequently use hard-coded legacy teal/slate/hex values (`#308599`, `#EAF5F7`, `#1B2E35`) alongside current semantic token names. | Normalize to a small semantic component-token set during redesign. Keep compatibility aliases temporarily; avoid a wholesale visual rewrite before templates are migrated. |
| CMS section types are useful but their generic renderer uses non-localized fallback/warning text and preview collections embedded in `content_json`. | Retain the model but make each section renderer locale-aware, typed by section schema, and avoid generic English fallback text in public rendering. |
| `academics`, class detail, admissions and facilities combine CMS shell/metadata with large code-owned content. | Convert each to a template with a clear content boundary; migrate data only after English parity checks. |
| Navbar and Footer are reusable but have embedded English defaults and route literals; header nav does not filter `menu_location` itself. | Keep components, inject localized labels/links/contact labels/CTA values, and have the caller pass explicitly filtered header/footer configs. |
| Public faculty uses an Unsplash fallback photo despite the public reader otherwise avoiding fabricated datasets. | For redesign, use an explicit CMS placeholder or empty-state treatment rather than remote fallback portraits. |
| Accessibility intent is good but utility usage is uneven; no audit indicates automated contrast, keyboard-flow, reduced-motion, or Bengali screen-reader verification. | Add these to the redesign definition of done. Preserve visible focus; add `prefers-reduced-motion` coverage for moving/transitional elements. |
| Current Step 7A.1 evidence is available only as a CMS visual-regression repair report; the referenced Step 7A.0/7A.1 reports are absent from both inspected checkouts. | Treat `globals.css` and the CMS 7A.1.1 evidence as the available token source; confirm missing source-of-truth documents before changing token governance. |

## 6. Proposed reusable component architecture

This is a single-school foundation, not a multi-tenant design. Use configuration and content boundaries, not tenant IDs, tenant lookups, or tenant databases.

```text
school-site/
  config/                 school identity, site URL, supported locales, fixed rules
  i18n/                   locale guards, route helpers, chrome dictionaries, Intl formatters
  content/                typed CMS readers and locale-aware view models
  components/
    primitives/           Button, Link, Card, Badge, input, dialog, focus/motion utilities
    layout/               SiteShell, Header, Footer, LocaleSwitcher, breadcrumbs, quick actions
    sections/             Hero, feature grid, text/media, stat strip, CTA, FAQs, contact block
    collections/          Notice, blog, faculty, gallery cards/list/detail patterns
  templates/              Home, StandardPage, CollectionIndex, ArticleDetail, AcademicProgramme,
                          Admissions, Contact
  app/                    thin routes that validate locale, load a template view model and metadata
```

### Boundary rules

- **School identity/branding:** one typed configuration adapter backed by published school settings with safe code defaults only for non-editorial operational values. Logo/favicon/media references and statutory facts are centralized here.
- **Navigation configuration:** CMS supplies ordered semantic items; a locale route builder maps internal targets to the current locale while external links remain unchanged. The language switcher is a first-class layout control, not a CMS nav item.
- **Templates:** own page composition, semantic heading order, metadata inputs, and responsive layout. They receive typed view models, never raw `content_json` in broad component trees.
- **Reusable UI:** own tokens, accessibility, interaction and visual behavior; they do not query Supabase, select locales, or own school-specific phrases.
- **CMS content:** own translated editorial copy, media references, section order and per-locale publishing state. Validate payloads in CMS and again defensively on public read.
- **School business rules:** admissions eligibility, required fields, contact routing, curriculum classes, official identifiers and date rules stay in explicitly named single-school services/config modules. Do not hide these rules in generic templates or translation files.

## 7. Recommended English/Bengali routing and SEO strategy

### Route policy

| Locale | URL policy | Canonical behavior |
| --- | --- | --- |
| English (`en`) | Existing root URLs remain exactly as they are: `/`, `/about`, `/notices/foo`, `/blog/foo`. | Self-canonical English URL. No `/en` duplicate route. |
| Bengali (`bn`) | New explicit prefix: `/bn`, `/bn/about`, `/bn/notices/<bn-slug>`, `/bn/blog/<bn-slug>`. | Self-canonical Bengali URL only after Bengali content is complete/published. |

This avoids breaking links, bookmarks, paid/printed material and current search indexing. It is clearer than host-based routing for one school and produces a visible, shareable language choice. Browser `Accept-Language` may set an initial suggestion/cookie, but must not redirect a direct English URL to Bengali; direct URL and user selection win.

### Dynamic routes

- Existing English notice/blog slugs stay immutable for compatibility.
- Give each translated item a stable master ID and per-locale public slug. Resolve `/blog/<en-slug>` to English and `/bn/blog/<bn-slug>` to Bengali without using title translation as an implicit lookup.
- For academic segments, preserve the current English `classId` values. Prefer stable program keys beneath `/bn/academics/<same-key>` in the first release; Bengali-readable slugs can be introduced only with explicit mapping and redirects after approval.
- On a missing/unpublished Bengali translation, return 404 for a direct Bengali deep link rather than rendering English at a Bengali canonical URL. The switcher can lead users to the available English URL with a clear, translated availability message.

### Metadata and discovery

- Set `metadataBase` once from the verified site URL, then produce locale-specific title/description/OG/Twitter/JSON-LD values at each template boundary.
- Emit `alternates.languages` / `hreflang` for `en-IN`, `bn-IN` and a sensible `x-default` (English) only when both variants are published. Do not advertise an alternate that returns 404.
- Use self-canonical URLs; do not canonicalize Bengali pages to English.
- Extend sitemap output with every published locale URL, using content `updated_at`/translation publication timestamps; keep private routes excluded. Retain `robots.ts` exclusion policy.
- Localize visible page headings/breadcrumbs/structured data labels. Preserve identifiers, addresses, U-DISE and phone numbers in their authoritative form.

## 8. Database, publishing and integration dependencies

1. **CMS schema and types:** approved localized companion tables/columns, generated type updates in both repositories, and matching migrations in the shared Supabase project are prerequisites. The public repo currently has fewer CMS-specific page transaction migration files than the CMS repo; reconcile migration ownership/order before release.
2. **Transactional publication:** retain existing draft isolation and revision conflict semantics. Add locale-level completeness validation before a translation publishes. English publication must not be blocked by incomplete Bengali drafts.
3. **RLS:** maintain anonymous read access only to published locale records and ready published media. Translation drafts must remain unavailable to public/anon roles. CMS content-editor role restrictions and audit logging remain in force.
4. **Revalidation:** add locale-aware cache tags (for example, `page_about:bn`, `blog_<id>:bn`) and revalidate the corresponding locale path plus shared site shell when navigation/settings change. Keep the authenticated cross-app revalidation secret contract unchanged.
5. **Forms:** admission/contact writes remain locale-neutral in phase one. If `submission_locale` is added, it should be optional/backfilled safely and used for reporting, not as an authorization or routing signal.
6. **Media:** keep existing Supabase/Hostinger URLs and resolver behavior. Localize descriptive metadata; do not move or duplicate current media URLs during redesign.
7. **Authentication boundary:** localized public pages must remain public and the private route interception matcher must exclude static/internal assets correctly while continuing to protect all current `/portal`, `/admin`, `/parent` and `/login` paths.

## 9. Risks and compatibility considerations

| Risk | Current evidence | Mitigation |
| --- | --- | --- |
| English URL breakage | Current URLs include static pages, notice slug/UUID compatibility and blog slugs. | Preserve root English routes, add no `/en` redirect, retain English slug records, regression-test old URLs. |
| Mixed-language public pages | No locale fields or per-locale publish state exists. | Locale-specific completeness gate; 404 incomplete Bengali routes; complete chrome dictionaries before release. |
| Publishing regression | CMS page publication is transactional/revisioned today. | Extend, do not bypass, existing atomic RPC workflow; test English and Bengali draft/publish/unpublish independently. |
| Supabase migration mismatch | Public and CMS share much but not all migrations. | Choose a single migration owner/order and deploy approved migrations once before dependent code. |
| Static code-owned copy drifts from CMS | Academics, admissions, facilities and class detail contain major hard-coded datasets. | Inventory and migrate one template at a time, using content freeze/parity snapshots. |
| SEO duplication/missing alternates | Canonical metadata is inconsistent today; sitemap is English only. | Central metadata helper, self-canonical policy, conditional hreflang, sitemap verification. |
| Dynamic slug collisions | `slug` columns are currently globally English-oriented. | Locale-scoped unique keys and stable master identity; never translate in place. |
| Forms and validation confusion | User-facing form messages/labels and telephone fallbacks are hard-coded English. | Use localized message dictionaries and preserve stable server error codes/RPC shape. |
| Typography/layout | Bengali fonts exist but have not been exercised across navigation, cards, metadata and small touch targets. | Bengali visual QA at 320/360/375/768/1024+ widths; test wrapping, line height, focus and screen readers. |
| Existing quality debt | Lint has three current errors; working tree was already dirty before audit. | Do not conflate redesign with unrelated cleanup. Track lint errors and data/content inconsistencies separately; use clean branch/worktree discipline for implementation. |

### Rollback plan

Release redesign behind a reversible deployment/feature boundary while retaining existing English route handlers and content reads. First deploy schema additions that are backward compatible; then CMS draft UI; then Bengali routes/templates; then switcher and sitemap/hreflang. A rollback removes Bengali route exposure and returns templates to the existing English renderer without deleting locale rows, media, English slugs or existing public data. Never make destructive migrations part of the first bilingual release.

## 10. Recommended implementation order

1. Obtain the decisions in section 12 and reconcile public/CMS migration ownership.
2. Establish locale types, route helpers, server dictionaries, `Intl` formatting helpers and locale-neutral school configuration without altering public routes.
3. Introduce shared redesign primitives and `SiteShell` while preserving the existing visual token aliases and current English route outputs.
4. Design and approve the localized Supabase companion schema, RLS, generated types and transaction/RPC publish rules; migrate no English text in place.
5. Extend CMS editing, preview, validation, auditing and publish/unpublish actions for per-locale draft completeness.
6. Convert CMS page/section reader and renderer to typed, locale-aware view models; migrate English page templates one at a time with URL/content parity tests.
7. Convert code-owned content domains (academic programme/class details, admissions and facilities) into approved structured content/config contracts with both language payloads.
8. Add `/bn` page routes and the visible locale switcher only after complete Bengali content is published for each corresponding surface.
9. Add locale metadata, canonical/hreflang, sitemap entries, localized JSON-LD and locale-aware cache invalidation.
10. Run full visual, accessibility, mobile, content, SEO, security/RLS, old-URL and rollback verification before broad Bengali indexing.

## 11. Validation results

Commands were run without installing dependencies, applying fixes, or altering application source. `next build` writes only to ignored `.next`; `tsc` was invoked with `--incremental false` to avoid TypeScript build-info writes. The working tree was already dirty before the audit and remained so except for this report.

| Check | Result | Notes |
| --- | --- | --- |
| `npx tsc --noEmit --incremental false` | Passed | No output, exit success. |
| `npm test` | Passed | All six public suites passed: content safety, portal isolation, hybrid media, admission/contact workflow, notice attachment and blog renderer. Admission/contact test writes were explicitly cleaned by its own test flow. Node emitted expected experimental type-stripping/module-type warnings. |
| `npm run lint` | Failed: 3 errors, 26 warnings | Errors: synchronous setState-in-effect in `CmsImage.tsx`; two explicit `any` uses in `contentService.ts` and `resolveMediaUrl.ts`. Warnings are predominantly unused imports/variables. No auto-fix was run. |
| `npm run build` | Passed | Next.js 16.4.2 Turbopack production build compiled, type-checked and generated 62 routes. It confirms current public routes compile, including existing dynamic/partial-prerender routes. |
| Route/config/source inspection | Completed | No public locale routing/dictionaries/switcher/hreflang found; no conventional redirects found. |
| CMS contract/migration inspection | Completed | Confirmed published-only public reads, CMS revalidation, draft/publish workflow and English-only text contracts. |

## 12. Decisions requiring user approval

1. Approve **English root URLs + `/bn` Bengali prefix** as the canonical route policy, with no `/en` URLs and no automatic redirect away from an explicitly requested English URL.
2. Approve the per-resource localized companion-record model and locale-level publication gate, rather than putting multilingual text into one large JSON field or overwriting current English columns.
3. Confirm the Bengali locale convention: `bn-IN` for formatting and `lang="bn"` for document language, unless the school requires a different language/region policy.
4. Decide whether Bengali public slugs should be Bengali-readable now or whether stable English program/identifier slugs should be used under `/bn` in the first release. The latter is safer for initial rollout.
5. Confirm required Bengali coverage for launch: all current public pages and dynamic notices/blogs versus only core pages initially. The recommendation is all visible shell strings plus any Bengali route that is exposed; incomplete routes should not be indexed or linked as translations.
6. Approve the desired translation ownership and review workflow in CMS (author, reviewer, publisher), including who may mark a Bengali version complete.
7. Confirm whether form submissions must record the selected display locale. This is optional and should not delay UI localization if reporting does not require it.
8. Confirm the verified production `NEXT_PUBLIC_SITE_URL`/canonical host before implementation, since it controls canonical URLs, JSON-LD and sitemap entries.
9. Decide whether the existing hard-coded academic/admission/facility data should become CMS-managed in this redesign or remain school configuration; the recommendation is structured CMS-managed content for editorial descriptions and centrally configured rules for eligibility/official facts.

---

**Audit stop point:** Step 7B.1 has not been started. No implementation authorization is inferred from this report.
