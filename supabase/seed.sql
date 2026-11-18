-- ==============================================================================
-- SHISHUTIRTHA SCHOOL MANAGEMENT SYSTEM
-- Seed Data: supabase/seed.sql
-- Description: Minimal, non-sensitive reference metadata for development/testing
-- ZERO real personal data, student records, or credentials
-- ==============================================================================

-- 1. Reference Academic Year
INSERT INTO public.academic_years (name, start_date, end_date, is_current)
VALUES ('2025–2026', '2025-04-01', '2026-03-31', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Standard School Classes (Nursery through Class IV)
INSERT INTO public.classes (name, code, wing, display_order)
VALUES
  ('Nursery', 'NUR', 'Early Childhood', 1),
  ('KG-I', 'KG1', 'Pre-Primary', 2),
  ('KG-II', 'KG2', 'Pre-Primary', 3),
  ('Class I', 'CLS1', 'Junior Primary', 4),
  ('Class II', 'CLS2', 'Junior Primary', 5),
  ('Class III', 'CLS3', 'Senior Primary', 6),
  ('Class IV', 'CLS4', 'Senior Primary', 7)
ON CONFLICT (code) DO NOTHING;

-- 3. Core Subjects
INSERT INTO public.subjects (name, code, description)
VALUES
  ('English Language & Phonics', 'ENG', 'Reading, phonics, grammar, and early literacy'),
  ('Bengali Language & Sahitya', 'BEN', 'First language vernacular literacy and rhymes'),
  ('Elementary Mathematics', 'MATH', 'Numeracy, mental arithmetic, and logical shapes'),
  ('Environmental Studies (EVS)', 'EVS', 'Nature study, hygiene, neighborhood, and general science'),
  ('Sensory Rhymes & Storytelling', 'RHY', 'Pre-primary oral expression and auditory skills'),
  ('Creative Arts & Craft', 'ART', 'Drawing, motor skill activities, and visual arts'),
  ('Physical Well-being & Games', 'PHE', 'Outdoor motor coordination, yoga, and games')
ON CONFLICT (code) DO NOTHING;

-- 4. Standard Fee Heads
INSERT INTO public.fee_heads (name, description, is_recurring)
VALUES
  ('Quarterly Tuition Fee', 'Core pedagogical and instructional fee billed quarterly', true),
  ('Annual Development & Campus Fund', 'Annual institutional maintenance, library, and hygiene fund', false),
  ('Activity, Sports & Co-Curricular', 'Art materials, sports equipment, and co-curricular programs', true),
  ('Examination & Terminal Evaluation', 'Assessment booklets, question sets, and report cards', true),
  ('Admission & Registration Charge', 'One-time initial admission processing charge', false),
  ('Late Payment Surcharge', 'Statutory surcharge for dues cleared after the grace period', false)
ON CONFLICT (name) DO NOTHING;
