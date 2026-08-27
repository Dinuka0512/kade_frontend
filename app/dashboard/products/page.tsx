"use client";

import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/delete-product-button";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { api } from "@/lib/api";
import { useAuthedResource } from "@/lib/use-authed-resource";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product, Vendor } from "@/lib/types";

export default function DashboardProductsPage() {
  const { data, error, loading, reload } = useAuthedResource<
    [Vendor | null, Product[]]
  >(
    () =>
      Promise.all([
        api.getMyVendor().catch(() => null),
        api.getCatalog(),
      ]),
    [null, []]
  );

  const [vendor, products] = data;
  const myProducts = vendor
    ? products.filter((p) => p.vendorId === vendor.id)
    : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Products
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {loading
              ? "Loading your listings…"
              : `${myProducts.length} live listing${myProducts.length === 1 ? "" : "s"}${vendor ? ` on ${vendor.name}` : ""}`}
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
        >
          + New product
        </Link>
      </div>

      {error && <ErrorBanner />}

      {!loading && myProducts.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            title="No products yet"
            description="List your first product to start selling."
            action={
              <Link
                href="/dashboard/products/new"
                className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
              >
                Add a product
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="divide-y divide-line-soft">
            {myProducts.map((product) => {
              const off = discountPercent(product.price, product.compareAtPrice);
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="line-clamp-1 font-semibold text-ink hover:text-brand-600"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-ink-soft">
                      {product.categoryName} · Stock {product.stock}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-sm font-bold text-ink">
                      {formatPrice(product.price)}
                    </p>
                    {off !== null && (
                      <p className="text-xs font-semibold text-brand-600">
                        -{off}%
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/dashboard/products/${product.id}/edit`}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition hover:bg-surface-2"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} onChanged={reload} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
