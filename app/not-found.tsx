import Link from 'next/link';
import { Compass, Home, Network } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-5 text-white">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15">
          <Compass className="h-7 w-7 text-amber" aria-hidden="true" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber">
          Off the map
        </p>
        <h1 className="mt-2 font-display text-5xl font-bold tracking-tight">
          404
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          This page doesn&apos;t exist in the Tentmakers ecosystem. The five
          portfolio companies, training hub, and community are one click away.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-amber-soft"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-amber/40 hover:text-white"
          >
            <Network className="h-4 w-4" aria-hidden="true" />
            Explore portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
