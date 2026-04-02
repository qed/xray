'use client';

import { createContext, useContext } from 'react';

type Role = 'owner' | 'admin' | 'member';

const RoleContext = createContext<Role>('member');

export function RoleProvider({ role, children }: { role: Role; children: React.ReactNode }) {
  return <RoleContext value={role}>{children}</RoleContext>;
}

export function useRole(): Role {
  return useContext(RoleContext);
}
