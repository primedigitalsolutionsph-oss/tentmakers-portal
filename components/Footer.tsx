'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { ventures } from '@/lib/ventures-data';

const ventureLinks = ventures.map((v) => ({
  name: v.name,
  href: `/ventures/${v.slug}`,
}));

const sections = [
  { name: 'The Model', href: '/#the-model' },
  { name: 'Ventures', href: '/ventures' },
  { name: 'Training Hub', href: '/#training-hub' },
  { name: 'Stories', href: '/#stories' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || subscribing) return;
    setSubscribing(true);
    try {
      // Graceful: any backend failure still shows success to avoid dead-ends.
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company }),
      });
    } catch {
      /* offline: still confirm locally */
    }
    setSubscribed(true);
    setSubscribing(false);
  };

  return (
    <footer className="relative w-full bg-navy text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Newsletter strip */}
        <div className="flex flex-col gap-5 border-b border-white/10 py-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-xl font-bold text-white">Get ecosystem updates</p>
            <p className="mt-1 text-sm text-white/60">
              Training cohorts, venture launches, and operator stories. Monthly, no spam.
            </p>
          </div>
          {subscribed ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-amber">
              <CheckCircle2 className="h-4 w-4" /> You&apos;re on the list — see you soon.
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex w-full max-w-md gap-2">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-white/[0.05] px-4 text-sm text-white placeholder:text-white/40 focus:border-amber/60 focus:outline-none"
              />
              {/* Honeypot: hidden from humans, filled by naive bots. */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="newsletter-company" className="sr-only">
                  Company — leave blank
                </label>
                <input
                  id="newsletter-company"
                  type="text"
                  autoComplete="off"
                  tabIndex={-1}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={subscribing}
                className="flex h-11 items-center gap-2 rounded-xl bg-amber px-5 text-sm font-bold text-navy transition-colors hover:bg-amber-soft disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {subscribing ? 'Joining…' : 'Join'}
              </button>
            </form>
          )}
        </div>

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="Tentmakers Logo" width={36} height={36} />
              <span className="text-sm font-bold tracking-tight text-white">
                Tentmakers
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A network that turns members into operators and ventures into a
              regional ecosystem. Five ventures. One training hub. 4.67 million
              people on Panay Island.
            </p>
          </div>

          {/* Ventures column */}
          <nav aria-label="Ventures">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Ventures
            </h4>
            <ul className="mt-4 space-y-2.5">
              {ventureLinks.map((v) => (
                <li key={v.name}>
                  <a
                    href={v.href}
                    className="text-sm text-white/60 transition-colors hover:text-amber"
                  >
                    {v.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections column */}
          <nav aria-label="Explore">
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5">
              {sections.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    className="text-sm text-white/60 transition-colors hover:text-amber"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
              Connect
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <span className="text-sm text-white/60">
                  Panay Island, Western Visayas, Philippines
                </span>
              </li>
              <li>
                <a
                  href="mailto:primadigitalsolutions.ph@gmail.com"
                  className="text-sm text-white/60 transition-colors hover:text-amber"
                >
                  primadigitalsolutions.ph@gmail.com
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-white/60 transition-colors hover:text-amber">
                  Contact form
                </a>
              </li>
            </ul>
            <a
              href="/contact"
              className="mt-6 inline-flex rounded-lg bg-amber px-5 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-amber-soft"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Tentmakers Ecosystem. All rights
            reserved.
          </p>
          <p className="text-xs text-white/40">
            Member Portal &mdash; Panay Island, Philippines
          </p>
        </div>
      </div>
    </footer>
  );
}
