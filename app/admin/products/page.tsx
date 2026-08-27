"use client";

import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/delete-product-button";
import { ErrorBanner } from "@/components/error-banner";
import { api } from "@/lib/api";
import { useAuthedResource } from "@/lib/use-authed-resource";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { data: products, error, loading, reload } = useAuthedResource<Product[]>(
    () => api.getCatalog(),
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {loading
              ? "Loading listings…"
              : `${products.length} listings across all vendors`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
        >
          + New product
        </Link>
      </div>

      {error && <ErrorBanner />}

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="divide-y divide-line-soft">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 p-4">
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
                  href={`/products/${product.id}`}
                  className="line-clamp-1 font-semibold text-ink hover:text-brand-600"
                >
                  {product.name}
                </Link>
                <p className="truncate text-xs text-ink-soft">
                  {product.vendorName} · {product.categoryName} · Stock {product.stock}
                </p>
              </div>
              <span className="hidden shrink-0 text-sm font-bold text-ink sm:block">
                {formatPrice(product.price)}
              </span>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-surface-2"
                >
                  Edit
                </Link>
                <DeleteProductButton productId={product.id} onChanged={reload} />
              </div>
            </div>
          ))}
          {products.length === 0 && !loading && !error && (
            <p className="py-8 text-center text-sm text-ink-muted">No products yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
