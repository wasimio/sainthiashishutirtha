# Bengali CMS integration contract

The public application is ready to read Bengali content, but Bengali URLs remain unpublished until the additive migration is reviewed, applied, and complete editorial records are published.

## Migration boundary

Prepared migration: `supabase/migrations/20261105124408_public_bilingual_content_architecture.sql`

Do not apply it implicitly from application startup or CI. Apply it only after explicit approval and a normal Supabase migration review. The migration does not update English master records or English slugs.

## CMS editing model

The standalone CMS should keep the existing English editor unchanged and add a Bengali tab for each supported resource. Bengali fields write to the companion translation tables:

- `school_settings_translations`
- `website_page_translations` and `website_section_translations`
- `website_navigation_translations`
- `notice_translations`
- `blog_post_translations`
- `faculty_member_translations`
- `gallery_album_translations` and `gallery_item_translations`
- `media_asset_translations`
- `academic_program_translations`

New translations start as `Draft` with `is_complete = false`. The CMS must show missing required fields before publish. Never copy a draft into a public master field.

Page publication must call `cms_publish_page_translation(translation_id, expected_revision)`. It promotes the page and its sections in one transaction and rejects stale revisions. Other resources use `cms_set_translation_status(resource_type, translation_id, status)`; table constraints reject incomplete published records.

## Public read contract

Public reads require the Bengali row to be `Published` and `is_complete = true`. RLS also requires the linked English master to remain published/active and, for notices and posts, within its public publication window. If the migration is absent or a translation is incomplete, the public application returns no Bengali content and does not fall back to English editorial copy.

## Revalidation

After a successful publish/unpublish transaction, call `POST /api/revalidate` with the existing bearer secret:

```json
{
  "path": "/about",
  "tag": "page_about",
  "locale": "bn"
}
```

The route invalidates the English and `/bn` path, localized cache tags, and both root layouts. Use the existing collection tags (`notices`, `blog`, `faculty`, `gallery`) for collection resources.

## Safe rollout

1. Review and approve the additive migration.
2. Apply it through the project migration workflow and regenerate Supabase database types.
3. Add the Bengali editors to the standalone CMS using the contracts above.
4. Enter only approved Bengali editorial content and accessible media alt text.
5. Publish settings and navigation first, then complete individual pages/resources.
6. Verify `/bn` routes, canonical/hreflang metadata, and sitemap entries before production release.
