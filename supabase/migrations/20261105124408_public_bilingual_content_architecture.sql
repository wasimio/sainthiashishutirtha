-- =============================================================================
-- Public bilingual content architecture (additive; DO NOT apply without approval)
-- English master records and slugs remain unchanged. Bengali text lives in
-- independently drafted and published companion records.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_translation_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.school_settings_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_id text NOT NULL DEFAULT 'primary_config' REFERENCES public.school_settings(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  school_name text,
  short_name text,
  tagline text,
  about_text text,
  campus_address text,
  landmark text,
  city text,
  district text,
  state text,
  office_hours text,
  working_days text,
  weekly_holidays text,
  curriculum text,
  classes_offered text,
  medium_of_instruction text,
  facilities_summary text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (settings_id, locale),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(school_name), '') IS NOT NULL
    AND nullif(btrim(campus_address), '') IS NOT NULL
  ))
);

CREATE TABLE public.website_page_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.website_pages(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  title text,
  meta_title text,
  meta_description text,
  structured_content jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(structured_content) = 'object'),
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, locale),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(title), '') IS NOT NULL
    AND nullif(btrim(meta_description), '') IS NOT NULL
  ))
);

CREATE TABLE public.website_section_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_translation_id uuid NOT NULL REFERENCES public.website_page_translations(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.website_sections(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  title text,
  subtitle text,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(content_json) = 'object'),
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (section_id, locale),
  CHECK (NOT is_published OR nullif(btrim(title), '') IS NOT NULL)
);

CREATE TABLE public.website_navigation_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  navigation_id uuid NOT NULL REFERENCES public.website_navigation(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  label text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (navigation_id, locale),
  CHECK (status <> 'Published' OR (is_complete AND nullif(btrim(label), '') IS NOT NULL))
);

CREATE TABLE public.notice_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id uuid NOT NULL REFERENCES public.notices(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  slug text,
  title text,
  summary text,
  content text,
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (notice_id, locale),
  UNIQUE (locale, slug),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(slug), '') IS NOT NULL
    AND nullif(btrim(title), '') IS NOT NULL
    AND nullif(btrim(content), '') IS NOT NULL
  ))
);

CREATE TABLE public.blog_post_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  slug text,
  title text,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_alt text,
  category_label text,
  tags text[] NOT NULL DEFAULT '{}',
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image_alt text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, locale),
  UNIQUE (locale, slug),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(slug), '') IS NOT NULL
    AND nullif(btrim(title), '') IS NOT NULL
    AND nullif(btrim(cover_image_alt), '') IS NOT NULL
    AND nullif(btrim(meta_description), '') IS NOT NULL
  ))
);

CREATE TABLE public.faculty_member_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid NOT NULL REFERENCES public.faculty_members(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  name text,
  designation text,
  department text,
  qualification text,
  bio text,
  specialization text,
  photo_alt text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (faculty_id, locale),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(designation), '') IS NOT NULL
    AND nullif(btrim(bio), '') IS NOT NULL
    AND nullif(btrim(photo_alt), '') IS NOT NULL
  ))
);

CREATE TABLE public.gallery_album_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  slug text,
  title text,
  description text,
  cover_alt text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (album_id, locale),
  UNIQUE (locale, slug),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(slug), '') IS NOT NULL AND nullif(btrim(title), '') IS NOT NULL
  ))
);

CREATE TABLE public.gallery_item_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_item_id uuid NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  title text,
  caption text,
  alt_text text,
  category_label text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gallery_item_id, locale),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(title), '') IS NOT NULL AND nullif(btrim(alt_text), '') IS NOT NULL
  ))
);

CREATE TABLE public.media_asset_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  alt_text text,
  caption text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (media_asset_id, locale),
  CHECK (status <> 'Published' OR (is_complete AND nullif(btrim(alt_text), '') IS NOT NULL))
);

CREATE TABLE public.academic_program_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_key text NOT NULL,
  locale text NOT NULL CHECK (locale = 'bn'),
  slug text,
  title text,
  grade_range text,
  overview text,
  age_requirement text,
  school_hours text,
  class_teacher text,
  learning_outcomes text[] NOT NULL DEFAULT '{}',
  curriculum_breakdown jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(curriculum_breakdown) = 'array'),
  daily_routine jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(daily_routine) = 'array'),
  booklist_highlights text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  draft_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(draft_data) = 'object'),
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program_key, locale),
  UNIQUE (locale, slug),
  CHECK (status <> 'Published' OR (
    is_complete AND nullif(btrim(slug), '') IS NOT NULL AND nullif(btrim(title), '') IS NOT NULL
    AND nullif(btrim(overview), '') IS NOT NULL AND cardinality(learning_outcomes) > 0
    AND jsonb_array_length(curriculum_breakdown) > 0 AND jsonb_array_length(daily_routine) > 0
  ))
);

