-- Store QR source and explicit privacy acceptance on signups; keep existing rows intact.
ALTER TABLE public.interest_signups ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website';
ALTER TABLE public.interest_signups ADD COLUMN IF NOT EXISTS privacy_accepted_at timestamptz;
ALTER TABLE public.interest_signups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.interest_signups FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.interest_signups TO anon, authenticated;
DROP POLICY IF EXISTS anon_insert_interest_signups ON public.interest_signups;
DROP POLICY IF EXISTS "anon_insert_interest_signups" ON public.interest_signups;
CREATE POLICY anon_insert_interest_signups ON public.interest_signups FOR INSERT TO anon, authenticated
WITH CHECK (length(email) BETWEEN 5 AND 254 AND position('@' in email)>1
AND interest_type IN ('online_course','in_person_course','subscription_news','event_news','qr_landing')
AND source IN ('website','qr') AND (interest_type <> 'qr_landing' OR privacy_accepted_at IS NOT NULL));