import type { Metadata } from "next";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { EmptyState } from "@/components/empty-state";
import { ErrorBanner } from "@/components/error-banner";
import { ProductCard } from "@/components/product-card";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full Kade marketplace catalog.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;
  const first = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;
  const q = first(params.q);
  const category = first(params.category);
  const sort = first(params.sort);

  let products: Awaited<ReturnType<typeof api.getCatalog>> = [];
  let categories: Awaited<ReturnType<typeof api.getCategories>> = [];
  let serverError = false;

  try {
    [products, categories] = await Promise.all([
      api.getCatalog({
        q,
        category,
        sort: sort as "newest" | "price-asc" | "price-desc" | "rating",
      }),
      api.getCategories(),
    ]);
  } catch {
    serverError = true;
  }

  const activeCategory = categories.find((c) => c.id === category)?.name;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Shop</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {activeCategory ? activeCategory : "All products"}
          {q ? ` · results for "${q}"` : ""} · {products.length} item
          {products.length === 1 ? "" : "s"}
        </p>
      </div>

      {serverError ? (
        <ErrorBanner />
      ) : (
        <>
          <CatalogToolbar categories={categories} />

          {products.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No products found"
                description="Try a different search term or category."
              />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
