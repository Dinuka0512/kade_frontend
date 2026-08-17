import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { ProductCard } from "@/components/product-card";
import { VendorCard } from "@/components/vendor-card";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search products and vendors on Kade.",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const raw = typeof params.q === "string" ? params.q.trim() : "";
  const q = raw.toLowerCase();

  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Search
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Find products and vendors across Kade.
        </p>
        <div className="mt-8">
          <EmptyState
            title="Type something to search"
            description="Search by product name or vendor name to get started."
          />
        </div>
      </div>
    );
  }

  let products: Awaited<ReturnType<typeof api.getCatalog>> = [];
  let vendors: Awaited<ReturnType<typeof api.getVendors>> = [];
  let serverError = false;

  try {
    [products, vendors] = await Promise.all([
      api.getCatalog({ q }),
      api.getVendors(),
    ]);
  } catch {
    serverError = true;
  }

  const vendorMatches = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.tagline.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
  );

  const total = products.length + vendorMatches.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Search
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {total} result{total === 1 ? "" : "s"} for &ldquo;{raw}&rdquo;
      </p>

      {serverError && <ErrorBanner />}

      {total === 0 && !serverError ? (
        <div className="mt-8">
          <EmptyState
            title="No results"
            description={`Nothing matched "${raw}". Try a different search term.`}
          />
        </div>
      ) : (
        <>
          {vendorMatches.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight text-ink">
                Vendors
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vendorMatches.map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold tracking-tight text-ink">
                Products
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
