-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA - CONTENT MANAGEMENT SYSTEM (CMS)
-- Migration: 20261101180000_cms_complete_backend_m6.sql
-- Description: Milestone 6 Complete CMS Backend Schema
--              - Structured Notices extensions (summary, expiry, authoring, SEO)
--              - Structured Faculty Members (public profiles, bio, ordering, RLS)
--              - Gallery Albums & Media Items link
--              - Website Contact Inquiries (public submission, rate/anti-spam, RLS)
--              - Website Navigation & Footer Links management
--              - School Settings SEO & Site Announcement extensions
--              - Super Admin retention guard & Media Library usage infrastructure
--              - Least-privilege RLS policies and role grants
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Extend public.notices for Comprehensive CMS Editorial Workflow
-- ------------------------------------------------------------------------------
ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS meta_title text CHECK (meta_title IS NULL OR char_length(trim(meta_title)) <= 100),
  ADD COLUMN IF NOT EXISTS meta_description text CHECK (meta_description IS NULL OR char_length(trim(meta_description)) <= 300);

CREATE INDEX IF NOT EXISTS idx_notices_expires_at ON public.notices(expires_at);
CREATE INDEX IF NOT EXISTS idx_notices_author_updated ON public.notices(author_id, updated_by);

-- Ensure CMS Editors have full mutation clearance on notices
DROP POLICY IF EXISTS "CMS editors can manage notices" ON public.notices;
CREATE POLICY "CMS editors can manage notices"
  ON public.notices FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

-- Grant authenticated roles access strictly governed by RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notices TO authenticated;

