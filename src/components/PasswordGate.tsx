'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'xray-auth';
const PASSCODE = '8225';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) return null;

  if (authenticated) {
    return <>{children}</>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white">
      <div className="text-center space-y-6 max-w-sm w-full px-6">
        <div>
          <h1 className="text-2xl font-bold text-emerald-600 mb-1">X-Ray</h1>
          <p className="text-slate-500 text-sm">Enter passcode to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            className="w-full text-center text-2xl tracking-[0.5em] border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
            placeholder="••••"
            autoFocus
          />
          {error && (
            <p className="text-red-600 text-sm">Incorrect passcode</p>
          )}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white font-medium py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
