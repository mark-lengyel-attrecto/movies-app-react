import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: '404 — Page Not Found' };

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <p className="text-7xl font-bold text-white/10">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Page not found</h1>
        <p className="text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
