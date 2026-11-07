/*
# Create admin helper functions for password verification and hashing

1. New Functions
- `verify_admin_password(input_username text, input_password text)` — SECURITY DEFINER; returns boolean; checks if the password matches the stored bcrypt hash using extensions.crypt().
- `hash_admin_password(input_password text)` — SECURITY DEFINER; returns text; generates a new bcrypt hash using extensions.gen_salt('bf', 10).

2. Security
- Both functions are SECURITY DEFINER with search_path = public, extensions.
- EXECUTE revoked from PUBLIC and anon; only service_role can call them.
- Called exclusively from edge functions with the service role key.
*/

CREATE OR REPLACE FUNCTION public.verify_admin_password(input_username text, input_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  stored_hash text;
BEGIN
  SELECT password_hash INTO stored_hash FROM admin_users WHERE username = input_username;
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  RETURN stored_hash = crypt(input_password, stored_hash);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.verify_admin_password(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.verify_admin_password(text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.hash_admin_password(input_password text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT crypt(input_password, gen_salt('bf', 10));
$$;

REVOKE EXECUTE ON FUNCTION public.hash_admin_password(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.hash_admin_password(text) TO service_role;
