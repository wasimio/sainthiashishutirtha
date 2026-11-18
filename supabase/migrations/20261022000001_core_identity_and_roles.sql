-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000001_core_identity_and_roles.sql
-- Description: Core identity, application roles, profiles, and authorization guards
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Exactly three primary application roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'staff', 'parent');
  END IF;
END $$;

-- Guardian verification status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'guardian_verification_status') THEN
    CREATE TYPE guardian_verification_status AS ENUM ('pending', 'verified', 'rejected');
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 1. Profiles (linked directly to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'parent',
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT check_profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);

-- ------------------------------------------------------------------------------
-- 2. Staff Profiles (Faculty & School Administrators)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.staff_profiles (
  profile_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  employee_id text UNIQUE NOT NULL,
  designation text NOT NULL,
  department text,
  qualification text,
  experience_years integer NOT NULL DEFAULT 0 CHECK (experience_years >= 0),
  joining_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_staff_profiles_employee_id ON public.staff_profiles(employee_id);

-- ------------------------------------------------------------------------------
-- 3. Guardians (Parents & Legal Guardians)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  guardian_code text UNIQUE NOT NULL,
  primary_guardian_name text NOT NULL,
  primary_phone text NOT NULL,
  secondary_guardian_name text,
  secondary_phone text,
  email text,
  residential_address text,
  verification_status guardian_verification_status NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guardians_profile_id ON public.guardians(profile_id);
CREATE INDEX IF NOT EXISTS idx_guardians_code ON public.guardians(guardian_code);
CREATE INDEX IF NOT EXISTS idx_guardians_primary_phone ON public.guardians(primary_phone);
CREATE INDEX IF NOT EXISTS idx_guardians_verification_status ON public.guardians(verification_status);

-- ------------------------------------------------------------------------------
-- 4. Guardian Invitations (Secure Parent Onboarding & Account Linking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guardian_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  email text NOT NULL,
  invitation_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  claimed_at timestamptz,
  claimed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guardian_invitations_token ON public.guardian_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_guardian_invitations_guardian_id ON public.guardian_invitations(guardian_id);

-- ------------------------------------------------------------------------------
-- 5. Audit Logs (System Action Records)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. Trusted Security-Definer Helper Functions
-- ------------------------------------------------------------------------------

-- Safely attempts to cast a text string to UUID, returning NULL instead of raising a runtime error
CREATE OR REPLACE FUNCTION public.try_cast_uuid(val text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF val IS NULL OR val !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RETURN NULL;
  END IF;
  RETURN val::uuid;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- Returns the verified role of the current authenticated user
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid() AND is_active = true;
$$;

-- Returns true if current user has the admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid() AND is_active = true),
    false
  );
$$;

-- Returns true if current user has the staff role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'staff' FROM public.profiles WHERE id = auth.uid() AND is_active = true),
    false
  );
$$;

-- Returns true if current user has the parent role
CREATE OR REPLACE FUNCTION public.is_parent()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'parent' FROM public.profiles WHERE id = auth.uid() AND is_active = true),
    false
  );
$$;

-- ------------------------------------------------------------------------------
-- 7. Privilege Escalation Prevention Trigger
-- Prevents ordinary users from modifying their own role or active status
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.guard_profile_role_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profile ID is immutable
  IF OLD.id IS DISTINCT FROM NEW.id THEN
    RAISE EXCEPTION 'Immutable identity violation: Profile user ID cannot be changed.';
  END IF;

  -- If role or is_active is modified, only an existing admin may perform this change
  IF (OLD.role IS DISTINCT FROM NEW.role) OR (OLD.is_active IS DISTINCT FROM NEW.is_active) THEN
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Privilege escalation violation: only administrators can change account roles or active status.';
    END IF;
  END IF;

  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_role_update ON public.profiles;
CREATE TRIGGER trg_guard_profile_role_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_role_update();

-- ------------------------------------------------------------------------------
-- 7b. Audit Log Immutability Trigger
-- Strictly prohibits UPDATE or DELETE on audit logs for any role
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_audit_log_immutability()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'Audit trail violation: audit_logs is append-only and existing records cannot be modified or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_audit_log_immutability ON public.audit_logs;
CREATE TRIGGER trg_protect_audit_log_immutability
  BEFORE UPDATE OR DELETE ON public.audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_audit_log_immutability();

-- ------------------------------------------------------------------------------
-- 8. Safe Auth Hook: Automatic Profile Provisioning
-- When an auth.users record is created, provision a default profile
-- Note: Raw user_metadata cannot override role to 'admin'
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role := 'parent';
  v_name text;
BEGIN
  -- Default full name from metadata if present, or email prefix
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    split_part(NEW.email, '@', 1)
  );

  -- Never permit user_metadata to assign admin or staff directly;
  -- Default to parent. Staff and Admin accounts must be granted by existing Admin.
  INSERT INTO public.profiles (id, role, full_name, email, phone, is_active)
  VALUES (
    NEW.id,
    v_role,
    v_name,
    NEW.email,
    NEW.phone,
    true
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();
