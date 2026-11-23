import { createClient } from '@supabase/supabase-js';

// Public browser credentials for the Rumbo Futuro Supabase project.
// These are intentionally publishable; database access is restricted by RLS.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://jcomekpaqinpgmkwrffg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_z3ald0CIUQr-646ovTpQlQ_1Qs45Epw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
