import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  encodeImpersonationCookie,
  decodeImpersonationCookie,
  isExpired,
  buildPayload,
  IMPERSONATION_TTL_MS,
} from '../impersonation';

describe('impersonation cookie', () => {
  const original = process.env.IMPERSONATION_SECRET;

  beforeEach(() => {
    process.env.IMPERSONATION_SECRET = 'test-secret-at-least-16-chars-long';
  });
  afterEach(() => {
    process.env.IMPERSONATION_SECRET = original;
  });

  it('round-trips a valid payload', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reproduce customer bug #42', 1000);
    const cookie = encodeImpersonationCookie(p);
    const decoded = decodeImpersonationCookie(cookie);
    expect(decoded).toEqual(p);
  });

  it('returns null when HMAC is tampered', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    const cookie = encodeImpersonationCookie(p);
    // Flip last char of MAC
    const tampered = cookie.slice(0, -1) + (cookie.slice(-1) === '0' ? '1' : '0');
    expect(decodeImpersonationCookie(tampered)).toBeNull();
  });

  it('returns null when payload body is tampered', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    const cookie = encodeImpersonationCookie(p);
    const [body, mac] = cookie.split('.');
    expect(decodeImpersonationCookie(`${body}X.${mac}`)).toBeNull();
  });

  it('returns null for missing/empty/malformed', () => {
    expect(decodeImpersonationCookie(null)).toBeNull();
    expect(decodeImpersonationCookie(undefined)).toBeNull();
    expect(decodeImpersonationCookie('')).toBeNull();
    expect(decodeImpersonationCookie('no-dot-at-all')).toBeNull();
  });

  it('returns null when signed with a different secret', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    const cookie = encodeImpersonationCookie(p);
    process.env.IMPERSONATION_SECRET = 'different-secret-0000000000000000';
    expect(decodeImpersonationCookie(cookie)).toBeNull();
  });

  it('isExpired returns true when now >= expiresAt', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    expect(isExpired(p, 1000 + IMPERSONATION_TTL_MS)).toBe(true);
    expect(isExpired(p, 1000 + IMPERSONATION_TTL_MS + 1)).toBe(true);
    expect(isExpired(p, 1000 + IMPERSONATION_TTL_MS - 1)).toBe(false);
  });

  it('buildPayload sets expiresAt 30 minutes after startedAt', () => {
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 5000);
    expect(p.expiresAt - p.startedAt).toBe(30 * 60 * 1000);
  });

  it('throws if IMPERSONATION_SECRET is missing', () => {
    delete process.env.IMPERSONATION_SECRET;
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    expect(() => encodeImpersonationCookie(p)).toThrow(/IMPERSONATION_SECRET/);
  });

  it('throws if IMPERSONATION_SECRET is too short', () => {
    process.env.IMPERSONATION_SECRET = 'short';
    const p = buildPayload('op-1', 'tgt-1', 'reason reason', 1000);
    expect(() => encodeImpersonationCookie(p)).toThrow(/too short/);
  });
});
