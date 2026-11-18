-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA - CONTENT MANAGEMENT SYSTEM (CMS)
-- Migration: 20261103000004_cms_blog_categories.sql
-- Description: Dynamic Blog Category Management
--              - Creates public.blog_categories with unique slug and name
--              - Pre-populates canonical school categories
--              - Relaxes hardcoded CHECK constraint on public.blog_posts(category)
--              - Implements least-privilege RLS policies
--              - Transactional administrative deletion & reassignment RPC
-- ==============================================================================

-- 1. Create public.blog_categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(trim(name)) >= 2 AND char_length(trim(name)) <= 100),
  slug text NOT NULL UNIQUE CHECK (char_length(trim(slug)) >= 2 AND slug ~ '^[a-z0-9-]+$'),
  description text CHECK (description IS NULL OR char_length(trim(description)) <= 300),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Performance & SEO Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_name ON public.blog_categories(name);

-- 3. Pre-populate Canonical Categories
INSERT INTO public.blog_categories (name, slug, description)
VALUES
  ('Campus News', 'campus-news', 'General campus updates, admissions announcements, and infrastructure milestones'),
  ('Academics & Pedagogy', 'academics-pedagogy', 'Curriculum insights, teaching methodologies, and foundational subject guidance'),
  ('Early Childhood', 'early-childhood', 'Early years development, nursery learning, sensory play, and phonics'),
  ('School Events', 'school-events', 'Annual functions, cultural celebrations, sports days, and educational excursions'),
  ('Parenting & Care', 'parenting-care', 'Child psychology guidance, screen-time habits, and healthy developmental routines'),
  ('Achievements', 'achievements', 'Student milestones, academic honours, competitions, and institutional recognitions')
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = COALESCE(public.blog_categories.description, EXCLUDED.description);

-- 4. Relax Hardcoded Category Constraint on blog_posts
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_category_check;
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS chk_blog_posts_category;
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS chk_blog_posts_category_length;

-- Add flexible length check
ALTER TABLE public.blog_posts
  ADD CONSTRAINT chk_blog_posts_category_length
  CHECK (char_length(trim(category)) >= 2 AND char_length(trim(category)) <= 100);

-- 5. Automation: Updated_at Trigger
DROP TRIGGER IF EXISTS trg_blog_categories_updated_at ON public.blog_categories;
CREATE TRIGGER trg_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row-Level Security (RLS) & Grants
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.blog_categories FROM PUBLIC;
REVOKE ALL ON TABLE public.blog_categories FROM anon;
REVOKE ALL ON TABLE public.blog_categories FROM authenticated;

-- Public can read all categories
DROP POLICY IF EXISTS "Public can view blog categories" ON public.blog_categories;
CREATE POLICY "Public can view blog categories"
  ON public.blog_categories FOR SELECT
  TO public
  USING (true);

-- CMS Content Editors and Super Admins have full access
DROP POLICY IF EXISTS "CMS editors can manage blog categories" ON public.blog_categories;
CREATE POLICY "CMS editors can manage blog categories"
  ON public.blog_categories FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

GRANT SELECT ON TABLE public.blog_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.blog_categories TO authenticated;
GRANT ALL ON TABLE public.blog_categories TO service_role;

-- 7. Transactional Safe Deletion & Reassignment RPC
CREATE OR REPLACE FUNCTION public.cms_delete_blog_category(
  p_category_name text,
  p_reassign_to text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_edit boolean;
  v_in_use_count integer;
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

  -- Count existing articles using this category
  SELECT COUNT(*) INTO v_in_use_count
  FROM public.blog_posts
  WHERE category = p_category_name AND is_deleted = false;

  IF v_in_use_count > 0 THEN
    IF p_reassign_to IS NULL OR trim(p_reassign_to) = '' THEN
      RAISE EXCEPTION 'Category "%" is in use by % article(s). Please choose a replacement category before deleting.'
        , p_category_name, v_in_use_count USING ERRCODE = '23001';
    END IF;

    -- Ensure target category exists
    IF NOT EXISTS (SELECT 1 FROM public.blog_categories WHERE name = p_reassign_to) THEN
      RAISE EXCEPTION 'Replacement category "%" does not exist.'
        , p_reassign_to USING ERRCODE = '23503';
    END IF;

    -- Reassign active articles
    UPDATE public.blog_posts
    SET category = p_reassign_to, updated_by = v_actor_id, updated_at = now()
    WHERE category = p_category_name;
  END IF;

  -- Delete the category
  DELETE FROM public.blog_categories
  WHERE name = p_category_name;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Category "%" not found.', p_category_name USING ERRCODE = 'P0002';
  END IF;

  -- Audit log
  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'delete_blog_category',
    'blog_category',
    p_category_name,
    jsonb_build_object(
      'deleted_category', p_category_name,
      'reassigned_to', p_reassign_to,
      'reassigned_articles_count', v_in_use_count
    )
  )
  RETURNING id INTO v_audit_id;

  RETURN jsonb_build_object(
    'success', true,
    'deleted_category', p_category_name,
    'reassigned_articles', v_in_use_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.cms_delete_blog_category FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cms_delete_blog_category TO authenticated;
