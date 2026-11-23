-- Explicit deny policies document the private-only intent of agent/admin tables.
DO $$
DECLARE t text;
BEGIN
 FOREACH t IN ARRAY ARRAY['admin_users','agent_config','rag_documents','rag_chunks'] LOOP
   EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_deny_public', t);
   EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)', t || '_deny_public', t);
 END LOOP;
END $$;