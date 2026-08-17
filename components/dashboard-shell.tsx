"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/products", label: "Products" },
  { href: "/dashboard/orders", label: "Orders" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
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
    router.replace("/login?next=%2Fdashboard");
    return null;
  }

  if (user.role !== "vendor") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Vendor account required"
          description="The dashboard is for vendor accounts. Create a vendor account to start selling on Kade."
          action={
            <Link
              href="/register"
              className="rounded-md bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Become a vendor
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-lg border border-line bg-surface p-3 lg:sticky lg:top-24">
          <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Storefront
          </p>
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-black-950 text-white"
                      : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-3 my-2 h-px bg-surface-3" />
          <Link
            href="/vendors"
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
          >
            View storefronts
          </Link>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
