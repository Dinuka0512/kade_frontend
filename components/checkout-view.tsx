"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { useCartLines } from "@/lib/use-cart-lines";
import type { CartLine } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400";

function CheckoutForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const { lines, loading, subtotal, shippingFee, total } = useCartLines();
  const { clear } = useCart();

  const [form, setForm] = useState({
    name: initialName,
    email: initialEmail,
    line1: "",
    city: "",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await api.placeOrder({
        name: form.name,
        email: form.email,
        address: { line1: form.line1, city: form.city, zip: form.zip },
        items: lines.map((l) => ({ productId: l.product.id, qty: l.qty })),
      });
      clear();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold text-ink">Contact</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Full name
              </span>
              <input
                required
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Sanduni Perera"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Email
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold text-ink">Delivery address</h2>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Address line
              </span>
              <input
                required
                value={form.line1}
                onChange={(e) => set("line1")(e.target.value)}
                placeholder="24 Park Road"
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                  City
                </span>
                <input
                  required
                  value={form.city}
                  onChange={(e) => set("city")(e.target.value)}
                  placeholder="Colombo 05"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Postal code
                </span>
                <input
                  value={form.zip}
                  onChange={(e) => set("zip")(e.target.value)}
                  placeholder="00500"
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
            {error}
          </p>
        )}
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-bold text-ink">Your order</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {loading ? (
            <li className="h-14 animate-pulse rounded-xl bg-surface-2" />
          ) : (
            lines.map(({ product, qty }: CartLine) => (
              <li key={product.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="text-xs text-ink-soft">Qty {qty}</p>
                </div>
                <span className="text-sm font-semibold text-ink">
                  {formatPrice(product.price * qty)}
                </span>
              </li>
            ))
          )}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="font-medium">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="font-medium">
              {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-bold text-ink">{formatPrice(total)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={submitting || loading || lines.length === 0}
          className="mt-5 w-full rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-muted">
          Demo checkout — no payment is processed.
        </p>
      </aside>
    </form>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="h-64 rounded-2xl bg-surface-3" />
        <div className="h-64 rounded-2xl bg-surface-3" />
      </div>
    );
  }

  if (!user) {
    router.replace("/login?next=%2Fcheckout");
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Checkout</h1>
      <CheckoutForm initialName={user.name} initialEmail={user.email} />
    </div>
  );
}
