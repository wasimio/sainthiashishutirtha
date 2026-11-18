-- Durable, private delivery queue for admission notifications.  An admission
-- insert must never depend on the mail provider being available.
CREATE TABLE IF NOT EXISTS public.email_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admission_application_id uuid NOT NULL REFERENCES public.admissions_applications(id) ON DELETE CASCADE,
  template_key text NOT NULL CHECK (template_key IN ('admission_school_notification', 'admission_parent_acknowledgement')),
  recipient_email text NOT NULL CHECK (recipient_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  recipient_name text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'retry_scheduled', 'sent', 'failed')),
  attempt_count smallint NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts smallint NOT NULL DEFAULT 5 CHECK (max_attempts BETWEEN 1 AND 10),
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  sent_at timestamptz,
  provider_status integer,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (admission_application_id, template_key)
);

CREATE INDEX IF NOT EXISTS idx_email_outbox_ready
  ON public.email_outbox (next_attempt_at, created_at)
  WHERE status IN ('pending', 'retry_scheduled');
CREATE INDEX IF NOT EXISTS idx_email_outbox_admission
  ON public.email_outbox (admission_application_id, created_at DESC);

ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.email_outbox FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.email_outbox TO authenticated;

DROP POLICY IF EXISTS "Authorised CMS staff can inspect admission email delivery" ON public.email_outbox;
CREATE POLICY "Authorised CMS staff can inspect admission email delivery"
  ON public.email_outbox FOR SELECT TO authenticated
  USING (public.is_admin() OR public.has_cms_role('enquiry_manager'));

CREATE OR REPLACE FUNCTION public.enqueue_admission_emails()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_student_name text := btrim(concat_ws(' ', NEW.candidate_first_name, NEW.candidate_last_name));
  v_class_name text;
  v_payload jsonb;
BEGIN
  SELECT name INTO v_class_name FROM public.classes WHERE id = NEW.applied_class_id;
  v_payload := jsonb_build_object(
    'application_no', NEW.application_no,
    'student_name', v_student_name,
    'guardian_name', NEW.guardian_name,
    'guardian_phone', NEW.guardian_phone,
    'guardian_email', NEW.guardian_email,
    'applied_class', COALESCE(v_class_name, 'Not specified'),
    'submitted_at', NEW.created_at
  );

  INSERT INTO public.email_outbox (
    admission_application_id, template_key, recipient_email, recipient_name, payload, idempotency_key
  ) VALUES (
    NEW.id, 'admission_school_notification', 'contact@shishutirtha.com', 'Shishu Tirtha Admissions', v_payload,
    'admission:' || NEW.id::text || ':school'
  ) ON CONFLICT (admission_application_id, template_key) DO NOTHING;

  IF NEW.guardian_email IS NOT NULL AND btrim(NEW.guardian_email) <> ''
    AND NEW.guardian_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' THEN
    INSERT INTO public.email_outbox (
      admission_application_id, template_key, recipient_email, recipient_name, payload, idempotency_key
    ) VALUES (
      NEW.id, 'admission_parent_acknowledgement', lower(btrim(NEW.guardian_email)), NEW.guardian_name, v_payload,
      'admission:' || NEW.id::text || ':parent'
    ) ON CONFLICT (admission_application_id, template_key) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enqueue_admission_emails ON public.admissions_applications;
CREATE TRIGGER trg_enqueue_admission_emails
  AFTER INSERT ON public.admissions_applications
  FOR EACH ROW EXECUTE FUNCTION public.enqueue_admission_emails();

DROP TRIGGER IF EXISTS trg_email_outbox_updated_at ON public.email_outbox;
CREATE TRIGGER trg_email_outbox_updated_at
  BEFORE UPDATE ON public.email_outbox
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
