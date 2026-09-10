import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Network, Mail, Store, QrCode, CarFront, HardHat } from 'lucide-react';
import type { Metadata } from 'next';
import { ventures, getVentureBySlug } from '@/lib/ventures-data';

const ventureIcons: Record<string, React.ElementType> = {
  'prime-digital-solutions': Store,
  'thrifty-tribe': QrCode,
  icky: CarFront,
  'prime-axis': HardHat,
  'tentmakers-network': Network,
};

interface VenturePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ventures.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: VenturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venture = getVentureBySlug(slug);
  if (!venture) return { title: 'Venture Not Found' };
  return {
    title: `${venture.name} — Tentmakers Ecosystem`,
    description: venture.description,
  };
}

const stageColors: Record<string, string> = {
  Active: 'bg-forest/15 text-forest',
  Scaling: 'bg-amber/15 text-amber',
  Early: 'bg-white/10 text-white/60',
};

export default async function VentureDetailPage({ params }: VenturePageProps) {
  const { slug } = await params;
  const venture = getVentureBySlug(slug);

  if (!venture) {
    notFound();
  }

  const currentIndex = ventures.findIndex((v) => v.slug === slug);
  const nextVenture = ventures[(currentIndex + 1) % ventures.length];
  const prevVenture =
    ventures[(currentIndex - 1 + ventures.length) % ventures.length];
  const VentureIcon = ventureIcons[slug] ?? Network;

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
          <Link
            href="/ventures"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All Ventures
          </Link>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber">
              <VentureIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${stageColors[venture.stage]}`}
            >
              {venture.stage}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {venture.name}
          </h1>

          <div className="mt-3 inline-flex rounded-full bg-amber/15 px-4 py-1.5">
            <span className="text-sm font-semibold text-amber">
              {venture.gap}
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            {venture.offering}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Main content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground">
                About {venture.name}
              </h2>
              <div className="mt-6 space-y-4">
                {venture.fullDescription.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Key Metric */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Key Metric
                </p>
                <p className="mt-2 text-3xl font-bold text-amber">
                  {venture.metric}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {venture.metricLabel}
                </p>
              </div>

              {/* Market Signals */}
              <div className="mt-6 rounded-2xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Market Signals
                </p>
                <ul className="mt-4 space-y-3">
                  {venture.marketSignals.map((signal, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-6 rounded-2xl border border-amber/20 bg-amber/5 p-6">
                <h3 className="text-sm font-bold text-foreground">
                  Interested in {venture.name}?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Request access to this venture and more.
                </p>
                <a
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-amber-soft"
                >
                  <Mail className="h-4 w-4" />
                  Request Access
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            href={`/ventures/${prevVenture.slug}`}
            className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{prevVenture.name}</span>
            <span className="sm:hidden">Previous</span>
          </Link>
          <Link
            href="/ventures"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            All Ventures
          </Link>
          <Link
            href={`/ventures/${nextVenture.slug}`}
            className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="hidden sm:inline">{nextVenture.name}</span>
            <span className="sm:hidden">Next</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
