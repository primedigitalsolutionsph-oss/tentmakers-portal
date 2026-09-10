import { describe, expect, it, beforeEach } from 'vitest';
import {
  CONTACT_EMAIL,
  clearRateLimits,
  contactSchema,
  getClientIp,
  isRateLimited,
  sanitizeLine,
} from '@/lib/contact';

describe('contact validation', () => {
  it('accepts a valid inquiry', () => {
    const result = contactSchema.safeParse({
      name: 'Maria Santos',
      email: 'maria@example.com',
      inquiryType: 'member',
      message: 'I would like to join the network.',
      company: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email, short message, and unknown inquiry type', () => {
    expect(
      contactSchema.safeParse({
        name: 'Maria Santos',
        email: 'not-an-email',
        inquiryType: 'member',
        message: 'I would like to join the network.',
      }).success
    ).toBe(false);
    expect(
      contactSchema.safeParse({
        name: 'Maria Santos',
        email: 'maria@example.com',
        inquiryType: 'member',
        message: 'Too short',
      }).success
    ).toBe(false);
    expect(
      contactSchema.safeParse({
        name: 'Maria Santos',
        email: 'maria@example.com',
        inquiryType: 'spam',
        message: 'I would like to join the network.',
      }).success
    ).toBe(false);
  });
});

describe('sanitizeLine', () => {
  it('strips carriage returns and newlines', () => {
    expect(sanitizeLine('hello\r\nworld\ntest')).toBe('hello world test');
  });
});

describe('rate limiting', () => {
  beforeEach(() => clearRateLimits());

  it('allows five requests then blocks the sixth within the window', () => {
    const now = Date.now();
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited('test-ip', now + i)).toBe(false);
    }
    expect(isRateLimited('test-ip', now + 5)).toBe(true);
  });
});

describe('getClientIp', () => {
  it('prefers the first x-forwarded-for entry', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    });
    expect(getClientIp(request)).toBe('1.2.3.4');
  });
});

describe('canonical contact address', () => {
  it('is a single shared constant', () => {
    expect(CONTACT_EMAIL).toBe('primadigitalsolutions.ph@gmail.com');
  });
});
