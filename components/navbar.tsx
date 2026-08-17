"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/vendors", label: "Vendors" },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
    setQuery("");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur dark:bg-neutral-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-ink" onClick={() => setOpen(false)}>
          kade<span className="text-brand-600">.</span>
        </Link>

        <form
          onSubmit={submitSearch}
          role="search"
          className="relative hidden flex-1 max-w-md md:block"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-line bg-surface-2 py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:bg-surface focus:outline-none"
          />
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="mx-auto mt-0.5 block h-0.5 w-5 rounded-full bg-brand-600" />
              )}
            </Link>
          ))}
          {user?.role === "vendor" && (
            <Link
              href="/dashboard"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive("/dashboard")
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                isActive("/admin")
                  ? "text-ink"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative grid h-10 w-10 place-items-center rounded-md text-ink transition hover:bg-surface-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <circle cx="9" cy="21" r="1.4" />
              <circle cx="19" cy="21" r="1.4" />
              <path d="M2 3h3l2.5 12.5a2 2 0 0 0 2 1.5h8.7a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {loading ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-ink lg:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-black-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Create account
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-md text-ink transition hover:bg-surface-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-surface px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            <div className="mb-1 flex items-center justify-end border-b border-line pb-2">
              <ThemeToggle />
            </div>
            <form onSubmit={submitSearch} role="search" className="relative mb-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4-4" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-line bg-surface-2 py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-ink focus:bg-surface focus:outline-none"
              />
            </form>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "text-ink"
                    : "text-ink-soft"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "vendor" && (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft"
              >
                Dashboard
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft"
              >
                Admin
              </Link>
            )}
            <div className="my-2 h-px bg-surface-3" />
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft"
            >
              Cart {count > 0 ? `(${count})` : ""}
            </Link>
            {loading ? null : user ? (
              <>
                <span className="px-3 py-2 text-sm font-semibold text-ink">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-soft"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-black-950 px-3 py-2.5 text-sm font-semibold text-white"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
