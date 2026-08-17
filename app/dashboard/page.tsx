import Link from "next/link";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { formatCompact, formatDateTime, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [stats, orders] = await Promise.all([api.getDashboardStats(), api.getOrders()]);
  const recent = orders.slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Overview
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Welcome back! Here&apos;s what&apos;s happening with your storefront.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
        >
          + New product
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue"
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
          value={String(stats.products)}
          hint="Live listings"
        />
        <StatCard
          label="Customers"
          value={formatCompact(stats.customers)}
          hint={`Avg order ${formatPrice(stats.avgOrderValue)}`}
        />
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-ink">Recent orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-muted">
                <th className="pb-3 pr-4 font-semibold">Order</th>
                <th className="pb-3 pr-4 font-semibold">Customer</th>
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-line-soft last:border-0"
                >
                  <td className="py-3 pr-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-semibold text-brand-600 hover:text-brand-700"
                    >
                      {order.number}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink-soft">{order.customerName}</td>
                  <td className="py-3 pr-4 text-ink-soft">
                    {formatDateTime(order.placedAt)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-ink">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
