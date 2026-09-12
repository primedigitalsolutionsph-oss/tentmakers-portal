'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRegisterModal } from '@/hooks/use-register-modal';

function StepPrerequisite() {
  const { data, updateData, goToStep } = useRegisterModal();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleNext = () => {
    if (data.email) {
      goToStep('options');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && data.email) {
      handleNext();
    }
  };

  return (
    <motion.div
      key="prerequisite"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <h2 className="font-display text-2xl font-bold text-foreground">
        Join Tentmakers Network
      </h2>
      <p className="text-sm text-muted-foreground">
        Training, mentorship, and real tools to help you build something that lasts. No fees to join.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-foreground">
            Email address
          </label>
          <input
            ref={emailRef}
            id="register-email"
            type="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
            className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            autoComplete="email"
            required
          />
        </div>

        <button
          onClick={handleNext}
          disabled={!data.email}
          className="mt-4 w-full rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-all hover:bg-amber-soft hover:shadow-lg hover:shadow-amber/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}

function StepOptions() {
  const { updateData, goToStep, onClose } = useRegisterModal();

  const roles = [
    {
      id: 'smme-owner',
      label: 'SME Owner',
      description: 'I run an existing small or medium business',
    },
    {
      id: 'entrepreneur',
      label: 'Aspiring Entrepreneur',
      description: 'I want to start a venture or side hustle',
    },
    {
      id: 'skilled-worker',
      label: 'Skilled Worker',
      description: 'I have skills to offer and want to grow',
    },
  ];

  const handleSelect = (roleId: string) => {
    updateData({ role: roleId });
    goToStep('details');
  };

  return (
    <motion.div
      key="options"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Sign up with Google or email
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No fees to join. Pick the option that works best for you.
        </p>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => handleSelect(role.id)}
            className="block w-full text-left rounded-xl border border-border bg-card p-4 transition-all hover:border-amber/40 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-navy/20" />
              <div>
                <p className="font-semibold text-foreground">{role.label}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {role.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={() => goToStep('prerequisite')}
          className="text-sm font-medium text-amber hover:text-amber/80"
        >
          Back
        </button>
        <button
          onClick={onClose}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}

function StepDetails() {
  const { data, goToStep } = useRegisterModal();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) return;
    const displayName = name.trim() || data.email.split('@')[0] || 'New member';
    const message = [
      `Access request from the website join flow.`,
      `Role: ${data.role ?? 'unspecified'}.`,
      `Phone: ${phone.trim() || 'not provided'}.`,
      `Referral: ${referral || 'not provided'}.`,
    ].join(' ');
    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: displayName,
          email: data.email,
          inquiryType: 'member',
          message,
          company: '',
        }),
      });
      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(result?.error || 'Could not send your request. Please try again.');
        setSubmitting(false);
        return;
      }
      goToStep('success');
    } catch {
      toast.error('Could not send your request. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      key="details"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          You&apos;re in — your first step starts here
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Meet your mentor and start Tier 1. Track your Readiness Score as you go.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id="register-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="register-phone" className="block text-sm font-medium text-foreground">
            Phone number
          </label>
          <input
            id="register-phone"
            type="tel"
            placeholder="+63 XXX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
            autoComplete="tel"
          />
        </div>

        <div>
          <label htmlFor="register-referral" className="block text-sm font-medium text-foreground">
            How did you hear about us?
          </label>
          <select
            id="register-referral"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="">Select an option</option>
            <option value="friend">From a friend</option>
            <option value="social">Social media</option>
            <option value="search">Search engine</option>
            <option value="event">Event/Meetup</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-2 w-full rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-all hover:bg-amber-soft hover:shadow-lg hover:shadow-amber/20 disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Complete Registration'}
        </button>
      </div>

      <div className="pt-2">
        <button
          onClick={() => goToStep('options')}
          className="text-sm font-medium text-amber hover:text-amber/80"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}

function StepSuccess() {
  const { reset } = useRegisterModal();

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 text-center"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber/15">
        <svg
          className="h-8 w-8 text-amber"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15.75 9" />
        </svg>
      </div>

      <h2 className="font-display text-2xl font-bold text-foreground">
        Welcome to the Tentmakers Network
      </h2>
      <p className="text-sm text-muted-foreground">
        Your first step: meet your mentor and start Tier 1. Your Readiness Score
        will track your progress — it&apos;s not a test, it&apos;s a map of what
        you&apos;ve built.
      </p>

      <button
        onClick={reset}
        className="mt-4 w-full rounded-xl bg-amber px-6 py-3 text-sm font-bold text-navy transition-all hover:bg-amber-soft hover:shadow-lg hover:shadow-amber/20"
      >
        Got it
      </button>
    </motion.div>
  );
}

export default function RegisterModal() {
  const { isOpen, currentStep, onClose } = useRegisterModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the first focusable element in the modal
      setTimeout(() => {
        dialogRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const renderStep = () => {
    switch (currentStep) {
      case 'prerequisite':
        return <StepPrerequisite />;
      case 'options':
        return <StepOptions />;
      case 'details':
        return <StepDetails />;
      case 'success':
        return <StepSuccess />;
      default:
        return <StepPrerequisite />;
    }
  };

  const stepProgress = {
    prerequisite: 1,
    options: 2,
    details: 3,
    success: 4,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-none bg-transparent p-0 shadow-none data-[state=open]:fade-in-0">
        <div
          ref={dialogRef}
          tabIndex={-1}
          className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          {currentStep !== 'success' && (
            <div className="mb-6">
              <div className="h-1.5 w-full rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-amber transition-all duration-300"
                  style={{
                    width: `${((stepProgress[currentStep] - 1) / 3) * 100}%`,
                  }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Join</span>
                <span>Details</span>
                <span>Start Tier 1</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