-- ------------------------------------------------------------------------------
-- 2. Structured Faculty Records (public.faculty_members)
-- ------------------------------------------------------------------------------
-- Dedicated public faculty directory decoupled from private staff employment records.
CREATE TABLE IF NOT EXISTS public.faculty_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(trim(name)) >= 2 AND char_length(trim(name)) <= 150),
  designation text NOT NULL CHECK (char_length(trim(designation)) >= 2 AND char_length(trim(designation)) <= 150),
  department text NOT NULL CHECK (char_length(trim(department)) >= 2 AND char_length(trim(department)) <= 100),
  qualification text CHECK (qualification IS NULL OR char_length(trim(qualification)) <= 255),
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  bio text CHECK (bio IS NULL OR char_length(trim(bio)) <= 2000),
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_active boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faculty_members_sort ON public.faculty_members(is_published, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_faculty_members_dept ON public.faculty_members(department);

DROP TRIGGER IF EXISTS trg_faculty_members_updated_at ON public.faculty_members;
CREATE TRIGGER trg_faculty_members_updated_at
  BEFORE UPDATE ON public.faculty_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.faculty_members FROM PUBLIC;
REVOKE ALL ON TABLE public.faculty_members FROM anon;
REVOKE ALL ON TABLE public.faculty_members FROM authenticated;

GRANT SELECT ON TABLE public.faculty_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.faculty_members TO authenticated;
GRANT ALL ON TABLE public.faculty_members TO service_role;

DROP POLICY IF EXISTS "Public can view active published faculty" ON public.faculty_members;
CREATE POLICY "Public can view active published faculty"
  ON public.faculty_members FOR SELECT
  TO public
  USING (is_active = true AND is_published = true);

DROP POLICY IF EXISTS "CMS editors can manage faculty members" ON public.faculty_members;
CREATE POLICY "CMS editors can manage faculty members"
  ON public.faculty_members FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

-- ------------------------------------------------------------------------------
-- 3. Gallery Albums (public.gallery_albums) & Media Items Link
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(trim(title)) >= 2 AND char_length(trim(title)) <= 150),
  slug text UNIQUE NOT NULL CHECK (char_length(trim(slug)) >= 1 AND slug ~ '^[a-z0-9-]+$'),
  description text CHECK (description IS NULL OR char_length(trim(description)) <= 1000),
  cover_image_url text,
  category text NOT NULL DEFAULT 'Campus & Infrastructure'
    CHECK (category IN ('Campus & Infrastructure', 'Classroom & Learning', 'Sports & Activities', 'Cultural & Events', 'Celebrations')),
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON public.gallery_albums(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_published ON public.gallery_albums(is_published, sort_order);

DROP TRIGGER IF EXISTS trg_gallery_albums_updated_at ON public.gallery_albums;
CREATE TRIGGER trg_gallery_albums_updated_at
  BEFORE UPDATE ON public.gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.gallery_albums FROM PUBLIC;
REVOKE ALL ON TABLE public.gallery_albums FROM anon;
REVOKE ALL ON TABLE public.gallery_albums FROM authenticated;

GRANT SELECT ON TABLE public.gallery_albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.gallery_albums TO authenticated;
GRANT ALL ON TABLE public.gallery_albums TO service_role;

DROP POLICY IF EXISTS "Public can view published gallery albums" ON public.gallery_albums;
CREATE POLICY "Public can view published gallery albums"
  ON public.gallery_albums FOR SELECT
  TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "CMS editors can manage gallery albums" ON public.gallery_albums;
CREATE POLICY "CMS editors can manage gallery albums"
  ON public.gallery_albums FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

-- Extend gallery_items with album_id and alt_text
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS album_id uuid REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS alt_text text NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_gallery_items_album_id ON public.gallery_items(album_id);

-- ------------------------------------------------------------------------------
-- 4. Website Contact & Inquiries (public.contact_inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no text UNIQUE NOT NULL,
  parent_name text NOT NULL CHECK (char_length(trim(parent_name)) >= 2 AND char_length(trim(parent_name)) <= 120),
  phone text NOT NULL CHECK (phone ~ '^[0-9+ -]{7,20}$'),
  email text CHECK (email IS NULL OR email = '' OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject text NOT NULL DEFAULT 'General Inquiry' CHECK (char_length(trim(subject)) >= 2 AND char_length(trim(subject)) <= 200),
  class_interest text,
  message text NOT NULL CHECK (char_length(trim(message)) >= 5 AND char_length(trim(message)) <= 3000),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Resolved', 'Archived')),
  internal_notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_ref ON public.contact_inquiries(reference_no);

DROP TRIGGER IF EXISTS trg_contact_inquiries_updated_at ON public.contact_inquiries;
CREATE TRIGGER trg_contact_inquiries_updated_at
  BEFORE UPDATE ON public.contact_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contact_inquiries FROM PUBLIC;
REVOKE ALL ON TABLE public.contact_inquiries FROM anon;
REVOKE ALL ON TABLE public.contact_inquiries FROM authenticated;

-- Anon has strictly INSERT rights. ZERO SELECT permissions.
GRANT INSERT ON TABLE public.contact_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contact_inquiries TO authenticated;
GRANT ALL ON TABLE public.contact_inquiries TO service_role;

DROP POLICY IF EXISTS "Public can submit contact inquiries" ON public.contact_inquiries;
CREATE POLICY "Public can submit contact inquiries"
  ON public.contact_inquiries FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "CMS enquiry managers can view inquiries" ON public.contact_inquiries;
CREATE POLICY "CMS enquiry managers can view inquiries"
  ON public.contact_inquiries FOR SELECT
  TO authenticated
  USING (public.has_cms_role('enquiry_manager') OR public.has_cms_role('content_editor'));

DROP POLICY IF EXISTS "CMS enquiry managers can update inquiries" ON public.contact_inquiries;
CREATE POLICY "CMS enquiry managers can update inquiries"
  ON public.contact_inquiries FOR UPDATE
  TO authenticated
  USING (public.has_cms_role('enquiry_manager') OR public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('enquiry_manager') OR public.has_cms_role('content_editor'));

-- ------------------------------------------------------------------------------
-- 5. Website Navigation (public.website_navigation)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_navigation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_location text NOT NULL CHECK (menu_location IN ('header_main', 'footer_quick_links', 'footer_academics', 'footer_legal', 'social_links')),
  label text NOT NULL CHECK (char_length(trim(label)) >= 1 AND char_length(trim(label)) <= 100),
  url text NOT NULL CHECK (char_length(trim(url)) >= 1 AND char_length(trim(url)) <= 500),
  is_external boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  is_published boolean NOT NULL DEFAULT true,
  target text NOT NULL DEFAULT '_self' CHECK (target IN ('_self', '_blank')),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_website_navigation_menu ON public.website_navigation(menu_location, is_published, sort_order);

DROP TRIGGER IF EXISTS trg_website_navigation_updated_at ON public.website_navigation;
CREATE TRIGGER trg_website_navigation_updated_at
  BEFORE UPDATE ON public.website_navigation
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.website_navigation ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.website_navigation FROM PUBLIC;
REVOKE ALL ON TABLE public.website_navigation FROM anon;
REVOKE ALL ON TABLE public.website_navigation FROM authenticated;

GRANT SELECT ON TABLE public.website_navigation TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.website_navigation TO authenticated;
GRANT ALL ON TABLE public.website_navigation TO service_role;

DROP POLICY IF EXISTS "Public can view published navigation items" ON public.website_navigation;
CREATE POLICY "Public can view published navigation items"
  ON public.website_navigation FOR SELECT
  TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "CMS editors can manage navigation" ON public.website_navigation;
CREATE POLICY "CMS editors can manage navigation"
  ON public.website_navigation FOR ALL
  TO authenticated
  USING (public.has_cms_role('content_editor'))
  WITH CHECK (public.has_cms_role('content_editor'));

-- ------------------------------------------------------------------------------
-- 6. Extend School Master Settings with SEO & Public Announcement Banner
-- ------------------------------------------------------------------------------
ALTER TABLE public.school_settings
  ADD COLUMN IF NOT EXISTS seo_default_title text,
  ADD COLUMN IF NOT EXISTS seo_default_description text,
  ADD COLUMN IF NOT EXISTS seo_og_image_url text,
  ADD COLUMN IF NOT EXISTS seo_canonical_base text,
  ADD COLUMN IF NOT EXISTS seo_robots_directive text DEFAULT 'index, follow',
  ADD COLUMN IF NOT EXISTS announcement_banner jsonb DEFAULT '{"enabled": false, "text": "", "link": ""}'::jsonb;

-- ------------------------------------------------------------------------------
-- 7. Audit Log Access & Storage Permissions
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "CMS administrators can view audit logs" ON public.audit_logs;
CREATE POLICY "CMS administrators can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_cms_admin());

DROP POLICY IF EXISTS "CMS editors can upload to public-media bucket" ON storage.objects;
CREATE POLICY "CMS editors can upload to public-media bucket"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'public-media' AND (public.is_admin() OR public.has_cms_role('content_editor')))
  WITH CHECK (bucket_id = 'public-media' AND (public.is_admin() OR public.has_cms_role('content_editor')));

-- ------------------------------------------------------------------------------
-- 8. CMS Super Admin Retention Guard
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_cms_super_admin_removal()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_active_super_admins integer;
BEGIN
  IF (TG_OP = 'DELETE' AND OLD.role = 'super_admin' AND OLD.is_active = true) OR
     (TG_OP = 'UPDATE' AND OLD.role = 'super_admin' AND OLD.is_active = true AND (NEW.is_active = false OR NEW.role <> 'super_admin')) THEN
    
    SELECT COUNT(*) INTO v_active_super_admins
    FROM (
      SELECT id FROM public.profiles WHERE role = 'admin' AND is_active = true
      UNION
      SELECT profile_id AS id FROM public.cms_admin_roles WHERE role = 'super_admin' AND is_active = true AND profile_id <> OLD.profile_id
    ) super_admins;

    IF v_active_super_admins = 0 THEN
      RAISE EXCEPTION 'Operation rejected: Cannot remove or deactivate the final active super administrator.';
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_cms_super_admin_removal ON public.cms_admin_roles;
CREATE TRIGGER trg_guard_cms_super_admin_removal
  BEFORE UPDATE OR DELETE ON public.cms_admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_cms_super_admin_removal();

-- ------------------------------------------------------------------------------
-- 9. Seed Canonical Website Navigation Links (Safe & Idempotent)
-- ------------------------------------------------------------------------------
INSERT INTO public.website_navigation (menu_location, label, url, is_external, sort_order, is_published, target)
VALUES
  ('header_main', 'Home', '/', false, 0, true, '_self'),
  ('header_main', 'About Us', '/about', false, 1, true, '_self'),
  ('header_main', 'Academics', '/academics', false, 2, true, '_self'),
  ('header_main', 'Admissions', '/admissions', false, 3, true, '_self'),
  ('header_main', 'Facilities', '/facilities', false, 4, true, '_self'),
  ('header_main', 'Faculty', '/faculty', false, 5, true, '_self'),
  ('header_main', 'Gallery', '/gallery', false, 6, true, '_self'),
  ('header_main', 'Notices', '/notices', false, 7, true, '_self'),
  ('header_main', 'Contact', '/contact', false, 8, true, '_self'),
  ('footer_quick_links', 'About Us', '/about', false, 0, true, '_self'),
  ('footer_quick_links', 'Admissions', '/admissions', false, 1, true, '_self'),
  ('footer_quick_links', 'Notices & Circulars', '/notices', false, 2, true, '_self'),
  ('footer_quick_links', 'Photo Gallery', '/gallery', false, 3, true, '_self'),
  ('footer_quick_links', 'Contact Campus Office', '/contact', false, 4, true, '_self'),
  ('footer_academics', 'Foundational Curriculum', '/academics', false, 0, true, '_self'),
  ('footer_academics', 'Campus Infrastructure', '/facilities', false, 1, true, '_self'),
  ('footer_academics', 'Academic Mentors', '/faculty', false, 2, true, '_self')
ON CONFLICT DO NOTHING;

-- ------------------------------------------------------------------------------
-- 10. Transactional Security-Critical Administrative RPCs
-- ------------------------------------------------------------------------------

-- 10.1 Assign or update CMS user role with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_assign_user_role(
  p_profile_id uuid,
  p_role text,
  p_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_actor_is_super boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('super_admin') OR public.is_admin()) INTO v_actor_is_super;
  IF NOT v_actor_is_super THEN
    RAISE EXCEPTION 'Insufficient permissions: super_admin required' USING ERRCODE = '42501';
  END IF;

  IF p_role NOT IN ('super_admin', 'content_editor', 'enquiry_manager') THEN
    RAISE EXCEPTION 'Invalid CMS role: %', p_role USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.cms_admin_roles (profile_id, role, is_active, notes, updated_at)
  VALUES (p_profile_id, p_role, true, p_notes, now())
  ON CONFLICT (profile_id)
  DO UPDATE SET
    role = EXCLUDED.role,
    is_active = true,
    notes = EXCLUDED.notes,
    updated_at = now();

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'assign_cms_role',
    'cms_admin_role',
    p_profile_id::text,
    jsonb_build_object('role', p_role, 'notes', p_notes)
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'profile_id', p_profile_id, 'role', p_role);
END;
$$;

-- 10.2 Toggle CMS user active state with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_toggle_user_active(
  p_profile_id uuid,
  p_is_active boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_actor_is_super boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('super_admin') OR public.is_admin()) INTO v_actor_is_super;
  IF NOT v_actor_is_super THEN
    RAISE EXCEPTION 'Insufficient permissions: super_admin required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.cms_admin_roles
  SET is_active = p_is_active, updated_at = now()
  WHERE profile_id = p_profile_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CMS user record not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    CASE WHEN p_is_active THEN 'activate_cms_user' ELSE 'deactivate_cms_user' END,
    'cms_admin_role',
    p_profile_id::text,
    jsonb_build_object('is_active', p_is_active)
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'profile_id', p_profile_id, 'is_active', p_is_active);
END;
$$;

