import Link from "next/link";
import { Hero } from "@/components/hero";
import { ErrorBanner } from "@/components/error-banner";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof api.getCatalog>> = [];
  let rest: Awaited<ReturnType<typeof api.getCatalog>> = [];
  let vendors: Awaited<ReturnType<typeof api.getVendors>> = [];
  let serverError = false;

  try {
    [featured, rest, vendors] = await Promise.all([
      api.getCatalog({ featured: true }),
      api.getCatalog({ sort: "newest" }),
      api.getVendors(),
    ]);
  } catch {
    serverError = true;
  }

  const newArrivals = rest.filter((p) => !p.isFeatured).slice(0, 8);

  return (
    <>
      <Hero />

      {serverError && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
          <ErrorBanner />
        </div>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                Featured products
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Handpicked by our team this week
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-ink">
                New arrivals
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Fresh drops from island vendors
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Browse all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-lg bg-black-950 px-6 py-12 sm:px-12">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Sell on Kade
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {vendors.length > 0
                  ? `${vendors.length} trusted vendors already call Kade home.`
                  : "Join the island's local marketplace."}{" "}
                Set up your storefront, manage products and track orders — all
                from one dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Become a vendor
              </Link>
              <Link
                href="/vendors"
                className="rounded-md px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10"
              >
                Explore vendors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
