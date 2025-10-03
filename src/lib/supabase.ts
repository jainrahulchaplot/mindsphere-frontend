import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (url && key) ? createClient(url, key) : null;

// Auto-detect auth mode based on Supabase configuration
// If Supabase is properly configured, use Google auth; otherwise use demo mode
export const authMode = (supabase && url && key) ? 'google' : 'demo';
