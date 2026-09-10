'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function OAuthButtons({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase is not configured yet. Add your keys to .env.local.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      const message = /unsupported provider|provider is not enabled/i.test(error.message)
        ? 'Google sign-in is not enabled yet. An admin needs to enable the Google provider in Supabase Auth settings.'
        : error.message;
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.9z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.1.1-3.6 2.8v.1C3.5 21.3 7.5 24 12 24z" />
          <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.5-2.7-.1.1C.5 8.9 0 10.4 0 12s.5 3.1 1.5 4.5l3.7-2.1z" />
          <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.5 0 3.5 2.7 1.5 6.9l3.7 2.8c1-2.9 3.7-5 6.8-5z" />
        </svg>
        {loading ? 'Redirecting…' : mode === 'signup' ? 'Continue with Google' : 'Continue with Google'}
      </Button>
    </div>
  );
}
