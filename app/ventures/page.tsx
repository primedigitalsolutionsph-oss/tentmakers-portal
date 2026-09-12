import Link from 'next/link';
import { ArrowRight, Network } from 'lucide-react';
import type { Metadata } from 'next';
import { ventures } from '@/lib/ventures-data';

export const metadata: Metadata = {
  title: 'Portfolio — Tentmakers Network',
  description:
    'Five portfolio companies built to close specific market gaps on Panay Island. As a member, you gain access to these companies and the skills to operate within them.',
};

const stageColors: Record<string, string> = {
  Active: 'bg-forest/15 text-forest',
  Scaling: 'bg-amber/15 text-amber',
  Early: 'bg-muted text-muted-foreground',
};

export default function VenturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
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
        <div
          className="pointer-events-none absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber/10 blur-[120px]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Our Portfolio
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Five portfolio companies.{' '}
            <span className="text-amber">Your impact starts here.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            Each company exists to close a specific, measurable market gap on
            Panay Island. As a member, you&apos;ll gain access to operate within them.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ventures.map((venture) => (
              <Link
                key={venture.slug}
                href={`/ventures/${venture.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-amber/30 hover:shadow-lg hover:shadow-amber/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 text-amber">
                    <Network className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stageColors[venture.stage]}`}
                  >
                    {venture.stage}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold text-foreground transition-colors group-hover:text-amber">
                  {venture.name}
                </h2>

                <div className="mt-2 inline-flex rounded-full bg-amber/10 px-3 py-1">
                  <span className="text-xs font-semibold text-amber">
                    {venture.gap}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {venture.offering}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-amber opacity-0 transition-opacity group-hover:opacity-100">
                  View details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
