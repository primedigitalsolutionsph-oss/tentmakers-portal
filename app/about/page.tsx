import { Network } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Program Design — Tentmakers Network',
  description:
    'Readiness Scoring Rubric, Tier Curriculum, and portal design for the Tentmakers Network member program.',
};

const scoreComponents = [
  { component: 'Training Completion', weight: '30%', measure: 'Modules and assessments completed across the three tiers', source: 'LMS / training module' },
  { component: 'Savings Consistency', weight: '20%', measure: 'Savings streak maintained cycle over cycle', source: 'Thrifty Tribe' },
  { component: 'Site Engagement', weight: '20%', measure: 'Business Foundation Site live and updated monthly', source: 'Prime Digital Solutions' },
  { component: 'Protection Enrollment & Upkeep', weight: '15%', measure: 'Active cover kept current, not just enrolled once', source: 'ICKY' },
  { component: 'Mentorship Participation', weight: '15%', measure: 'Check-ins attended plus peer teaching sessions', source: 'Mentorship log' },
];

const scoreBands = [
  { band: 'Foundation', range: '0–39', meaning: 'Just started; building basic habits', eligibility: 'Tier 1 access only' },
  { band: 'Building', range: '40–69', meaning: 'Consistent engagement across 2+ components', eligibility: 'Tier 2 eligible' },
  { band: 'Established', range: '70–89', meaning: 'Strong, sustained performance across most components', eligibility: 'Tier 3 eligible' },
  { band: 'Anchor', range: '90–100', meaning: 'Sustained excellence; candidate for mentor role', eligibility: 'Mentor-track eligible' },
];

