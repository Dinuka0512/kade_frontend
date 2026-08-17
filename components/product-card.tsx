import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition duration-200 hover:border-line-strong hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {off !== null && (
          <span className="absolute left-3 top-3 rounded bg-brand-600 px-2 py-0.5 text-xs font-semibold text-white">
            -{off}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute inset-x-3 bottom-3 rounded bg-black-950/70 px-2 py-1 text-center text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">
          {product.categoryName}
        </p>
        <h3 className="mt-0.5 truncate text-sm font-medium text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {product.shortDescription}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-semibold text-brand-600">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-xs text-ink-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] text-ink-muted">
          {product.soldCount.toLocaleString()} sold
        </p>
      </div>
    </Link>
  );
}
