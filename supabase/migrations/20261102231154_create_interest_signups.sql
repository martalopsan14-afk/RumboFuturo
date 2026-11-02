/*
# Create interest signups table

1. New Tables
- `interest_signups`
  - `id` (uuid, primary key)
  - `email` (text, required, basic format and length check)
  - `interest_type` (text, required, one of: online_course, in_person_course, subscription_news)
  - `created_at` (timestamptz, defaults to now)

2. Security
- Row level security enabled on `interest_signups`.
- Anonymous visitors can only INSERT rows (register interest). They cannot read, update or delete any rows, so other visitors' emails stay private.
- Grants limited to INSERT for `anon` and `authenticated`.

3. Notes
- A unique constraint on (email, interest_type) prevents duplicate registrations for the same interest.
*/

CREATE TABLE IF NOT EXISTS interest_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (length(email) BETWEEN 5 AND 254 AND position('@' in email) > 1),
  interest_type text NOT NULL CHECK (interest_type IN ('online_course', 'in_person_course', 'subscription_news')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT interest_signups_email_type_key UNIQUE (email, interest_type)
);

ALTER TABLE interest_signups ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON interest_signups TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_interest_signups" ON interest_signups;
CREATE POLICY "anon_insert_interest_signups" ON interest_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
