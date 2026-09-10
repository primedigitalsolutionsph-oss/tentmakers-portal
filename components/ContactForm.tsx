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

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

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
    },
  });

  const inquiryType = watch('inquiryType');

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Message sent! We will reply within 24 hours.');
        setSubmitted(true);
        reset();
        return;
      }
      // Backend unavailable or validation failed server-side: fall back to mailto.
      if (res.status === 503) {
        openMailto(data);
        return;
      }
      const payload = await res.json().catch(() => null);
      toast.error(payload?.error || 'Could not send message. Try email instead.');
    } catch {
      openMailto(data);
    }
  };

  const openMailto = (data: ContactFormData) => {
    const subject = encodeURIComponent(
      `[${data.inquiryType}] Inquiry from ${data.name}`
    );
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nInquiry Type: ${data.inquiryType}\n\nMessage:\n${data.message}`
    );
    window.open(
      `mailto:support@tentmakers.ph?subject=${subject}&body=${body}`,
      '_blank'
    );
    toast.success('Opening your email client...');
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
            href="mailto:support@tentmakers.ph"
            className="font-medium text-amber hover:underline"
          >
            support@tentmakers.ph
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
