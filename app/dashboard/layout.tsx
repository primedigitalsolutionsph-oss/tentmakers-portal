'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useAuth } from '@/components/AuthProvider';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  // Demo mode is opt-in via NEXT_PUBLIC_ALLOW_DEMO_AUTH=true and off by default.
  const demoAuthAllowed =
    process.env.NEXT_PUBLIC_ALLOW_DEMO_AUTH === 'true';
  const canVerify = isSupabaseConfigured || !demoAuthAllowed;

  useEffect(() => {
    if (!loading && !user && canVerify) {
      router.push('/login');
    }
  }, [user, loading, router, canVerify]);

  if (loading) {
    return (
      <div className="flex h-screen bg-background" aria-busy="true" aria-label="Loading dashboard">
        <div className="hidden w-64 shrink-0 border-r border-border bg-card p-6 sm:block">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-border" />
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-border/70" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6 sm:p-10">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="h-8 w-56 animate-pulse rounded-lg bg-border" />
            <div className="h-4 w-80 max-w-full animate-pulse rounded bg-border/70" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-[28px] border border-border bg-card" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user && canVerify) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent"
          role="status"
          aria-label="Redirecting to login"
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <main id="main-content" className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
