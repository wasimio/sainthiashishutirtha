-- ==============================================================================
-- SAINTHIA SHISHU TIRTHA - PUBLIC NOTICES RLS ISOLATION
-- Migration: 20261103000003_notices_public_rls_isolation.sql
-- Description: Split notices RLS policy so anonymous public visitors do not
--              evaluate internal student_enrollments subqueries.
-- ==============================================================================

DROP POLICY IF EXISTS "Public and users can view published notices" ON public.notices;
DROP POLICY IF EXISTS "Public visitors can view published public notices" ON public.notices;
DROP POLICY IF EXISTS "Authenticated users can view audience notices" ON public.notices;

CREATE POLICY "Public visitors can view published public notices"
  ON public.notices FOR SELECT TO anon, authenticated
  USING (
    status = 'Published' AND target_audience IN ('All', 'Public')
  );

CREATE POLICY "Authenticated users can view audience notices"
  ON public.notices FOR SELECT TO authenticated
  USING (
    status = 'Published' AND (
      (target_audience = 'Staff Only' AND public.is_staff()) OR
      (target_audience = 'Parents Only' AND public.is_parent()) OR
      (target_audience = 'Class Specific' AND EXISTS (
        SELECT 1 FROM public.student_enrollments se
        JOIN public.sections s ON s.id = se.section_id
        WHERE s.class_id = public.notices.target_class_id
          AND se.status = 'active'
          AND public.is_guardian_of(se.student_id)
      ))
    )
  );

GRANT SELECT ON TABLE public.notices TO anon;
