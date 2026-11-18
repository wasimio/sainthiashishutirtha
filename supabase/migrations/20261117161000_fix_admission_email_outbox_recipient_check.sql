-- Correct the email predicate used by the initial outbox migration. `[.]`
-- avoids PostgreSQL standard-conforming-string backslash ambiguity.
ALTER TABLE public.email_outbox DROP CONSTRAINT IF EXISTS email_outbox_recipient_email_check;
ALTER TABLE public.email_outbox ADD CONSTRAINT email_outbox_recipient_email_check
  CHECK (recipient_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$');

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
  v_payload := jsonb_build_object('application_no', NEW.application_no, 'student_name', v_student_name, 'guardian_name', NEW.guardian_name, 'guardian_phone', NEW.guardian_phone, 'guardian_email', NEW.guardian_email, 'applied_class', COALESCE(v_class_name, 'Not specified'), 'submitted_at', NEW.created_at);
  INSERT INTO public.email_outbox (admission_application_id, template_key, recipient_email, recipient_name, payload, idempotency_key) VALUES (NEW.id, 'admission_school_notification', 'contact@shishutirtha.com', 'Shishu Tirtha Admissions', v_payload, 'admission:' || NEW.id::text || ':school') ON CONFLICT (admission_application_id, template_key) DO NOTHING;
  IF NEW.guardian_email IS NOT NULL AND btrim(NEW.guardian_email) <> '' AND NEW.guardian_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$' THEN
    INSERT INTO public.email_outbox (admission_application_id, template_key, recipient_email, recipient_name, payload, idempotency_key) VALUES (NEW.id, 'admission_parent_acknowledgement', lower(btrim(NEW.guardian_email)), NEW.guardian_name, v_payload, 'admission:' || NEW.id::text || ':parent') ON CONFLICT (admission_application_id, template_key) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
