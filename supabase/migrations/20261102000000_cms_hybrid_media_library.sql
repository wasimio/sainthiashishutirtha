-- ==============================================================================
-- Sainthia Shishu Tirtha CMS — Milestone 6 Extension
-- Migration: 20261102000000_cms_hybrid_media_library.sql
-- Description: Extends public.media_assets for Hybrid Media Architecture:
--              - Supports 'hostinger' and 'supabase' storage providers
--              - Adds video (video/mp4, video/webm) and document extensions
--              - Expands file size limit up to 100MB
--              - Adds category, status, album_id, duration, thumbnail_url, caption
--              - Updates RLS policies for published media reads and CMS management
-- ==============================================================================

-- 1. Extend media_assets with new columns for Hybrid Architecture
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS storage_provider text NOT NULL DEFAULT 'supabase',
  ADD COLUMN IF NOT EXISTS public_url text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS duration_seconds numeric(8, 2),
  ADD COLUMN IF NOT EXISTS caption text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'ready',
  ADD COLUMN IF NOT EXISTS album_id uuid REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;

-- 2. Safely Update Constraints on public.media_assets

-- A. Storage Provider Check Constraint
ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS chk_media_assets_storage_provider;

ALTER TABLE public.media_assets
  ADD CONSTRAINT chk_media_assets_storage_provider
  CHECK (storage_provider IN ('supabase', 'hostinger'));

-- B. Category Check Constraint
ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS chk_media_assets_category;

ALTER TABLE public.media_assets
  ADD CONSTRAINT chk_media_assets_category
  CHECK (category IN ('general', 'campus', 'academic', 'sports', 'cultural', 'celebration', 'document', 'notice', 'profile'));

-- C. Lifecycle Status Check Constraint
ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS chk_media_assets_status;

ALTER TABLE public.media_assets
  ADD CONSTRAINT chk_media_assets_status
  CHECK (status IN ('pending', 'ready', 'failed'));

-- D. Expand MIME Type Check to include video/mp4 and video/webm
ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS media_assets_mime_type_check;

ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS chk_media_assets_mime_type;

ALTER TABLE public.media_assets
  ADD CONSTRAINT chk_media_assets_mime_type
  CHECK (mime_type IN (
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm'
  ));

-- E. Expand File Size Check up to 100MB (104,857,600 bytes)
ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS media_assets_file_size_check;

ALTER TABLE public.media_assets
  DROP CONSTRAINT IF EXISTS chk_media_assets_file_size;

ALTER TABLE public.media_assets
  ADD CONSTRAINT chk_media_assets_file_size
  CHECK (file_size > 0 AND file_size <= 104857600);

-- 3. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_media_assets_provider
  ON public.media_assets(storage_provider);

CREATE INDEX IF NOT EXISTS idx_media_assets_category
  ON public.media_assets(category);

CREATE INDEX IF NOT EXISTS idx_media_assets_album_id
  ON public.media_assets(album_id);

CREATE INDEX IF NOT EXISTS idx_media_assets_status
  ON public.media_assets(status);

CREATE INDEX IF NOT EXISTS idx_media_assets_published
  ON public.media_assets(is_published, created_at DESC);

-- 4. Update Row Level Security Policies on public.media_assets

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Anonymous/Public Read: Only published, ready media assets are visible
DROP POLICY IF EXISTS "Public can view media assets" ON public.media_assets;
DROP POLICY IF EXISTS "Public can view published ready media assets" ON public.media_assets;

CREATE POLICY "Public can view published ready media assets"
  ON public.media_assets FOR SELECT
  TO anon, authenticated
  USING (
    is_published = true AND status = 'ready'
  );

-- CMS Staff and Super Admins: Full management access
DROP POLICY IF EXISTS "CMS administrators have full access on media_assets" ON public.media_assets;

CREATE POLICY "CMS administrators have full access on media_assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR
    public.has_cms_role('content_editor')
  )
  WITH CHECK (
    public.is_admin() OR
    public.has_cms_role('content_editor')
  );

-- 5. Helper RPC to atomize media lifecycle transitions
CREATE OR REPLACE FUNCTION public.cms_confirm_media_asset(
  p_asset_id uuid,
  p_public_url text,
  p_file_size integer,
  p_width integer DEFAULT NULL,
  p_height integer DEFAULT NULL,
  p_duration_seconds numeric DEFAULT NULL,
  p_thumbnail_url text DEFAULT NULL
)
RETURNS public.media_assets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_asset public.media_assets;
BEGIN
  -- Verify caller is CMS editor or super admin
  IF NOT (
    public.is_admin() OR
    public.has_cms_role('content_editor')
  ) THEN
    RAISE EXCEPTION 'CMS permission denied: only content_editor or super_admin can confirm media assets';
  END IF;

  UPDATE public.media_assets
  SET
    status = 'ready',
    public_url = COALESCE(p_public_url, public_url),
    file_size = CASE WHEN p_file_size > 0 THEN p_file_size ELSE file_size END,
    width = COALESCE(p_width, width),
    height = COALESCE(p_height, height),
    duration_seconds = COALESCE(p_duration_seconds, duration_seconds),
    thumbnail_url = COALESCE(p_thumbnail_url, thumbnail_url),
    updated_at = now()
  WHERE id = p_asset_id
  RETURNING * INTO v_asset;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Media asset % not found', p_asset_id;
  END IF;

  RETURN v_asset;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cms_confirm_media_asset TO authenticated;
GRANT EXECUTE ON FUNCTION public.cms_confirm_media_asset TO service_role;
