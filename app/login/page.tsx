import { Network } from 'lucide-react';
import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Login — Tentmakers Network',
  description: 'Sign in to your Tentmakers Network member account.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-navy pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Member Login
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Welcome <span className="text-amber">back</span>.
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-md px-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15">
                <Network className="h-4 w-4 text-amber" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold tracking-tight text-foreground">
                Tentmakers Network
              </span>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
