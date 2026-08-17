import type { Metadata } from "next";
import { ErrorBanner } from "@/components/error-banner";
import { OrderStatusControl } from "@/components/order-status-control";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof api.getOrders>> = [];
  let serverError = false;

  try {
    orders = await api.getOrders();
  } catch {
    serverError = true;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft">
        All orders placed across the platform
      </p>

      {serverError && <ErrorBanner />}

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
                <OrderStatusControl order={order} />
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
                    {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                  </p>
                </div>
                <span className="text-base font-bold text-ink">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && !serverError && (
          <p className="py-8 text-center text-sm text-ink-muted">No orders yet</p>
        )}
      </div>
    </div>
  );
}
