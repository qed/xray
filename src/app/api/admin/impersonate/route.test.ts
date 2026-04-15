import { describe, it, expect, vi, beforeEach } from 'vitest';

const getUserMock = vi.fn();
const isAdminMock = vi.fn();
const getUserByIdMock = vi.fn();
const rpcMock = vi.fn();

const fromChain = () => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn().mockResolvedValue({ data: { organizations: { slug: 'wevend' } } }),
});
const fromMock = vi.fn(() => fromChain());

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    auth: { admin: { getUserById: getUserByIdMock } },
    rpc: rpcMock,
    from: fromMock,
  }),
}));

vi.mock('@/lib/admin/is-platform-admin', () => ({
  isPlatformAdmin: isAdminMock,
}));

process.env.IMPERSONATION_SECRET = 'test-secret-at-least-16-chars-long';

const { POST } = await import('./route');

function req(body: unknown) {
  return new Request('http://x/api/admin/impersonate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }) as any;
}

describe('POST /api/admin/impersonate', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    isAdminMock.mockReset();
    getUserByIdMock.mockReset();
    rpcMock.mockReset();
    fromMock.mockClear();
  });

  it('returns 404 when unauthenticated', async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    const res = await POST(req({ targetUserId: 't', reason: 'some reason' }));
    expect(res.status).toBe(404);
  });

  it('returns 404 when caller is not platform admin', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(false);
    const res = await POST(req({ targetUserId: 't', reason: 'some reason' }));
    expect(res.status).toBe(404);
  });

  it('returns 400 when reason is shorter than 8 chars', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    const res = await POST(req({ targetUserId: 't', reason: 'short' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/reason/i);
  });

  it('returns 400 when impersonating self', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'same', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    const res = await POST(req({ targetUserId: 'same', reason: 'a valid reason' }));
    expect(res.status).toBe(400);
  });

  it('returns 404 when target does not exist', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: null } });
    const res = await POST(req({ targetUserId: 'missing', reason: 'a valid reason' }));
    expect(res.status).toBe(404);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it('happy path: writes start audit, sets signed cookie, returns landing', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: { id: 'tgt', email: 'v@x.com' } } });
    rpcMock.mockResolvedValue({ error: null });

    const res = await POST(req({ targetUserId: 'tgt', reason: 'reproducing bug #42' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.landing).toBe('/org/wevend');

    expect(rpcMock).toHaveBeenCalledWith('log_admin_action', expect.objectContaining({
      p_action: 'impersonate.start',
      p_operator_id: 'op',
      p_target_user_id: 'tgt',
      p_reason: 'reproducing bug #42',
    }));

    const setCookie = res.headers.get('set-cookie') || '';
    expect(setCookie).toContain('xray_impersonation=');
    expect(setCookie).toContain('HttpOnly');
    expect(setCookie).toContain('Max-Age=1800');
  });
});
