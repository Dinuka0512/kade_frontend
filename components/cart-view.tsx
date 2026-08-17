"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCartLines } from "@/lib/use-cart-lines";

export function CartView() {
  const { items, setQty, remove } = useCart();
  const { lines, loading, subtotal, shippingFee, total } = useCartLines();
  const router = useRouter();

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="h-64 rounded-2xl bg-surface-3" />
        <div className="h-64 rounded-2xl bg-surface-3" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Your cart
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length === 0 ? "" : `${lines.length} item${lines.length === 1 ? "" : "s"}`}
      </p>

      {lines.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Your cart is empty"
            description="Browse the marketplace and find something you love."
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
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            {lines.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="line-clamp-2 font-semibold text-ink hover:text-brand-600"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">
                        by {product.vendorName}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-muted transition hover:bg-rose-50 hover:text-rose-600"
                      aria-label={`Remove ${product.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center gap-1 rounded-xl border border-line p-1">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-2"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-ink-soft transition hover:bg-surface-2"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-ink">
                      {formatPrice(product.price * qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-medium text-ink">
                  {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                </dd>
              </div>
              {shippingFee > 0 && (
                <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                  Add {formatPrice(50000 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-bold text-ink">{formatPrice(total)}</dd>
              </div>
            </dl>
            <button
              onClick={() => router.push("/checkout")}
              className="mt-5 w-full rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Proceed to checkout
            </button>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
