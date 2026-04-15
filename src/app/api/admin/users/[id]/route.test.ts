import { describe, it, expect, vi, beforeEach } from 'vitest';

const getUserMock = vi.fn();
const isAdminMock = vi.fn();
const getUserByIdMock = vi.fn();
const deleteUserMock = vi.fn();
const rpcMock = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: getUserMock } }),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    auth: {
      admin: {
        getUserById: getUserByIdMock,
        deleteUser: deleteUserMock,
      },
    },
    rpc: rpcMock,
  }),
}));

vi.mock('@/lib/admin/is-platform-admin', () => ({
  isPlatformAdmin: isAdminMock,
}));

// Import after mocks
const { DELETE } = await import('./route');

function req(body: unknown = {}) {
  return new Request('http://x/api/admin/users/target-id', {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  }) as any;
}

const ctx = (id = 'target-id') => ({ params: Promise.resolve({ id }) });

describe('DELETE /api/admin/users/[id]', () => {
  beforeEach(() => {
    getUserMock.mockReset();
    isAdminMock.mockReset();
    getUserByIdMock.mockReset();
    deleteUserMock.mockReset();
    rpcMock.mockReset();
  });

  it('returns 404 when unauthenticated', async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    const res = await DELETE(req(), ctx());
    expect(res.status).toBe(404);
  });

  it('returns 404 when caller is not a platform admin', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(false);
    const res = await DELETE(req(), ctx());
    expect(res.status).toBe(404);
  });

  it('refuses self-deletion with 400', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'target-id', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    const res = await DELETE(req(), ctx('target-id'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/cannot delete themselves/i);
  });

  it('happy path: writes audit row before deleting, returns ok', async () => {
    const calls: string[] = [];
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockImplementation(async () => {
      calls.push('getUserById');
      return { data: { user: { id: 'target-id', email: 'victim@x.com', created_at: 't', user_metadata: {} } } };
    });
    rpcMock.mockImplementation(async (_name: string) => {
      calls.push('rpc');
      return { error: null };
    });
    deleteUserMock.mockImplementation(async () => {
      calls.push('delete');
      return { error: null };
    });

    const res = await DELETE(req({ reason: 'duplicate account' }), ctx());
    expect(res.status).toBe(200);
    expect(calls).toEqual(['getUserById', 'rpc', 'delete']);
    expect(rpcMock).toHaveBeenCalledWith('log_admin_action', expect.objectContaining({
      p_action: 'delete_user',
      p_operator_id: 'op-1',
      p_target_user_id: 'target-id',
      p_reason: 'duplicate account',
    }));
  });

  it('returns 404 if target user not found', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: null } });
    const res = await DELETE(req(), ctx());
    expect(res.status).toBe(404);
  });

  it('surfaces raw Supabase delete error', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: { id: 'target-id', email: 'v@x.com', created_at: 't', user_metadata: {} } } });
    rpcMock.mockResolvedValue({ error: null });
    deleteUserMock.mockResolvedValue({ error: { message: 'foreign key violation on table uploads' } });

    const res = await DELETE(req(), ctx());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain('foreign key violation');
  });

  it('fails closed if audit write fails (does not call delete)', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: { id: 'target-id', email: 'v@x.com', created_at: 't', user_metadata: {} } } });
    rpcMock.mockResolvedValue({ error: { message: 'audit trigger exploded' } });

    const res = await DELETE(req(), ctx());
    expect(res.status).toBe(500);
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it('drops empty/whitespace reason to null', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'op-1', email: 'a@b.com' } } });
    isAdminMock.mockResolvedValue(true);
    getUserByIdMock.mockResolvedValue({ data: { user: { id: 'target-id', email: 'v@x.com', created_at: 't', user_metadata: {} } } });
    rpcMock.mockResolvedValue({ error: null });
    deleteUserMock.mockResolvedValue({ error: null });

    await DELETE(req({ reason: '   ' }), ctx());
    expect(rpcMock).toHaveBeenCalledWith('log_admin_action', expect.objectContaining({ p_reason: null }));
  });
});
