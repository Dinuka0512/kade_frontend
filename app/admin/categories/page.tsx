import type { Metadata } from "next";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const [categories, products] = await Promise.all([
    api.getCategories(),
    api.getCatalog(),
  ]);

  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  const values = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoryId] = (acc[p.categoryId] ?? 0) + p.price;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Categories
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {categories.length} categories powering the catalog
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Products</th>
                <th className="px-5 py-3 text-right font-semibold">
                  Catalog value
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-line-soft last:border-0"
                >
                  <td className="px-5 py-4">
                    <span className="font-semibold text-ink">
                      {category.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {category.slug}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {counts[category.id] ?? 0}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-ink">
                    {new Intl.NumberFormat("en-LK", {
                      style: "currency",
                      currency: "LKR",
                      maximumFractionDigits: 0,
                    }).format(values[category.id] ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