const tiers = [
  {
    tier: 'Tier 1 — Foundation',
    goal: 'Every member leaves with a working online presence and a savings habit started.',
    modules: [
      { name: 'Orientation & Network Overview', format: 'Live/recorded session', outcome: 'Understands the network, portfolio companies, and what "readiness" means' },
      { name: 'Digital Basics', format: 'Self-paced', outcome: 'Understands what a Business Foundation Site is for and how to use it' },
      { name: 'Business Foundation Site Setup', format: 'Guided, with PDS support', outcome: 'Site live, member trained to edit basic content' },
      { name: 'Savings Habit Fundamentals', format: 'Self-paced + workbook', outcome: 'Enrolled in Thrifty Tribe, first savings cycle started' },
      { name: 'Tier 1 Assessment', format: 'Short quiz + savings-cycle check', outcome: 'Unlocks Tier 2 eligibility once score threshold met' },
    ],
    mentorship: '1 onboarding call with an assigned mentor after orientation.',
    events: 'Cohort kickoff (in-person or hybrid).',
  },
  {
    tier: 'Tier 2 — Building',
    goal: 'Members establish risk protection and demonstrate consistency, not just completion.',
    modules: [
      { name: 'Risk & Protection Basics', format: 'Self-paced', outcome: 'Understands what ICKY protection covers and why it matters' },
      { name: 'Protection Enrollment', format: 'Guided, with ICKY advisor', outcome: 'Active enrollment' },
      { name: 'Site Growth Workshop', format: 'Live workshop', outcome: 'Site updated with real content (products, services, contact info)' },
      { name: 'Financial Habit Deepening', format: 'Self-paced + check-in', outcome: 'Savings streak maintained across the tier period' },
      { name: 'Tier 2 Assessment', format: 'Case-study exercise', outcome: 'Unlocks Tier 3 eligibility once score threshold met' },
    ],
    mentorship: '1 check-in call mid-tier, 1 at tier close.',
    events: 'Tier-completion workshop (regional, hybrid).',
  },
  {
    tier: 'Tier 3 — Established',
    goal: 'Members with a growing business are ready to hire and operate with less hand-holding.',
    modules: [
      { name: 'Staffing Readiness', format: 'Self-paced + worksheet', outcome: 'Understands when and how to hire; drafts a basic job need' },
      { name: 'Prime Axis Staffing Access', format: 'Guided', outcome: 'First staffing request submitted (if applicable)' },
      { name: 'Sustainability Planning', format: 'Live workshop', outcome: 'Written 6–12 month plan for site, savings, and protection' },
      { name: 'Peer Teaching Session', format: 'Live, member-led', outcome: 'Member shares one lesson learned with a newer cohort' },
      { name: 'Tier 3 Assessment', format: 'Portfolio review', outcome: 'Anchor-band eligibility if score threshold met' },
    ],
    mentorship: 'Member begins mentoring a Tier 1 member (optional, scored under Mentorship Participation).',
    events: 'Network-wide gathering; graduation recognition (not a franchise offer).',
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
              Program Design
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Readiness Score · Tier Curriculum · Portal Copy
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55">
            The Readiness Score is the single number that gates tier advancement
            and gives members (and the network) a shared read on progress. It
            blends training completion with behavioral signal, so it can&apos;t be
            gamed by course-clicking alone.
          </p>
        </div>
      </section>

      {/* Score Components */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              1. Readiness Scoring Rubric
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Score Components
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            No single component can gate advancement alone. A member who is
            excellent at savings but hasn&apos;t touched their site yet should not be
            blocked — but should get a nudge, not a rejection.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Component</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">What it measures</th>
                  <th className="px-4 py-3 font-semibold">Data source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scoreComponents.map((row) => (
                  <tr key={row.component} className="hover:bg-secondary/40">
                    <td className="px-4 py-3 font-medium text-foreground">{row.component}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.weight}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.measure}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-12 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Score Bands
          </h3>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Score decays gently on inactivity (-2 points per 30 days of no
            activity across any component) so the score reflects current
            readiness, not a one-time peak. Mentors review edge cases and can
            manually flag advancement or hold-back with a written reason.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {scoreBands.map((band) => (
              <div
                key={band.band}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-amber">
                  {band.band}
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                  {band.range}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{band.meaning}</p>
                <p className="mt-3 text-xs font-medium text-foreground/80">{band.eligibility}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tier Curriculum */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              2. Tier-by-Tier Curriculum
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three tiers. One path.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Each tier has a clear goal, modules, and an assessment that unlocks
            the next tier once the Readiness Score threshold is met.
          </p>
          <div className="mt-10 space-y-10">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="border-b border-border bg-secondary/40 px-6 py-5 sm:px-8">
                  <h3 className="text-xl font-bold text-foreground">{t.tier}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.goal}</p>
                </div>
                <div className="px-6 py-6 sm:px-8">
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="px-4 py-2 font-semibold">Module</th>
                          <th className="px-4 py-2 font-semibold">Format</th>
                          <th className="px-4 py-2 font-semibold">Outcome</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {t.modules.map((m) => (
                          <tr key={m.name} className="hover:bg-secondary/30">
                            <td className="px-4 py-2.5 font-medium text-foreground">{m.name}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{m.format}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{m.outcome}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-secondary/40 p-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Mentorship:</span> {t.mentorship}
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-4 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Events:</span> {t.events}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Notes */}
      <section className="border-t border-border py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-amber" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Program Notes
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How the network stays fair and scalable
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground">Readiness, not employment</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Tiers are strictly readiness gates, not a ladder toward a
                Tentmakers role. A member can complete all three tiers and never
                engage with Tentmakers again — that is a successful outcome, not
                an attrition problem.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground">Mentor pipeline, not career path</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The Anchor band and Peer Teaching Session build a natural mentor
                pipeline without labeling it a “career path,” keeping the
                network&apos;s role as an enabler rather than an
                employer-in-waiting.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground">Mentor overrides</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Automated scoring handles the default path; a mentor can manually
                flag a member for advancement or hold-back with a written reason,
                logged for fairness and audit purposes.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h3 className="text-lg font-bold text-foreground">Score decay</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Score decays gently on inactivity (-2 points per 30 days of no
                activity across any component) so the score reflects current
                readiness, not a one-time peak.
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
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-colors hover:bg-amber-soft"
            >
              Request Access
            </Link>
            <Link
              href="/ventures"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-amber/40 hover:text-foreground"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
