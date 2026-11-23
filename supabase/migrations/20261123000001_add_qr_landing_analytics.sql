-- Extend the existing sign-up category without deleting any current registrations.
ALTER TABLE public.interest_signups
  DROP CONSTRAINT IF EXISTS interest_signups_interest_type_check;
ALTER TABLE public.interest_signups
  ADD CONSTRAINT interest_signups_interest_type_check
  CHECK (interest_type IN ('online_course', 'in_person_course', 'subscription_news', 'event_news', 'qr_landing'));

CREATE TABLE IF NOT EXISTS public.qr_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL CHECK (length(visitor_id) BETWEEN 16 AND 80),
  session_id text NOT NULL CHECK (length(session_id) BETWEEN 16 AND 80),
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'registration')),
  source text NOT NULL DEFAULT 'qr' CHECK (length(source) <= 80),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS qr_events_created_at_idx ON public.qr_events (created_at DESC);
CREATE INDEX IF NOT EXISTS qr_events_session_idx ON public.qr_events (session_id);
CREATE INDEX IF NOT EXISTS qr_events_visitor_idx ON public.qr_events (visitor_id);

ALTER TABLE public.qr_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.qr_events FROM anon, authenticated;
GRANT INSERT ON public.qr_events TO anon, authenticated;
DROP POLICY IF EXISTS qr_events_anon_insert ON public.qr_events;
CREATE POLICY qr_events_anon_insert ON public.qr_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    event_type IN ('page_view', 'registration')
    AND length(visitor_id) BETWEEN 16 AND 80
    AND length(session_id) BETWEEN 16 AND 80
  );

CREATE OR REPLACE FUNCTION public.get_qr_analytics()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH totals AS (
    SELECT
      count(*) FILTER (WHERE event_type = 'page_view')::integer AS visits,
      count(DISTINCT visitor_id) FILTER (WHERE event_type = 'page_view')::integer AS visitors,
      count(DISTINCT session_id) FILTER (WHERE event_type = 'page_view')::integer AS sessions,
      count(*) FILTER (WHERE event_type = 'registration')::integer AS tracked_registrations
    FROM public.qr_events
  ),
  days AS (
    SELECT
      calendar.day::date AS day,
      COALESCE(events.visits, 0)::integer AS visits,
      COALESCE(signups.registrations, 0)::integer AS registrations
    FROM generate_series(current_date - 29, current_date, interval '1 day') AS calendar(day)
    LEFT JOIN (
      SELECT created_at::date AS day, count(*) AS visits
      FROM public.qr_events
      WHERE event_type = 'page_view' AND created_at >= current_date - 29
      GROUP BY created_at::date
    ) events ON events.day = calendar.day::date
    LEFT JOIN (
      SELECT created_at::date AS day, count(*) AS registrations
      FROM public.interest_signups
      WHERE interest_type = 'qr_landing' AND created_at >= current_date - 29
      GROUP BY created_at::date
    ) signups ON signups.day = calendar.day::date
  )
  SELECT jsonb_build_object(
    'totalVisits', totals.visits,
    'uniqueVisitors', totals.visitors,
    'uniqueSessions', totals.sessions,
    'registrations', (SELECT count(*)::integer FROM public.interest_signups WHERE interest_type = 'qr_landing'),
    'conversionRate', CASE WHEN totals.sessions = 0 THEN 0
      ELSE round((totals.tracked_registrations::numeric / totals.sessions::numeric) * 100, 2) END,
    'daily', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'day', to_char(days.day, 'YYYY-MM-DD'),
        'visits', days.visits,
        'registrations', days.registrations
      ) ORDER BY days.day)
      FROM days
    ), '[]'::jsonb)
  )
  FROM totals;
$$;
REVOKE ALL ON FUNCTION public.get_qr_analytics() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_qr_analytics() TO service_role;
