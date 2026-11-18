-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Migration: 20261022000007_storage_buckets_and_policies.sql
-- Description: Storage bucket provisioning and access control policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Provision Storage Buckets
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'student-documents',
    'student-documents',
    false, -- STRICTLY PRIVATE
    10485760, -- 10 MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
  ),
  (
    'report-cards',
    'report-cards',
    false, -- STRICTLY PRIVATE
    10485760, -- 10 MB limit
    ARRAY['application/pdf']
  ),
  (
    'homework-attachments',
    'homework-attachments',
    false, -- STRICTLY PRIVATE
    15728640, -- 15 MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  ),
  (
    'public-media',
    'public-media',
    true, -- PUBLICLY ACCESSIBLE
    52428800, -- 50 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ------------------------------------------------------------------------------
-- 2. Storage Objects RLS Policies
-- ------------------------------------------------------------------------------

-- Public Media (School Gallery, Prospectus, Public Circulars)
DROP POLICY IF EXISTS "Public can read public-media bucket" ON storage.objects;
CREATE POLICY "Public can read public-media bucket"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'public-media');

DROP POLICY IF EXISTS "Admins can upload to public-media bucket" ON storage.objects;
CREATE POLICY "Admins can upload to public-media bucket"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'public-media' AND public.is_admin())
  WITH CHECK (bucket_id = 'public-media' AND public.is_admin());

-- Student Documents (Private: KYC, Birth Certificates, Medical forms)
-- Folder structure standard: {student_id}/{filename}
DROP POLICY IF EXISTS "Admins can access all student documents" ON storage.objects;
CREATE POLICY "Admins can access all student documents"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'student-documents' AND public.is_admin())
  WITH CHECK (bucket_id = 'student-documents' AND public.is_admin());

DROP POLICY IF EXISTS "Parents can view documents of their linked children" ON storage.objects;
CREATE POLICY "Parents can view documents of their linked children"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'student-documents'
    AND public.is_guardian_of(public.try_cast_uuid((storage.foldername(name))[1]))
  );

DROP POLICY IF EXISTS "Parents can upload documents for their linked children" ON storage.objects;
CREATE POLICY "Parents can upload documents for their linked children"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'student-documents'
    AND public.is_guardian_of(public.try_cast_uuid((storage.foldername(name))[1]))
  );

-- Report Cards (Private: Official PDF results)
-- Folder structure standard: {student_id}/{academic_year_id}/{term}.pdf
DROP POLICY IF EXISTS "Admins can manage report cards storage" ON storage.objects;
CREATE POLICY "Admins can manage report cards storage"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'report-cards' AND public.is_admin())
  WITH CHECK (bucket_id = 'report-cards' AND public.is_admin());

DROP POLICY IF EXISTS "Parents can download published report cards for their children" ON storage.objects;
CREATE POLICY "Parents can download published report cards for their children"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'report-cards'
    AND public.is_guardian_of(public.try_cast_uuid((storage.foldername(name))[1]))
  );

-- Homework Attachments (Private: Worksheets & Reading material)
-- Folder structure standard: {section_id}/{homework_id}/{filename}
DROP POLICY IF EXISTS "Admins can manage homework attachments" ON storage.objects;
CREATE POLICY "Admins can manage homework attachments"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'homework-attachments' AND public.is_admin())
  WITH CHECK (bucket_id = 'homework-attachments' AND public.is_admin());

DROP POLICY IF EXISTS "Staff can upload homework attachments for their sections" ON storage.objects;
CREATE POLICY "Staff can upload homework attachments for their sections"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'homework-attachments'
    AND public.is_staff()
    AND public.is_teacher_of_section(public.try_cast_uuid((storage.foldername(name))[1]))
  )
  WITH CHECK (
    bucket_id = 'homework-attachments'
    AND public.is_staff()
    AND public.is_teacher_of_section(public.try_cast_uuid((storage.foldername(name))[1]))
  );

DROP POLICY IF EXISTS "Parents can read homework attachments for their children sections" ON storage.objects;
CREATE POLICY "Parents can read homework attachments for their children sections"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'homework-attachments'
    AND EXISTS (
      SELECT 1 FROM public.student_enrollments se
      WHERE se.section_id = public.try_cast_uuid((storage.foldername(name))[1])
        AND se.status = 'active'
        AND public.is_guardian_of(se.student_id)
    )
  );
