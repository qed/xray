import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getUnfiledPriorities } from '@/lib/aggregator';
import { PriorityModalProvider } from '@/components/PriorityModalContext';
import PasswordGate from '@/components/PasswordGate';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X-Ray",
  description: "See everything. Automate what matters.",
};

function MissingGapsNavLink() {
  const unfiledCount = getUnfiledPriorities().length;
  return (
    <Link
      href="/unfiled"
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
    >
      Missing Gaps
      {unfiledCount > 0 && (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
          {unfiledCount}
        </span>
      )}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <PasswordGate>
        <PriorityModalProvider>
          <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-6">
                  <Link href="/" className="flex items-center gap-3">
                    <span className="text-xl font-bold tracking-tight text-emerald-600">
                      X-Ray
                    </span>
                    <span className="hidden sm:inline text-sm text-slate-500">
                      See everything. Automate what matters.
                    </span>
                  </Link>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href="/"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    AI Priorities
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/tracker"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    Tracker
                  </Link>
                  <Link
                    href="/risks"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    Risks
                  </Link>
                  <Link
                    href="/dependencies"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    Dependencies
                  </Link>
                  <Link
                    href="/tools"
                    className="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    Tools
                  </Link>
                  <MissingGapsNavLink />
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          <footer className="border-t border-slate-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-400">
              X-Ray — Powered by WeVend
            </div>
          </footer>
        </PriorityModalProvider>
        </PasswordGate>
      </body>
    </html>
  );
}
