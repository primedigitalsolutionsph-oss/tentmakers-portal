import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as contactPost } from '@/app/api/contact/route';
import { POST as newsletterPost } from '@/app/api/newsletter/route';
import { GET as venturesGet } from '@/app/api/ventures/route';
import { clearRateLimits } from '@/lib/contact';

const CSRF_TOKEN = 'test-csrf-token-12345';

function postRequest(
  path: string,
  body: unknown,
  ip: string,
  withCsrf = true
): Request {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-forwarded-for': ip,
  };
  if (withCsrf) {
    headers['x-csrf-token'] = CSRF_TOKEN;
    headers.cookie = `csrf_token=${CSRF_TOKEN}`;
  }
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const validContact = {
  name: 'Maria Santos',
  email: 'maria@example.com',
  inquiryType: 'member',
  message: 'I would like to join the Tentmakers network.',
  company: '',
};

const ENV_KEYS = [
  'RESEND_API_KEY',
  'CONTACT_FROM_EMAIL',
  'CONTACT_TO_EMAIL',
  'DATABASE_URL',
] as const;

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = {};
  for (const key of ENV_KEYS) {
    savedEnv[key] = process.env[key];
    delete process.env[key];
  }
  clearRateLimits();
  vi.unstubAllGlobals();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
  vi.unstubAllGlobals();
});

describe('GET /api/ventures', () => {
  it('falls back to the static directory when MySQL is unconfigured', async () => {
    const res = await venturesGet();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('static');
    expect(body.ventures).toHaveLength(5);
  });
});

describe('POST /api/contact', () => {
  it('rejects requests without a CSRF token (403)', async () => {
    const res = await contactPost(postRequest('/api/contact', validContact, '10.0.0.1', false));
    expect(res.status).toBe(403);
  });

  it('rejects malformed JSON (400)', async () => {
    const res = await contactPost(
      postRequest('/api/contact', 'not-json{{{', '10.0.0.2')
    );
    expect(res.status).toBe(400);
  });

  it('rejects invalid inquiries (400)', async () => {
    const res = await contactPost(
      postRequest('/api/contact', { ...validContact, email: 'not-an-email' }, '10.0.0.3')
    );
    expect(res.status).toBe(400);
  });

  it('accepts honeypot submissions without revealing the trap', async () => {
    const res = await contactPost(
      postRequest('/api/contact', { ...validContact, company: 'bot-inc' }, '10.0.0.4')
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('returns 503 with a contact fallback when Resend is unconfigured', async () => {
    const res = await contactPost(postRequest('/api/contact', validContact, '10.0.0.5'));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.contactEmail).toBe('primadigitalsolutions.ph@gmail.com');
  });

  it('delivers via Resend on the happy path', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@test.example';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true }) as Response)
    );
    const res = await contactPost(postRequest('/api/contact', validContact, '10.0.0.6'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('returns 502 when Resend delivery fails', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@test.example';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false }) as Response)
    );
    const res = await contactPost(postRequest('/api/contact', validContact, '10.0.0.7'));
    expect(res.status).toBe(502);
  });

  it('rate-limits the sixth inquiry from one IP within the window (429)', async () => {
    const ip = '10.0.0.8';
    for (let i = 0; i < 5; i++) {
      const res = await contactPost(postRequest('/api/contact', validContact, ip));
      expect(res.status).toBe(503); // unconfigured, but not rate-limited
    }
    const blocked = await contactPost(postRequest('/api/contact', validContact, ip));
    expect(blocked.status).toBe(429);
  });
});

describe('POST /api/newsletter', () => {
  it('rejects requests without a CSRF token (403)', async () => {
    const res = await newsletterPost(
      postRequest('/api/newsletter', { email: 'a@example.com' }, '10.0.1.1', false)
    );
    expect(res.status).toBe(403);
  });

  it('rejects invalid email addresses (400)', async () => {
    const res = await newsletterPost(
      postRequest('/api/newsletter', { email: 'not-an-email' }, '10.0.1.2')
    );
    expect(res.status).toBe(400);
  });

  it('accepts honeypot submissions without revealing the trap', async () => {
    const res = await newsletterPost(
      postRequest(
        '/api/newsletter',
        { email: 'bot@example.com', company: 'bot-inc' },
        '10.0.1.3'
      )
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('returns 503 when neither Resend nor MySQL is configured', async () => {
    const res = await newsletterPost(
      postRequest('/api/newsletter', { email: 'a@example.com' }, '10.0.1.4')
    );
    expect(res.status).toBe(503);
  });

  it('signs up via Resend on the happy path', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@test.example';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true }) as Response)
    );
    const res = await newsletterPost(
      postRequest('/api/newsletter', { email: 'a@example.com' }, '10.0.1.5')
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it('falls through to 503 when Resend fails and MySQL is unconfigured', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_FROM_EMAIL = 'noreply@test.example';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false }) as Response)
    );
    const res = await newsletterPost(
      postRequest('/api/newsletter', { email: 'a@example.com' }, '10.0.1.6')
    );
    expect(res.status).toBe(503);
  });
});
