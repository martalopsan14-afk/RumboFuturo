import { createClient } from '@supabase/supabase-js';

// Use the verified public credentials for the Rumbo Futuro Supabase project.
// The publishable key is safe for browser use; access is restricted by RLS.
const SUPABASE_URL = 'https://jcomekpaqinpgmkwrffg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_z3ald0CIUQr-646ovTpQlQ_1Qs45Epw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
