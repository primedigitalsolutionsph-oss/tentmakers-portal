'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .trim()
    .min(10, 'Please enter a valid phone number')
    .max(20, 'Please enter a valid phone number')
    .regex(/^[+()\-.\s\d]+$/, 'Please enter a valid phone number'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: '', phone: '' },
  });

  useEffect(() => {
    if (!user || loading) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setLoadError('Profile data is unavailable. Account details are shown from your sign-in record.');
      } else {
        setLoadError(null);
      }

      if (data) {
        reset({
          fullName: data.full_name || user.user_metadata?.full_name || '',
          phone: data.phone || user.user_metadata?.phone || '',
        });
      } else {
        reset({
          fullName: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
        });
      }
    };

    fetchProfile();
  }, [user, loading, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: data.fullName,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      toast.error('Failed to update profile');
      return;
    }

    toast.success('Profile updated!');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account information.
        </p>
        {loadError ? (
          <p role="alert" className="mt-3 rounded-xl border border-amber/30 bg-amber/10 p-3 text-sm text-foreground">
            {loadError}
          </p>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={user?.email || ''}
                disabled
                className="pl-10 bg-secondary"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support for assistance.
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                placeholder="Your full name"
                {...register('fullName')}
                className="pl-10"
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
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
                {...register('phone')}
                className="pl-10"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber text-navy hover:bg-amber-soft"
          >
            {saved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
