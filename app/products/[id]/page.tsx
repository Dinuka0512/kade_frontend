import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { QtyInput } from "@/components/qty-input";
import { RatingStars } from "@/components/rating-stars";
import { api } from "@/lib/api";
import { discountPercent, formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  try {
    const product = await api.getProduct((await params).id);
    return { title: product.name };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await api.getProduct(id).catch(() => null);
  if (!product) notFound();

  const related = (await api.getCatalog({ category: product.categoryId }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-ink">
          Shop
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${product.categoryId}`}
          className="hover:text-ink"
        >
          {product.categoryName}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {product.categoryName}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={product.rating} size="lg" />
            <span className="text-sm font-medium text-ink">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-sm text-ink-muted">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-ink-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            {off !== null && (
              <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
                Save {off}%
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">
            {product.shortDescription}
          </p>

          <div className="mt-6">
            <p
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {product.stock > 0
                ? `In stock · ${product.stock} available`
                : "Currently out of stock"}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <QtyInput productId={product.id} />
            <AddToCartButton
              productId={product.id}
              disabled={product.stock === 0}
              className="bg-black-950 text-white hover:bg-black-950/90"
            />
          </div>

          <Link
            href={`/vendors/${product.vendorId}`}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-brand-300"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-lg font-bold text-brand-700">
              {product.vendorName.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-ink-muted">Sold by</p>
              <p className="truncate font-semibold text-ink">
                {product.vendorName}
              </p>
              <p className="text-xs text-ink-soft">
                Visit storefront →
              </p>
            </div>
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-ink-soft"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-lg font-semibold text-ink">About this product</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
          {product.longDescription}
        </p>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 text-lg font-semibold text-ink">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
