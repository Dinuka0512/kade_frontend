"use client";

import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { OrderStatusControl } from "@/components/order-status-control";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { useAuthedResource } from "@/lib/use-authed-resource";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function DashboardOrdersPage() {
  const { data: orders, error, loading, reload } = useAuthedResource<Order[]>(
    () => api.getOrders(),
    []
  );

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {loading
          ? "Loading orders…"
          : `${orders.length} order${orders.length === 1 ? "" : "s"} on your storefront`}
      </p>

      {error && <ErrorBanner />}

      {loading ? (
        <div className="mt-6 flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-surface-3" />
          ))}
        </div>
      ) : orders.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            title="No orders yet"
            description="Orders placed on your storefront will appear here."
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{order.number}</p>
                  <p className="text-xs text-ink-soft">
                    {formatDateTime(order.placedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  <OrderStatusControl order={order} onChanged={reload} />
                </div>
              </div>

              <div className="mt-4 border-t border-line-soft pt-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {order.email} · {order.address.line1}, {order.address.city}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {order.items
                        .map((i) => `${i.name} × ${i.qty}`)
                        .join(", ")}
                    </p>
                  </div>
                  <span className="text-base font-bold text-ink">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
