import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-black-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black-950/90"
      >
        Back to home
      </Link>
    </div>
  );
}
