import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
      <p className="text-xl text-slate-500 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
      >
        Back to Overview
      </Link>
    </div>
  );
}
