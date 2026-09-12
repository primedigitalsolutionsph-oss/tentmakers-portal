'use client';

import { createContext, useContext } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

type AppSession = NonNullable<ReturnType<typeof useSession>['data']>;
type AppUser = AppSession['user'];

interface AuthContextType {
  session: AppSession | null;
  user: AppUser | null;
  loading: boolean;
  provider: 'nextauth' | null;
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

function NextAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user ?? null;
  const loading = status === 'loading';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        provider: session ? 'nextauth' : null,
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
      <NextAuthProvider>{children}</NextAuthProvider>
    </SessionProvider>
  );
}
