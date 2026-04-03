import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Use dummy values during build to prevent static generation errors if env vars are missing
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
