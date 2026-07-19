import { createClient } from '@supabase/supabase-js';

// Supabase configuration — sourced from build-time env (see .env / hosting env vars)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must both be set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
