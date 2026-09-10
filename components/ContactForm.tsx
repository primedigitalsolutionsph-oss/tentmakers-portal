'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CONTACT_EMAIL } from '@/lib/contact';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().max(100).optional().default(''),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      inquiryType: '',
      message: '',
      company: '',
    },
  });

  const inquiryType = watch('inquiryType');

  const onSubmit = async (data: ContactFormData) => {
    setApiError(null);

    let response: Response;
    try {
      response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      setApiError(`Could not send your message. Please email us directly at ${CONTACT_EMAIL}.`);
      return;
    }

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as {
        error?: string;
        contactEmail?: string;
      } | null;
      if (response.status === 503 && result?.contactEmail) {
        setApiError(
          `Online inquiries are temporarily unavailable. Please email us directly at ${result.contactEmail}.`
        );
      } else {
        setApiError(result?.error || 'Could not send your message. Please try again.');
      }
      return;
    }

    toast.success('Message sent. We will get back to you within 24 hours.');
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-forest/20 bg-forest/5 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-forest" />
        <h3 className="mt-4 text-lg font-bold text-foreground">
          Message sent!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for reaching out — we&apos;ll reply within 24 hours. If you
          need to follow up, write to{' '}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-amber hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Your name"
            {...register('name')}
            className="bg-background"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            className="bg-background"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Inquiry Type */}
      <div className="space-y-2">
        <Label htmlFor="inquiryType" className="text-sm font-medium">Inquiry Type</Label>
        <Select
          value={inquiryType}
          onValueChange={(value) => setValue('inquiryType', value, { shouldValidate: true })}
        >
          <SelectTrigger
            id="inquiryType"
            className="bg-background"
            aria-invalid={Boolean(errors.inquiryType)}
            aria-describedby={errors.inquiryType ? 'inquiryType-error' : undefined}
          >
            <SelectValue placeholder="Select an inquiry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member Support</SelectItem>
            <SelectItem value="partner">Partnership</SelectItem>
            <SelectItem value="general">General Inquiry</SelectItem>
          </SelectContent>
        </Select>
        {errors.inquiryType && (
          <p id="inquiryType-error" className="text-xs text-destructive">
            {errors.inquiryType.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Tell us about your interest in the Tentmakers ecosystem..."
          rows={5}
          {...register('message')}
          className="bg-background resize-none"
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <div className="hidden" aria-hidden="true">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          autoComplete="off"
          tabIndex={-1}
          {...register('company')}
        />
      </div>

      {apiError ? (
        <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
          {apiError}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber text-navy hover:bg-amber-soft sm:w-auto"
      >
        <Send className="mr-2 h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}
