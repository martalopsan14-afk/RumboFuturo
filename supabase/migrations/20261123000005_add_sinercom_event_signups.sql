ALTER TABLE public.interest_signups
  DROP CONSTRAINT IF EXISTS interest_signups_interest_type_check;
ALTER TABLE public.interest_signups
  ADD CONSTRAINT interest_signups_interest_type_check
  CHECK (interest_type IN ('online_course','in_person_course','subscription_news','event_news','qr_landing','event_sinercom'));

DROP POLICY IF EXISTS anon_insert_interest_signups ON public.interest_signups;
DROP POLICY IF EXISTS "anon_insert_interest_signups" ON public.interest_signups;
CREATE POLICY anon_insert_interest_signups
ON public.interest_signups
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 5 AND 254
  AND position('@' in email) > 1
  AND interest_type IN ('online_course','in_person_course','subscription_news','event_news','qr_landing','event_sinercom')
  AND source IN ('website','qr')
  AND (interest_type NOT IN ('qr_landing','event_sinercom') OR privacy_accepted_at IS NOT NULL)
);