CREATE INDEX idx_page_translations_public ON public.website_page_translations(locale, status, is_complete, page_id);
CREATE INDEX idx_section_translations_public ON public.website_section_translations(locale, is_published, page_translation_id, sort_order);
CREATE INDEX idx_notice_translations_public ON public.notice_translations(locale, status, is_complete, published_at DESC);
CREATE INDEX idx_blog_translations_public ON public.blog_post_translations(locale, status, is_complete, published_at DESC);
CREATE INDEX idx_faculty_translations_public ON public.faculty_member_translations(locale, status, is_complete, faculty_id);
CREATE INDEX idx_gallery_item_translations_public ON public.gallery_item_translations(locale, status, is_complete, gallery_item_id);

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'school_settings_translations', 'website_page_translations', 'website_section_translations',
    'website_navigation_translations', 'notice_translations', 'blog_post_translations',
    'faculty_member_translations', 'gallery_album_translations', 'gallery_item_translations',
    'media_asset_translations', 'academic_program_translations'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_translation_updated_at()',
      'trg_' || table_name || '_updated_at',
      table_name
    );
    EXECUTE format('GRANT SELECT ON public.%I TO anon', table_name);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', table_name);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_cms_role(''content_editor'') OR public.is_admin()) WITH CHECK (public.has_cms_role(''content_editor'') OR public.is_admin())',
      'cms editors manage ' || table_name,
      table_name
    );
  END LOOP;
END $$;

CREATE POLICY "public reads published school settings translations"
ON public.school_settings_translations FOR SELECT TO anon
USING (locale = 'bn' AND status = 'Published' AND is_complete = true);

CREATE POLICY "public reads published page translations"
ON public.website_page_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (SELECT 1 FROM public.website_pages p WHERE p.id = page_id AND p.is_published = true)
);

CREATE POLICY "public reads published section translations"
ON public.website_section_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND is_published = true
  AND EXISTS (
    SELECT 1
    FROM public.website_page_translations pt
    JOIN public.website_pages p ON p.id = pt.page_id
    JOIN public.website_sections s ON s.id = section_id AND s.page_id = p.id
    WHERE pt.id = page_translation_id AND pt.status = 'Published' AND pt.is_complete = true
      AND p.is_published = true AND s.is_published = true
  )
);

CREATE POLICY "public reads published navigation translations"
ON public.website_navigation_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (SELECT 1 FROM public.website_navigation n WHERE n.id = navigation_id AND n.is_published = true)
);

CREATE POLICY "public reads published notice translations"
ON public.notice_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (
    SELECT 1 FROM public.notices n
    WHERE n.id = notice_id AND n.status = 'Published' AND n.target_audience IN ('All', 'Public')
      AND (n.published_at IS NULL OR n.published_at <= now())
      AND (n.expires_at IS NULL OR n.expires_at > now())
  )
);

CREATE POLICY "public reads published blog translations"
ON public.blog_post_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (
    SELECT 1 FROM public.blog_posts b
    WHERE b.id = post_id AND b.status = 'Published' AND b.is_deleted = false
      AND (b.published_at IS NULL OR b.published_at <= now())
  )
);

CREATE POLICY "public reads published faculty translations"
ON public.faculty_member_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (SELECT 1 FROM public.faculty_members f WHERE f.id = faculty_id AND f.is_active = true AND f.is_published = true)
);

CREATE POLICY "public reads published album translations"
ON public.gallery_album_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (SELECT 1 FROM public.gallery_albums a WHERE a.id = album_id AND a.is_published = true)
);

CREATE POLICY "public reads published gallery item translations"
ON public.gallery_item_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (SELECT 1 FROM public.gallery_items g WHERE g.id = gallery_item_id AND g.is_published = true)
);

CREATE POLICY "public reads published media translations"
ON public.media_asset_translations FOR SELECT TO anon
USING (
  locale = 'bn' AND status = 'Published' AND is_complete = true
  AND EXISTS (
    SELECT 1 FROM public.media_assets m
    WHERE m.id = media_asset_id AND m.is_published = true AND m.status = 'ready'
  )
);

CREATE POLICY "public reads published academic program translations"
ON public.academic_program_translations FOR SELECT TO anon
USING (locale = 'bn' AND status = 'Published' AND is_complete = true);

