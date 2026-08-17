"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CatalogToolbar({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const push = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
        }}
        className="flex w-full max-w-md items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 focus-within:border-brand-400"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-ink-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, brands…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted"
        />
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => push({ category: e.target.value })}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-400"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => push({ sort: e.target.value })}
          className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-400"
        >
          <option value="">Sort: Featured</option>
          <option value="newest">Sort: Newest</option>
          <option value="price-asc">Price: Low to high</option>
          <option value="price-desc">Price: High to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
    </div>
  );
}
