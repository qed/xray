import { describe, it, expect, vi, beforeEach } from 'vitest';

const cookieGet = vi.fn();
const getUserMock = vi.fn();

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: cookieGet }),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

process.env.IMPERSONATION_SECRET = 'test-secret-at-least-16-chars-long';

const { getEffectiveUserId, getActiveImpersonation } = await import('../read-as-target');
const { encodeImpersonationCookie, buildPayload } = await import('../impersonation');

describe('read-as-target', () => {
  beforeEach(() => {
    cookieGet.mockReset();
    getUserMock.mockReset();
  });

  it('returns operator id when no impersonation cookie', async () => {
    cookieGet.mockReturnValue(undefined);
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1' } } });
    expect(await getEffectiveUserId()).toBe('op-1');
  });

  it('returns null when no cookie and no session', async () => {
    cookieGet.mockReturnValue(undefined);
    getUserMock.mockResolvedValue({ data: { user: null } });
    expect(await getEffectiveUserId()).toBeNull();
  });

  it('returns target id when valid unexpired impersonation cookie present', async () => {
    const p = buildPayload('op-1', 'tgt-99', 'reproducing the bug');
    cookieGet.mockReturnValue({ value: encodeImpersonationCookie(p) });
    expect(await getEffectiveUserId()).toBe('tgt-99');
  });

  it('falls back to operator when cookie is expired', async () => {
    const p = buildPayload('op-1', 'tgt-99', 'reason reason', Date.now() - 60 * 60 * 1000);
    cookieGet.mockReturnValue({ value: encodeImpersonationCookie(p) });
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1' } } });
    expect(await getEffectiveUserId()).toBe('op-1');
  });

  it('falls back to operator when cookie MAC is bad', async () => {
    cookieGet.mockReturnValue({ value: 'garbage.deadbeef' });
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1' } } });
    expect(await getEffectiveUserId()).toBe('op-1');
  });

  it('getActiveImpersonation returns null when cookie absent', async () => {
    cookieGet.mockReturnValue(undefined);
    expect(await getActiveImpersonation()).toBeNull();
  });

  it('getActiveImpersonation returns payload when valid', async () => {
    const p = buildPayload('op-1', 'tgt-99', 'reproducing the bug');
    cookieGet.mockReturnValue({ value: encodeImpersonationCookie(p) });
    const got = await getActiveImpersonation();
    expect(got?.targetUserId).toBe('tgt-99');
    expect(got?.operatorId).toBe('op-1');
  });
});
