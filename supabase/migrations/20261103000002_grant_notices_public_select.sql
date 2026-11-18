-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA - PUBLIC NOTICES GRANT RECONCILIATION
-- Migration: 20261103000002_grant_notices_public_select.sql
-- Description: Grant anonymous public read permission on public.notices
--              Strictly filtered by existing RLS policy "Public and users can view published notices"
-- ==============================================================================

GRANT SELECT ON TABLE public.notices TO anon;
