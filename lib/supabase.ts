import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-url') &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('placeholder') &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes('your-anon-key')
);

// Cookie-based browser client: session is readable by middleware via cookies,
// unlike the legacy localStorage-only client.
export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey);