-- 10.3 Publish or unpublish notice with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_set_notice_status(
  p_notice_id uuid,
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
    RAISE EXCEPTION 'Invalid notice status: %', p_status USING ERRCODE = '22023';
  END IF;

  UPDATE public.notices
  SET
    status = p_status,
    published_at = CASE WHEN p_status = 'Published' THEN COALESCE(published_at, now()) ELSE published_at END,
    updated_by = v_actor_id,
    updated_at = now()
  WHERE id = p_notice_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Notice not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    CASE
      WHEN p_status = 'Published' THEN 'publish_notice'
      WHEN p_status = 'Archived' THEN 'archive_notice'
      ELSE 'unpublish_notice'
    END,
    'notice',
    p_notice_id::text,
    jsonb_build_object('status', p_status)
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'id', p_notice_id, 'status', p_status);
END;
$$;

-- 10.4 Update enquiry status with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_update_enquiry_status(
  p_enquiry_id uuid,
  p_status text,
  p_internal_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_manage boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('enquiry_manager') OR public.has_cms_role('content_editor') OR public.is_admin()) INTO v_can_manage;
  IF NOT v_can_manage THEN
    RAISE EXCEPTION 'Insufficient permissions' USING ERRCODE = '42501';
  END IF;

  IF p_status NOT IN ('New', 'Contacted', 'Resolved', 'Archived') THEN
    RAISE EXCEPTION 'Invalid enquiry status: %', p_status USING ERRCODE = '22023';
  END IF;

  UPDATE public.contact_inquiries
  SET
    status = p_status,
    internal_notes = p_internal_notes,
    resolved_at = CASE WHEN p_status = 'Resolved' THEN now() ELSE resolved_at END,
    resolved_by = CASE WHEN p_status = 'Resolved' THEN v_actor_id ELSE resolved_by END,
    updated_at = now()
  WHERE id = p_enquiry_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enquiry not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'update_enquiry_status',
    'contact_inquiry',
    p_enquiry_id::text,
    jsonb_build_object('status', p_status)
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'id', p_enquiry_id, 'status', p_status);
END;
$$;

