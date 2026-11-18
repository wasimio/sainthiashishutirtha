-- Leadership profiles are intentionally additive. DO NOT APPLY without approval.
-- English is the master; Bengali companion records remain invisible until complete.

CREATE TABLE IF NOT EXISTS public.leadership_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL CHECK (role_key ~ '^[a-z0-9_]+$'),
  name text NOT NULL CHECK (char_length(btrim(name)) >= 2),
  designation text NOT NULL CHECK (char_length(btrim(designation)) >= 2),
  message text,
  biography text,
  photo_url text,
  photo_alt text,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role_key),
  CHECK (status <> 'Published' OR (is_complete AND photo_url IS NOT NULL AND nullif(btrim(message), '') IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS public.leadership_profile_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leadership_profile_id uuid NOT NULL REFERENCES public.leadership_profiles(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale = 'bn'),
  name text,
  designation text,
  message text,
  biography text,
  photo_alt text,
  status text NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Published', 'Archived')),
  is_complete boolean NOT NULL DEFAULT false,
  content_revision integer NOT NULL DEFAULT 1 CHECK (content_revision > 0),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (leadership_profile_id, locale),
  CHECK (status <> 'Published' OR (is_complete AND nullif(btrim(name), '') IS NOT NULL AND nullif(btrim(designation), '') IS NOT NULL AND nullif(btrim(message), '') IS NOT NULL))
);

CREATE INDEX IF NOT EXISTS idx_leadership_profiles_public ON public.leadership_profiles (status, is_visible, sort_order);
CREATE INDEX IF NOT EXISTS idx_leadership_translations_public ON public.leadership_profile_translations (locale, status);

DROP TRIGGER IF EXISTS trg_leadership_profiles_updated_at ON public.leadership_profiles;
CREATE TRIGGER trg_leadership_profiles_updated_at BEFORE UPDATE ON public.leadership_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
DROP TRIGGER IF EXISTS trg_leadership_profile_translations_updated_at ON public.leadership_profile_translations;
CREATE TRIGGER trg_leadership_profile_translations_updated_at BEFORE UPDATE ON public.leadership_profile_translations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.leadership_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_profile_translations ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.leadership_profiles, public.leadership_profile_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leadership_profiles, public.leadership_profile_translations TO authenticated;

CREATE POLICY "Public can view published visible leadership" ON public.leadership_profiles FOR SELECT TO public USING (status = 'Published' AND is_visible = true);
CREATE POLICY "CMS editors can manage leadership" ON public.leadership_profiles FOR ALL TO authenticated USING (public.has_cms_role('content_editor')) WITH CHECK (public.has_cms_role('content_editor'));
CREATE POLICY "Public can view published Bengali leadership" ON public.leadership_profile_translations FOR SELECT TO public USING (status = 'Published' AND is_complete = true);
CREATE POLICY "CMS editors can manage leadership translations" ON public.leadership_profile_translations FOR ALL TO authenticated USING (public.has_cms_role('content_editor')) WITH CHECK (public.has_cms_role('content_editor'));
