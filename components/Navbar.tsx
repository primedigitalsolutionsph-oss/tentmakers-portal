'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Network, LayoutDashboard, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/components/AuthProvider';

const navLinks = [
  { label: 'The Model', href: '/#the-model' },
  { label: 'Training Hub', href: '/#training-hub' },
  { label: 'About', href: '/about' },
];

const ventureLinks = [
  { label: 'All Ventures', href: '/ventures' },
  { label: 'Prime Digital Solutions', href: '/ventures/prime-digital-solutions' },
  { label: 'Thrifty Tribe', href: '/ventures/thrifty-tribe' },
  { label: 'ICKY', href: '/ventures/icky' },
  { label: 'Prime Axis', href: '/ventures/prime-axis' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [venturesOpen, setVenturesOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -20 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/10 bg-navy/95 shadow-lg shadow-black/10 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        {/* Scroll progress */}
        <motion.div
          style={prefersReducedMotion ? { scaleX: 0 } : { scaleX: progress }}
          className="absolute inset-x-0 top-0 h-[2px] origin-left bg-amber"
          aria-hidden="true"
        />
        <div className={cn(
          "mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8 transition-all duration-300",
          scrolled ? "py-3" : "py-4"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/15 transition-colors group-hover:bg-amber/25">
              <Network className="h-4 w-4 text-amber" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-white">
              Tentmakers
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.slice(0, 1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            {/* Ventures dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setVenturesOpen(true)}
              onMouseLeave={() => setVenturesOpen(false)}
            >
              <Link
                href="/ventures"
                aria-current={pathname?.startsWith('/ventures') ? 'page' : undefined}
                aria-expanded={venturesOpen}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname?.startsWith('/ventures') ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                Ventures
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", venturesOpen && "rotate-180")} />
              </Link>
              <AnimatePresence>
                {venturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full w-64 pt-2"
                  >
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-light shadow-xl shadow-black/30">
                      {ventureLinks.map((v) => (
                        <Link
                          key={v.href}
                          href={v.href}
                          className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-amber"
                        >
                          {v.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === link.href ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            {user ? (
              <Link
                href="/dashboard"
                className="ml-2 flex items-center gap-2 rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-amber-soft"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="ml-2 rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-amber px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-amber-soft"
                >
                  Join Now
                </Link>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:text-white"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-navy/98 backdrop-blur-md md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6">
              <motion.div className="w-full">
                <Link
                  href="/ventures"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-xl py-4 text-center text-lg font-medium text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  Ventures
                </Link>
              </motion.div>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 20 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-xl py-4 text-center text-lg font-medium text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <motion.div
                  initial={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 0, y: 20 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{
                    duration: 0.4,
                    delay: prefersReducedMotion ? 0 : navLinks.length * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full"
                >
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-amber py-4 text-center text-lg font-bold text-navy"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 20 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : navLinks.length * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full"
                  >
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="mt-4 block w-full rounded-xl border border-white/15 py-4 text-center text-lg font-medium text-white/70"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 20 }
                    }
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : (navLinks.length + 1) * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="w-full"
                  >
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full rounded-xl bg-amber py-4 text-center text-lg font-bold text-navy"
                    >
                      Join Now
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