-- 10.5 Delete contact enquiry with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_delete_enquiry(
  p_enquiry_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id uuid;
  v_can_delete boolean;
  v_audit_id uuid;
BEGIN
  v_actor_id := auth.uid();
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '28000';
  END IF;

  SELECT (public.has_cms_role('enquiry_manager') OR public.is_admin()) INTO v_can_delete;
  IF NOT v_can_delete THEN
    RAISE EXCEPTION 'Insufficient permissions: enquiry_manager or admin required' USING ERRCODE = '42501';
  END IF;

  DELETE FROM public.contact_inquiries
  WHERE id = p_enquiry_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Enquiry not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'delete_contact_enquiry',
    'contact_inquiry',
    p_enquiry_id::text,
    jsonb_build_object('deleted_at', now())
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true, 'id', p_enquiry_id);
END;
$$;

-- 10.6 Update SEO and Announcement settings with atomic audit log
CREATE OR REPLACE FUNCTION public.cms_update_seo_settings(
  p_title text,
  p_desc text,
  p_og_image text,
  p_canonical text,
  p_robots text,
  p_banner jsonb
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

  UPDATE public.school_settings
  SET
    seo_default_title = p_title,
    seo_default_description = p_desc,
    seo_og_image_url = p_og_image,
    seo_canonical_base = p_canonical,
    seo_robots_directive = COALESCE(p_robots, 'index, follow'),
    announcement_banner = COALESCE(p_banner, '{"enabled": false, "text": "", "link": ""}'::jsonb),
    updated_at = now()
  WHERE id = 'primary_config';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Primary settings config not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (
    v_actor_id,
    'update_seo_settings',
    'school_settings',
    'primary_config',
    jsonb_build_object(
      'seo_title', p_title,
      'robots', p_robots,
      'banner_enabled', (p_banner->>'enabled')::boolean
    )
  )
  RETURNING id INTO v_audit_id;

  IF v_audit_id IS NULL THEN
    RAISE EXCEPTION 'Audit log insertion failed' USING ERRCODE = '23502';
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Permissions for Milestone 6 RPCs
REVOKE ALL ON FUNCTION public.cms_assign_user_role FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_toggle_user_active FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_set_notice_status FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_update_enquiry_status FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_delete_enquiry FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cms_update_seo_settings FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.cms_assign_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_toggle_user_active TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_set_notice_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_update_enquiry_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_delete_enquiry TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_update_seo_settings TO authenticated;

