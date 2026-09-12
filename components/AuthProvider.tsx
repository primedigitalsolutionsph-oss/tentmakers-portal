'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import type { Session, User, UserMetadata } from '@supabase/supabase-js';

interface MysqlUser {
  id: string;
  email?: string | null;
}

interface AuthContextType {
  session: Session | null;
  // Supabase User has user_metadata; MySQL/Auth.js user is {id,email}.
  user: User | MysqlUser | null;
  loading: boolean;
  /** Active provider: Supabase (primary) or mysql/Auth.js (Hostinger). */
  provider: 'supabase' | 'mysql' | null;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  provider: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Supabase users carry `user_metadata`; MySQL/Auth.js users do not.
 * Use this instead of touching `user.user_metadata` directly so the
 * dual-provider union stays type-safe during the transition.
 */
export function getUserMetadata(
  user: User | MysqlUser | null | undefined
): UserMetadata | undefined {
  if (user && 'user_metadata' in user) return user.user_metadata;
  return undefined;
}

function SupabaseAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: mysqlSession, status: mysqlStatus } = useSession();
  const mysqlUser =
    mysqlStatus === 'authenticated' && mysqlSession?.user
      ? {
          id: (mysqlSession.user as { id?: string }).id ?? mysqlSession.user.email ?? 'mysql-user',
          email: mysqlSession.user.email,
        }
      : null;
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initializeSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (active) setSession(session);
      } catch {
        if (active) setSession(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    initializeSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? mysqlUser;
  const isLoading = loading && mysqlStatus === 'loading';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading: isLoading,
        provider: session ? 'supabase' : mysqlUser ? 'mysql' : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SupabaseAuth>{children}</SupabaseAuth>
    </SessionProvider>
  );
}
