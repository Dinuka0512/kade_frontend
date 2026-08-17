import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [stats, orders, vendors, products] = await Promise.all([
    api.getDashboardStats(),
    api.getOrders(),
    api.getVendors(),
    api.getCatalog(),
  ]);
  const recent = orders.slice(0, 6);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Platform overview
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        A snapshot of the whole Kade marketplace.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gross revenue"
          value={formatPrice(stats.revenue)}
          hint="All time"
        />
        <StatCard
          label="Orders"
          value={String(stats.orders)}
          hint={`${stats.pendingOrders} pending`}
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          hint="Live listings"
        />
        <StatCard
          label="Vendors"
          value={String(vendors.length)}
          hint={`${vendors.filter((v) => v.status === "active").length} active`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage →
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {recent.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line-soft p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {order.number}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {order.customerName} · {formatDateTime(order.placedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-ink">
                    {formatPrice(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink">Vendors</h2>
            <Link
              href="/admin/vendors"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Manage →
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-line-soft p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {vendor.name}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {vendor.location} · {vendor.productCount} products
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                    vendor.status === "active"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  {vendor.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
