'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Member {
  id: string;
  user_id: string;
  role: string;
  email: string;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface MemberDeptMap {
  [userId: string]: string[]; // department IDs
}

interface MemberListProps {
  members: Member[];
  currentUserId: string;
  currentUserRole: string;
  orgId: string;
  departments?: DepartmentOption[];
  memberDepartments?: MemberDeptMap;
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Executive',
  member: 'Team Member',
};

export default function MemberList({
  members, currentUserId, currentUserRole, orgId,
  departments = [], memberDepartments = {},
}: MemberListProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const canManageDepts = currentUserRole === 'owner' || currentUserRole === 'admin';

  async function removeMember(memberId: string) {
    setRemoving(memberId);
    const supabase = createClient();
    await supabase.from('org_members').delete().eq('id', memberId);
    router.refresh();
    setRemoving(null);
  }

  function openDeptEditor(userId: string) {
    setEditingUser(userId);
    setSelectedDepts(memberDepartments[userId] ?? []);
  }

  function toggleDept(deptId: string) {
    setSelectedDepts((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    );
  }

  async function saveDepts() {
    if (!editingUser) return;
    setSaving(true);
    await fetch('/api/departments/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orgId,
        userId: editingUser,
        departmentIds: selectedDepts,
      }),
    });
    setSaving(false);
    setEditingUser(null);
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {members.map((m) => {
        const deptIds = memberDepartments[m.user_id] ?? [];
        const deptNames = deptIds
          .map((id) => departments.find((d) => d.id === id)?.name)
          .filter(Boolean);

        return (
          <div key={m.id} className="px-4 py-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{m.email}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{ROLE_LABELS[m.role] ?? m.role}</span>
                  {deptNames.length > 0 && (
                    <span className="text-xs text-slate-400">
                      · {deptNames.join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canManageDepts && departments.length > 0 && m.role !== 'owner' && (
                  <button
                    onClick={() => openDeptEditor(m.user_id)}
                    className="text-xs text-emerald-600 hover:text-emerald-800"
                  >
                    Departments
                  </button>
                )}
                {currentUserRole === 'owner' && m.user_id !== currentUserId && m.role !== 'owner' && (
                  <button
                    onClick={() => removeMember(m.id)}
                    disabled={removing === m.id}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    {removing === m.id ? 'Removing...' : 'Remove'}
                  </button>
                )}
              </div>
            </div>

            {/* Department assignment editor */}
            {editingUser === m.user_id && (
              <div className="mt-3 border-t border-slate-200 pt-3">
                <p className="text-xs font-medium text-slate-600 mb-2">Assign departments:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {departments.map((dept) => (
                    <label
                      key={dept.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                        selectedDepts.includes(dept.id)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(dept.id)}
                        onChange={() => toggleDept(dept.id)}
                        className="sr-only"
                      />
                      {dept.name}
                    </label>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveDepts}
                    disabled={saving}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-40"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
