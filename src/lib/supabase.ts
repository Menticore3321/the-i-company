import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://kjbxdvuimukxvxrhhego.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_2eGGW_HL2ghKD7QLH5gNiQ_Ja1QAAfY';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

