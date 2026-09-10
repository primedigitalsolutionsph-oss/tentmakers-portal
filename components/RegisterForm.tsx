'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import OAuthButtons from '@/components/OAuthButtons';
import { cn } from '@/lib/utils';

const step1Schema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Please enter a valid phone number')
    .regex(/^[+()\-.\s\d]+$/, 'Please enter a valid phone number'),
});

const step2Schema = z.object({
  password: z.string().min(12, 'Password must be at least 12 characters'),
  confirmPassword: z.string(),
  role: z.enum(['member', 'operator', 'partner'], {
    required_error: 'Please select a role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

const roles = [
  {
    value: 'member' as const,
    label: 'Member',
    description: 'Access training, ventures, and the community',
  },
  {
    value: 'operator' as const,
    label: 'Operator',
    description: 'Request operator access; approval is required',
  },
  {
    value: 'partner' as const,
    label: 'Partner',
    description: 'Request partner access; approval is required',
  },
];

function passwordScore(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 12) score += 1;
  if (pw.length >= 16) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  return { score: Math.min(score, 5), label: labels[Math.min(score, 5)] ?? 'Too weak' };
}

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    step1: Step1Data | null;
    step2: Step2Data | null;
  }>({ step1: null, step2: null });

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { fullName: '', email: '', phone: '' },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { password: '', confirmPassword: '', role: undefined },
  });

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'member' || role === 'operator' || role === 'partner') {
      step2Form.setValue('role', role);
    }
    try {
      const raw = localStorage.getItem('tm-register-step1');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.fullName) step1Form.setValue('fullName', saved.fullName);
        if (saved.email) step1Form.setValue('email', saved.email);
        if (saved.phone) step1Form.setValue('phone', saved.phone);
      }
    } catch { /* ignore */ }
  }, [searchParams, step2Form, step1Form]);

  const onStep1Submit = (data: Step1Data) => {
    setFormData((prev) => ({ ...prev, step1: data }));
    try {
      localStorage.setItem('tm-register-step1', JSON.stringify(data));
    } catch { /* ignore */ }
    setStep(2);
  };

  const onStep2Submit = async (data: Step2Data) => {
    if (!formData.step1) return;

    const { error } = await supabase.auth.signUp({
      email: formData.step1.email,
      password: data.password,
      options: {
        data: {
          full_name: formData.step1.fullName,
          phone: formData.step1.phone,
          role: 'member',
          requested_role: data.role,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    setFormData((prev) => ({ ...prev, step2: data }));
    try {
      localStorage.removeItem('tm-register-step1');
    } catch { /* ignore */ }
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="rounded-2xl border border-forest/20 bg-forest/5 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-forest" />
        <h3 className="mt-4 text-lg font-bold text-foreground">
          Welcome to Tentmakers!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Check your email for a confirmation link. Once verified, you can sign
          in as a member.
          {formData.step2?.role && formData.step2.role !== 'member'
            ? ' Your request for elevated access will require approval.'
            : null}
        </p>
        <Button
          className="mt-6 bg-amber text-navy hover:bg-amber-soft"
          onClick={() => router.push('/login')}
        >
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                step >= s
                  ? 'bg-amber text-navy'
                  : 'bg-secondary text-muted-foreground'
              )}
            >
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </span>
            {s < 2 && (
              <div
                className={cn(
                  'h-0.5 w-12',
                  step > s ? 'bg-amber' : 'bg-border'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Your full name"
                {...step1Form.register('fullName')}
                className="pl-10"
              />
            </div>
            {step1Form.formState.errors.fullName && (
              <p className="text-xs text-destructive">
                {step1Form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...step1Form.register('email')}
                className="pl-10"
              />
            </div>
            {step1Form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {step1Form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+63 9XX XXX XXXX"
                {...step1Form.register('phone')}
                className="pl-10"
              />
            </div>
            {step1Form.formState.errors.phone && (
              <p className="text-xs text-destructive">
                {step1Form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-amber text-navy hover:bg-amber-soft"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-amber hover:underline">
              Sign in
            </a>
          </p>
        </form>
      )}

      {/* Step 2: Password + Role */}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                {...step2Form.register('password')}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {step2Form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {step2Form.formState.errors.password.message}
              </p>
            )}
            {(() => {
              const pw = step2Form.watch('password') || '';
              if (!pw) return null;
              const { score, label } = passwordScore(pw);
              return (
                <div className="space-y-1.5" aria-live="polite">
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-1.5 flex-1 rounded-full',
                          i < score ? (score <= 2 ? 'bg-destructive' : score <= 3 ? 'bg-amber' : 'bg-forest') : 'bg-border'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-semibold text-foreground">{label}</span>
                    {score < 3 && ' — use 12+ characters with upper + lower case and a number'}
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...step2Form.register('confirmPassword')}
                className="pl-10"
              />
            </div>
            {step2Form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {step2Form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">I want to request access as</Label>
            <div className="grid grid-cols-1 gap-3">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all',
                    step2Form.watch('role') === role.value
                      ? 'border-amber bg-amber/5'
                      : 'border-border hover:border-amber/30'
                  )}
                >
                  <input
                    type="radio"
                    value={role.value}
                    {...step2Form.register('role')}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {role.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {step2Form.formState.errors.role && (
              <p className="text-xs text-destructive">
                {step2Form.formState.errors.role.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-amber text-navy hover:bg-amber-soft"
            >
              Create Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <OAuthButtons mode="signup" />
        </form>
      )}
    </div>
  );
}
