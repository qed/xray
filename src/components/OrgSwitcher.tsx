'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface OrgOption { slug: string; name: string; }

export default function OrgSwitcher({ currentOrg, allOrgs }: { currentOrg: OrgOption; allOrgs: OrgOption[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (allOrgs.length <= 1) {
    return <span className="text-sm font-semibold text-white">{currentOrg.name}</span>;
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-emerald-300 transition-colors">
        {currentOrg.name} <span className="text-xs">▼</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 min-w-48">
          {allOrgs.map((org) => (
            <Link key={org.slug} href={`/org/${org.slug}/priorities`} onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors ${org.slug === currentOrg.slug ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}>
              {org.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
