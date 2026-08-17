"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrdersView() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=%2Forders");
      return;
    }
    api
      .getOrders()
      .then(setOrders)
      .finally(() => setLoadingOrders(false));
  }, [user, loading, router]);

  if (loading) {
    return <div className="mx-auto h-40 max-w-7xl animate-pulse rounded-2xl bg-surface-3 px-4 py-8 sm:px-6" />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Your orders
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Track everything you&apos;ve ordered on Kade.
      </p>

      {loadingOrders ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-surface-3" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No orders yet"
            description="When you place your first order it will show up here."
            action={
              <Link
                href="/products"
                className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
              >
                Start shopping
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="rounded-2xl border border-line bg-surface p-5 transition hover:border-line-strong hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-ink">{order.number}</p>
                  <p className="text-xs text-ink-soft">
                    Placed {formatDateTime(order.placedAt)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.productId + item.name}
                      className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-surface-2"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="truncate text-sm text-ink-soft">
                  {order.items[0]?.name}
                  {order.items.length > 1
                    ? ` +${order.items.length - 1} more`
                    : ""}
                </p>
                <span className="ml-auto shrink-0 text-base font-bold text-ink">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
