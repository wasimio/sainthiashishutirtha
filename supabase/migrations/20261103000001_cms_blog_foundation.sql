-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA - CONTENT MANAGEMENT SYSTEM (CMS)
-- Migration: 20261103000001_cms_blog_foundation.sql
-- Description: SEO-Optimized School Blog Schema & Editorial Lifecycle
--              - Structured Blog Posts (title, slug, excerpt, content, cover, category, tags)
--              - SEO metadata (meta_title, meta_description, canonical, OG image)
--              - Authoring attribution, reading time, view counts, and soft deletion
--              - Least-privilege RLS policies and audit-logged administrative RPCs
-- ==============================================================================

-- 1. Create public.blog_posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) >= 3 AND char_length(trim(title)) <= 200),
  slug text UNIQUE NOT NULL CHECK (char_length(trim(slug)) >= 2 AND slug ~ '^[a-z0-9-]+$'),
  excerpt text CHECK (excerpt IS NULL OR char_length(trim(excerpt)) <= 600),
  content text NOT NULL CHECK (char_length(trim(content)) >= 10),
  cover_image_url text,
  cover_image_alt text,
  category text NOT NULL CHECK (category IN (
    'Campus News',
    'Academics & Pedagogy',
    'Early Childhood',
    'School Events',
    'Parenting & Care',
    'Achievements'
  )),
  tags text[] DEFAULT '{}'::text[],
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name text NOT NULL DEFAULT 'School Editorial Desk',
  reading_time_minutes integer NOT NULL DEFAULT 3 CHECK (reading_time_minutes > 0),
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  meta_title text CHECK (meta_title IS NULL OR char_length(trim(meta_title)) <= 100),
  meta_description text CHECK (meta_description IS NULL OR char_length(trim(meta_description)) <= 300),
  canonical_url text,
  og_image_url text,
  view_count integer NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Performance & SEO Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_public ON public.blog_posts(status, is_deleted, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured, status, is_deleted);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON public.blog_posts(author_id);

-- 3. Automation: Updated_at Trigger
DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row-Level Security (RLS) & Grants
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.blog_posts FROM PUBLIC;
REVOKE ALL ON TABLE public.blog_posts FROM anon;
REVOKE ALL ON TABLE public.blog_posts FROM authenticated;

-- Public can read ONLY published, non-deleted posts with published_at <= now()
DROP POLICY IF EXISTS "Public can view published non-deleted blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published non-deleted blog posts"
  ON public.blog_posts FOR SELECT
  TO public
  USING (status = 'Published' AND is_deleted = false AND (published_at IS NULL OR published_at <= now()));

-- CMS Content Editors and Super Admins have full access
DROP POLICY IF EXISTS "CMS editors can manage blog posts" ON public.blog_posts;
CREATE POLICY "CMS editors can manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

GRANT SELECT ON TABLE public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blog_posts TO authenticated;
GRANT ALL ON TABLE public.blog_posts TO service_role;

-- 5. Transactional Audit-Logged Administrative RPCs

-- 5.1 Set Blog Post Status (Publish / Unpublish / Archive)
CREATE OR REPLACE FUNCTION public.cms_set_blog_post_status(
  p_post_id uuid,
  p_status text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_edit boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('content_editor') OR public.is_admin()) INTO v_can_edit;
  IF NOT v_can_edit THEN
    RAISE EXCEPTION 'Insufficient permissions: content_editor required' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('Draft', 'Published', 'Archived') THEN
    RAISE EXCEPTION 'Invalid blog post status: %', p_status USING ERRCODE = '22023';
  END IF;

  UPDATE public.blog_posts
  SET
    status = p_status,
    published_at = CASE WHEN p_status = 'Published' THEN COALESCE(published_at, now()) ELSE published_at END,
    updated_by = v_actor_id,
    updated_at = now()
  WHERE id = p_post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Blog post not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    CASE
      WHEN p_status = 'Published' THEN 'publish_blog_post'
      WHEN p_status = 'Archived' THEN 'archive_blog_post'
      ELSE 'unpublish_blog_post'
    END,
    'blog_post',
    p_post_id::text,
    jsonb_build_object('status', p_status)
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'id', p_post_id, 'status', p_status);
END;
$$;

-- 5.2 Soft Delete Blog Post (Move to Trash)
CREATE OR REPLACE FUNCTION public.cms_soft_delete_blog_post(
  p_post_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_edit boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('content_editor') OR public.is_admin()) INTO v_can_edit;
  IF NOT v_can_edit THEN
    RAISE EXCEPTION 'Insufficient permissions: content_editor required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.blog_posts
  SET
    is_deleted = true,
    deleted_at = now(),
    updated_by = v_actor_id,
    updated_at = now()
  WHERE id = p_post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Blog post not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'trash_blog_post',
    'blog_post',
    p_post_id::text,
    jsonb_build_object('deleted_at', now())
  )
  RETURNING id INTO v_audit_id;

  RETURN jsonb_build_object('success', true, 'id', p_post_id);
END;
$$;

-- 5.3 Restore Blog Post from Trash
CREATE OR REPLACE FUNCTION public.cms_restore_blog_post(
  p_post_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_edit boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('content_editor') OR public.is_admin()) INTO v_can_edit;
  IF NOT v_can_edit THEN
    RAISE EXCEPTION 'Insufficient permissions: content_editor required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.blog_posts
  SET
    is_deleted = false,
    deleted_at = NULL,
    updated_by = v_actor_id,
    updated_at = now()
  WHERE id = p_post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Blog post not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'restore_blog_post',
    'blog_post',
    p_post_id::text,
    jsonb_build_object('restored_at', now())
  )
  RETURNING id INTO v_audit_id;

  RETURN jsonb_build_object('success', true, 'id', p_post_id);
END;
$$;

-- 5.4 Safe Public View Count Increment
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(
  p_post_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = p_post_id AND status = 'Published' AND is_deleted = false;
END;
$$;

-- Function Permissions
REVOKE ALL ON FUNCTION public.cms_set_blog_post_status FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_soft_delete_blog_post FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_restore_blog_post FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.cms_set_blog_post_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_soft_delete_blog_post TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_restore_blog_post TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_blog_post_views TO anon, authenticated;
