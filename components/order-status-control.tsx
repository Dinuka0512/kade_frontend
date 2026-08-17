"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusControl({ order }: { order: Order }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const update = async (status: OrderStatus) => {
    if (status === order.status) return;
    setBusy(true);
    try {
      await api.updateOrderStatus(order.id, status);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <select
      value={order.status}
      disabled={busy}
      onChange={(e) => update(e.target.value as OrderStatus)}
      className="rounded-xl border border-line bg-surface px-3 py-2 text-sm capitalize text-ink outline-none focus:border-brand-400 disabled:opacity-60"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
