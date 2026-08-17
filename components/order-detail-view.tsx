"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const steps: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

export function OrderDetailView() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let mounted = true;
    api
      .getOrder(params.id)
      .then((o) => {
        if (mounted) {
          setOrder(o);
          setState("ready");
        }
      })
      .catch(() => {
        if (mounted) setState("missing");
      });
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-3" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-surface-3" />
      </div>
    );
  }

  if (state === "missing" || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <EmptyState
          title="Order not found"
          description="We couldn't find that order. It may have been placed in a previous session."
          action={
            <Link
              href="/orders"
              className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
            >
              Back to my orders
            </Link>
          }
        />
      </div>
    );
  }

  const activeStep = steps.indexOf(order.status);
  const cancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/orders"
        className="text-sm font-medium text-ink-soft transition hover:text-ink"
      >
        ← Back to orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Order {order.number}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Placed {formatDateTime(order.placedAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {!cancelled && (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
          <ol className="flex items-center">
            {steps.map((step, i) => {
              const done = i <= activeStep;
              return (
                <li
                  key={step}
                  className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-brand-500 text-white"
                          : "bg-surface-2 text-ink-muted"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <span
                      className={`mt-1.5 text-xs capitalize ${
                        done ? "font-semibold text-ink" : "text-ink-muted"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`mx-2 mb-6 h-0.5 flex-1 rounded ${
                        i < activeStep ? "bg-brand-500" : "bg-surface-3"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="font-bold text-ink">Items</h2>
          <ul className="mt-4 flex flex-col gap-4">
            {order.items.map((item) => (
              <li
                key={item.productId + item.name}
                className="flex items-center gap-4"
              >
                <Link
                  href={`/products/${item.productId}`}
                  className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {item.name}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {formatPrice(item.price)} × {item.qty}
                  </p>
                </div>
                <span className="font-semibold text-ink">
                  {formatPrice(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-bold text-ink">Totals</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-medium">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="font-medium">
                  {order.shippingFee === 0
                    ? "Free"
                    : formatPrice(order.shippingFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-bold text-ink">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-bold text-ink">Delivery</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {order.customerName}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}
              {order.address.zip ? `, ${order.address.zip}` : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
