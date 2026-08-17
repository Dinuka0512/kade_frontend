"use client";

import { useCart } from "@/lib/cart";

export function QtyInput({ productId }: { productId: string }) {
  const { items, setQty } = useCart();
  const item = items.find((i) => i.productId === productId);
  const qty = item?.qty ?? 0;

  if (qty === 0) return null;

  const btn =
    "grid h-8 w-8 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-2 disabled:opacity-40";

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1">
      <button className={btn} onClick={() => setQty(productId, qty - 1)} aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
      <button className={btn} onClick={() => setQty(productId, qty + 1)} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
