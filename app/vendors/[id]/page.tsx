import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { RatingStars } from "@/components/rating-stars";
import { api } from "@/lib/api";
import { formatCompact, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/vendors/[id]">): Promise<Metadata> {
  try {
    const vendor = await api.getVendor((await params).id);
    return { title: vendor.name };
  } catch {
    return { title: "Vendor not found" };
  }
}

export default async function VendorProfilePage({
  params,
}: PageProps<"/vendors/[id]">) {
  const { id } = await params;
  const vendor = await api.getVendor(id).catch(() => null);
  if (!vendor) notFound();

  const products = await api.getCatalog({ vendorId: vendor.id });

  return (
    <div>
      <div className="relative h-56 w-full bg-surface-3 sm:h-64">
        <Image
          src={vendor.cover}
          alt={`${vendor.name} cover`}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-surface shadow-md">
              <Image
                src={vendor.logo}
                alt={vendor.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="pb-1">
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                {vendor.name}
              </h1>
              <p className="text-sm text-ink-soft">{vendor.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pb-1 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-medium text-ink ring-1 ring-line">
              {vendor.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-medium text-ink ring-1 ring-line">
              Since {formatDate(vendor.joinedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 font-medium text-ink ring-1 ring-line">
              <RatingStars rating={vendor.rating} />
              {vendor.rating.toFixed(1)} ({formatCompact(vendor.reviewCount)})
            </span>
          </div>
        </div>

        <p className="mt-6 max-w-3xl leading-relaxed text-ink-soft">
          {vendor.description}
        </p>

        <section className="mt-10 pb-16">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold text-ink">
              Products by {vendor.name}
            </h2>
            <span className="text-sm text-ink-soft">
              {products.length} item{products.length === 1 ? "" : "s"}
            </span>
          </div>

          {products.length === 0 ? (
            <EmptyState
              title="No products yet"
              description="This vendor hasn't listed any products yet. Check back soon."
              action={
                <Link
                  href="/products"
                  className="rounded-xl bg-black-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black-950/90"
                >
                  Browse the shop
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
