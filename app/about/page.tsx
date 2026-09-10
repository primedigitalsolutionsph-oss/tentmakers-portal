import { Network, Target, Users, Lightbulb, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Tentmakers Network',
  description:
    'Learn about the Tentmakers Network: a founder community launching across Panay Island, targeting 300 members by Q4 2026.',
};

const values = [
  {
    icon: Target,
    title: 'Gap-Driven',
    description: 'Every venture exists to close a specific, measurable market gap — not to chase trends.',
  },
  {
    icon: Users,
    title: 'Member-First',
    description: 'Members get value from day one: dev services, QR deals and cashback, driver protection, and staffing access.',
  },
  {
    icon: Lightbulb,
    title: 'Operator Pathway',
    description: 'Our long-term vision: top members become regional operators. No franchise promises until the terms exist.',
  },
  {
    icon: MapPin,
    title: 'Regional Focus',
    description: 'Built for Panay Island\'s 4.67 million people — a market large enough to matter, small enough to capture.',
  },
];

export default function AboutPage() {
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
              About Us
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            We are building the operating system{' '}
            <span className="text-amber">for Panay Island&apos;s</span>{' '}
            founder economy.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            Tentmakers is a network that turns members into operators and
            ventures into a regional ecosystem. Five ventures, one training hub,
            a 4.67-million-person market where the gaps are wide — and each maps
            to a venture built to close it.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-8 bg-amber" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                  Our Mission
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                Close the gaps.{' '}
                <span className="text-amber">Build the ecosystem.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Panay Island has 4.67 million people, 57,469 MSMEs, and
                structural gaps in digital adoption, savings, staffing,
                insurance, and trust. Each gap maps to a venture. Each venture
                feeds the ecosystem. The training hub makes it self-sustaining.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
              <div className="space-y-6">
                {[
                  { label: 'Population', value: '4.67 million (2024 census)' },
                  { label: 'MSMEs', value: '57,469, Western Visayas (DTI)' },
                  { label: 'Digital Transactions', value: '57.4% of retail (BSP)' },
                  { label: 'Insurance Penetration', value: '~1.79% (2025)' },
                  { label: 'Member Target', value: '300 by Q4 2026' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-4"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-right text-sm font-medium text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2.5">
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                Our Principles
              </span>
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built on conviction, not speculation
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-amber/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/10 text-amber transition-colors group-hover:bg-amber/20">
                  <value.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-8 bg-amber" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                  The Story
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                Why Panay Island{' '}
                <span className="text-amber">matters</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  Western Visayas is one of the Philippines&apos; fastest-growing
                  regions, and Panay Island sits at its center. With a population
                  of 4.67 million and the 5th-highest MSME concentration in the
                  country, the market is large enough to matter and small enough
                  to capture.
                </p>
                <p>
                  The gaps are real: insurance penetration of only ~1.79%,
                  over 31,000 road accidents in a single year, businesses with
                  computers and internet but little real digital presence, and
                  QR-based spending that rewards whoever moves first.
                </p>
                <p>
                  Tentmakers was built to close these gaps — not with one product,
                  but with four ventures at staggered readiness, connected by a
                  founder community scaling toward 300 members across four
                  island chapters.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
                <div className="space-y-4">
                  {[
                    { stat: '5th', label: 'Highest MSME concentration in PH' },
                    { stat: '31K+', label: 'Road accidents in 2024 (2,747 deaths)' },
                    { stat: '57.4%', label: 'Retail transactions digital (BSP)' },
                    { stat: '90.8%', label: 'Establishments own computers, yet tools lag' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-xl bg-background/50 p-4"
                    >
                      <span className="text-2xl font-bold text-amber">
                        {item.stat}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-8 bg-amber" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                Chapters & Target
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
              300 members by Q4 2026,{' '}
              <span className="text-amber">four chapters deep</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Open Network Membership for breadth, plus selective 12-week
              accelerator cohorts of 15–25 founders ending in a
              founder-to-investor Demo Day.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { chapter: 'Iloilo City (HQ)', target: '150', note: 'Founding team covers directly' },
              { chapter: 'Capiz', target: '60', note: 'Local partner confirming' },
              { chapter: 'Aklan', target: '50', note: 'Launching with workshops' },
              { chapter: 'Antique', target: '40', note: 'Sponsor co-marketing' },
            ].map((item) => (
              <div
                key={item.chapter}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-amber/30"
              >
                <p className="font-display text-4xl font-bold tabular-nums text-amber">
                  {item.target}
                </p>
                <p className="mt-2 text-sm font-bold text-foreground">
                  {item.chapter}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-px w-8 bg-amber" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                  The Founder
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
                Rogie Prado Fabuna
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  A former Overseas Filipino Worker with over 15 years of global
                  work experience, including professional roles at PwC and Oliver
                  Wyman in Dubai — experience that shaped both world-class
                  business acumen and a close understanding of the Filipino
                  diaspora.
                </p>
                <p>
                  His technical foundation in website and app development, with a
                  focus on modern AI development, now powers the ventures and
                  the training approach across the ecosystem.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber">
                Published works
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  'Maslow’s Pyramid: A Roadmap for Filipino Innovators',
                  'IGNITE: Innovative Generation, Nurturing Ideas, Talent & Entrepreneurship',
                  'Live from the Inside Out',
                  'ESBI Methodology for entrePREneurs',
                ].map((book) => (
                  <li
                    key={book}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
                    {book}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
                Also the visionary behind the Tentmakers&rsquo; Way Book Series —
                purpose-driven, faith-rooted leadership for OFWs,
                entrepreneurs, educators, and public servants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 text-center">
          <Network className="mx-auto h-10 w-10 text-amber" aria-hidden="true" />
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to be part of the network?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Whether you are a member, operator, or builder — there is a place
            for you in the Tentmakers network.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-amber-soft"
            >
              Request Access
            </a>
            <a
              href="/ventures"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-amber/40 hover:text-foreground"
            >
              View Ventures
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
