export interface FilterableUser {
  id: string;
  email: string;
  display_name: string | null;
  memberships: { org_slug: string }[];
}

export interface UserFilter {
  q?: string;
  org?: string;
  stranded?: boolean;
}

export function filterUsers<T extends FilterableUser>(rows: T[], filter: UserFilter): T[] {
  const q = filter.q?.trim().toLowerCase() ?? '';
  const org = filter.org?.trim() ?? '';
  const stranded = filter.stranded === true;

  return rows.filter((r) => {
    if (stranded && r.memberships.length > 0) return false;
    if (org && !r.memberships.some((m) => m.org_slug === org)) return false;
    if (q) {
      const hay = `${r.email} ${r.id} ${r.display_name ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
