"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/vendors", label: "Vendors" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
        <div className="h-72 animate-pulse rounded-lg bg-surface-3" />
        <div className="h-96 animate-pulse rounded-lg bg-surface-3" />
      </div>
    );
  }

  if (!user) {
    router.replace("/login?next=%2Fadmin");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Admin access required"
          description="Only platform administrators can view this area. Sign in with an admin account."
          action={
            <Link
              href="/login?next=%2Fadmin"
              className="rounded-md bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Go to sign in
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-lg bg-black-950 p-3 lg:sticky lg:top-24">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Platform admin
          </p>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-surface text-ink"
                      : "text-ink-muted hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-3 my-2 h-px bg-neutral-800" />
          <Link
            href="/"
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-white/10 hover:text-white"
          >
            View storefront
          </Link>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
