'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/audit', label: 'Audit' },
  { href: '/admin/admins', label: 'Admins' },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + '/');
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-slate-800 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