-- Page and section publication is one transaction. Draft JSON is promoted only
-- after the page metadata and every included section pass completeness checks.
CREATE OR REPLACE FUNCTION public.cms_publish_page_translation(
  p_translation_id uuid,
  p_expected_revision integer
)
RETURNS public.website_page_translations
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_page public.website_page_translations;
BEGIN
  IF NOT (public.has_cms_role('content_editor') OR public.is_admin()) THEN
    RAISE EXCEPTION 'Insufficient permissions: content_editor required' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_page
  FROM public.website_page_translations
  WHERE id = p_translation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Translation not found' USING ERRCODE = 'P0002';
  END IF;
  IF v_page.content_revision <> p_expected_revision THEN
    RAISE EXCEPTION 'Translation revision conflict' USING ERRCODE = '40001';
  END IF;
  IF nullif(btrim(COALESCE(v_page.draft_data->>'title', v_page.title)), '') IS NULL
     OR nullif(btrim(COALESCE(v_page.draft_data->>'meta_description', v_page.meta_description)), '') IS NULL THEN
    RAISE EXCEPTION 'Bengali page title and meta description are required' USING ERRCODE = '23514';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.website_section_translations s
    WHERE s.page_translation_id = p_translation_id
      AND nullif(btrim(COALESCE(s.draft_data->>'title', s.title)), '') IS NOT NULL
      AND jsonb_typeof(COALESCE(s.draft_data->'content_json', s.content_json)) = 'object'
  ) THEN
    RAISE EXCEPTION 'At least one complete Bengali section is required' USING ERRCODE = '23514';
  END IF;

  UPDATE public.website_section_translations
  SET title = COALESCE(nullif(btrim(draft_data->>'title'), ''), title),
      subtitle = CASE WHEN draft_data ? 'subtitle' THEN nullif(draft_data->>'subtitle', '') ELSE subtitle END,
      content_json = COALESCE(draft_data->'content_json', content_json),
      sort_order = COALESCE((draft_data->>'sort_order')::integer, sort_order),
      is_published = COALESCE((draft_data->>'is_published')::boolean, true),
      draft_data = '{}'::jsonb,
      content_revision = content_revision + 1
  WHERE page_translation_id = p_translation_id;

  UPDATE public.website_page_translations
  SET title = COALESCE(nullif(btrim(draft_data->>'title'), ''), title),
      meta_title = CASE WHEN draft_data ? 'meta_title' THEN nullif(draft_data->>'meta_title', '') ELSE meta_title END,
      meta_description = COALESCE(nullif(btrim(draft_data->>'meta_description'), ''), meta_description),
      structured_content = COALESCE(draft_data->'structured_content', structured_content),
      status = 'Published',
      is_complete = true,
      published_at = now(),
      draft_data = '{}'::jsonb,
      content_revision = content_revision + 1
  WHERE id = p_translation_id
  RETURNING * INTO v_page;

  RETURN v_page;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_set_translation_status(
  p_resource_type text,
  p_translation_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE v_rows integer;
BEGIN
  IF NOT (public.has_cms_role('content_editor') OR public.is_admin()) THEN
    RAISE EXCEPTION 'Insufficient permissions: content_editor required' USING ERRCODE = '42501';
  END IF;
  IF p_status NOT IN ('Draft', 'Published', 'Archived') THEN
    RAISE EXCEPTION 'Invalid translation status' USING ERRCODE = '22023';
  END IF;

  CASE p_resource_type
    WHEN 'school_settings' THEN UPDATE public.school_settings_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'navigation' THEN UPDATE public.website_navigation_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'notice' THEN UPDATE public.notice_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'blog_post' THEN UPDATE public.blog_post_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'faculty' THEN UPDATE public.faculty_member_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'gallery_album' THEN UPDATE public.gallery_album_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'gallery_item' THEN UPDATE public.gallery_item_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'media_asset' THEN UPDATE public.media_asset_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    WHEN 'academic_program' THEN UPDATE public.academic_program_translations SET status = p_status, published_at = CASE WHEN p_status = 'Published' THEN now() ELSE published_at END WHERE id = p_translation_id;
    ELSE RAISE EXCEPTION 'Unsupported translation resource type' USING ERRCODE = '22023';
  END CASE;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 1 THEN RAISE EXCEPTION 'Translation not found' USING ERRCODE = 'P0002'; END IF;
  RETURN jsonb_build_object('success', true, 'resource_type', p_resource_type, 'id', p_translation_id, 'status', p_status);
END;
$$;

REVOKE ALL ON FUNCTION public.set_translation_updated_at() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_publish_page_translation(uuid, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_set_translation_status(text, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cms_publish_page_translation(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_set_translation_status(text, uuid, text) TO authenticated;

COMMENT ON FUNCTION public.cms_publish_page_translation(uuid, integer) IS
'Atomically validates and publishes a Bengali page and its localized sections using optimistic revision control.';
COMMENT ON FUNCTION public.cms_set_translation_status(text, uuid, text) IS
'Changes localized resource publication state; table completeness constraints prevent incomplete Bengali content from publishing.';
