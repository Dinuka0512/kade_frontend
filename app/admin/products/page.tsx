import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/delete-product-button";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const products = await api.getCatalog();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Products</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {products.length} listings across all vendors
      </p>

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
                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
