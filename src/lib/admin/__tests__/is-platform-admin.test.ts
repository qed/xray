import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isEnvBootstrapAdmin } from '../is-platform-admin';

describe('isEnvBootstrapAdmin', () => {
  const original = process.env.SUPERADMIN_EMAILS;

  afterEach(() => {
    process.env.SUPERADMIN_EMAILS = original;
  });

  it('returns true for an email listed in SUPERADMIN_EMAILS', () => {
    process.env.SUPERADMIN_EMAILS = 'founder@x.com,ops@x.com';
    expect(isEnvBootstrapAdmin('founder@x.com')).toBe(true);
    expect(isEnvBootstrapAdmin('ops@x.com')).toBe(true);
  });

  it('is case-insensitive and trims whitespace on both sides', () => {
    process.env.SUPERADMIN_EMAILS = ' Founder@X.com , ops@x.com ';
    expect(isEnvBootstrapAdmin('FOUNDER@x.com')).toBe(true);
    expect(isEnvBootstrapAdmin(' ops@X.COM ')).toBe(true);
  });

  it('returns false for an email not in the env var', () => {
    process.env.SUPERADMIN_EMAILS = 'founder@x.com';
    expect(isEnvBootstrapAdmin('someone.else@x.com')).toBe(false);
  });

  it('returns false when env var is missing', () => {
    delete process.env.SUPERADMIN_EMAILS;
    expect(isEnvBootstrapAdmin('founder@x.com')).toBe(false);
  });

  it('returns false when env var is empty', () => {
    process.env.SUPERADMIN_EMAILS = '';
    expect(isEnvBootstrapAdmin('founder@x.com')).toBe(false);
  });

  it('returns false for null or undefined email input', () => {
    process.env.SUPERADMIN_EMAILS = 'founder@x.com';
    expect(isEnvBootstrapAdmin(null)).toBe(false);
    expect(isEnvBootstrapAdmin(undefined)).toBe(false);
    expect(isEnvBootstrapAdmin('')).toBe(false);
  });

  it('ignores empty entries from trailing or double commas', () => {
    process.env.SUPERADMIN_EMAILS = 'founder@x.com,,ops@x.com,';
    expect(isEnvBootstrapAdmin('founder@x.com')).toBe(true);
    expect(isEnvBootstrapAdmin('')).toBe(false);
  });
});
