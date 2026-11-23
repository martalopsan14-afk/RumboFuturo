-- Reconcile the existing QR campaign/event tables with the landing analytics client.
ALTER TABLE public.qr_events ADD COLUMN IF NOT EXISTS visitor_id text;
ALTER TABLE public.qr_events ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'qr';
DROP POLICY IF EXISTS qr_events_anon_insert ON public.qr_events;
DROP POLICY IF EXISTS qr_events_public_insert ON public.qr_events;
ALTER TABLE public.qr_events DROP CONSTRAINT IF EXISTS qr_events_event_type_check;
ALTER TABLE public.qr_events ADD CONSTRAINT qr_events_event_type_check
 CHECK (event_type IN ('qr_scan','landing_view','lead','main_site_click','page_view','registration'));
ALTER TABLE public.qr_events DROP CONSTRAINT IF EXISTS qr_events_visitor_id_length_check;
ALTER TABLE public.qr_events DROP CONSTRAINT IF EXISTS qr_events_session_id_length_check;
ALTER TABLE public.qr_events DROP CONSTRAINT IF EXISTS qr_events_source_length_check;
ALTER TABLE public.qr_events ADD CONSTRAINT qr_events_visitor_id_length_check
 CHECK (visitor_id IS NULL OR length(visitor_id) BETWEEN 16 AND 80);
ALTER TABLE public.qr_events ADD CONSTRAINT qr_events_session_id_length_check
 CHECK (session_id IS NULL OR length(session_id) BETWEEN 16 AND 80);
ALTER TABLE public.qr_events ADD CONSTRAINT qr_events_source_length_check CHECK (length(source)<=80);
ALTER TABLE public.qr_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.qr_events FROM PUBLIC,anon,authenticated;
GRANT INSERT ON public.qr_events TO anon,authenticated;
CREATE POLICY qr_events_public_insert ON public.qr_events FOR INSERT TO anon,authenticated WITH CHECK (
 event_type IN ('page_view','registration','qr_scan','landing_view','lead','main_site_click')
 AND (visitor_id IS NULL OR length(visitor_id) BETWEEN 16 AND 80)
 AND (session_id IS NULL OR length(session_id) BETWEEN 16 AND 80)
 AND length(source)<=80
);
REVOKE ALL ON public.qr_campaigns FROM PUBLIC,anon,authenticated;
DROP POLICY IF EXISTS qr_campaigns_no_public_access ON public.qr_campaigns;
CREATE POLICY qr_campaigns_no_public_access ON public.qr_campaigns FOR ALL TO anon,authenticated USING (false) WITH CHECK (false);
CREATE INDEX IF NOT EXISTS qr_events_created_at_idx ON public.qr_events(created_at DESC);
CREATE INDEX IF NOT EXISTS qr_events_session_id_idx ON public.qr_events(session_id);
CREATE INDEX IF NOT EXISTS qr_events_visitor_id_idx ON public.qr_events(visitor_id);
INSERT INTO public.qr_campaigns(id,name,destination_url,active)
VALUES ('rumbo_futuro','Rumbo Futuro · campaña QR',NULL,true)
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, active=true;