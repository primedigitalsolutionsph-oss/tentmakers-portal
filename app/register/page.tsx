'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterModal } from '@/hooks/use-register-modal';

export default function RegisterPage() {
  const router = useRouter();
  const { onOpen } = useRegisterModal();

  useEffect(() => {
    onOpen();
    router.replace('/');
  }, [onOpen, router]);

  return null;
}
