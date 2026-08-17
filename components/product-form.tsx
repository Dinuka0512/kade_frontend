"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400";

type FormState = {
  name: string;
  categoryId: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  shortDescription: string;
  longDescription: string;
  tags: string;
  images: string;
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    price: product ? String(product.price) : "",
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : "",
    stock: product ? String(product.stock) : "10",
    shortDescription: product?.shortDescription ?? "",
    longDescription: product?.longDescription ?? "",
    tags: product?.tags.join(", ") ?? "",
    images: product?.images.join(", ") ?? "",
  });

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !form.categoryId || !(price > 0)) {
      setError("Please fill in the required fields with valid values.");
      return;
    }

    const input = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      price,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
      shortDescription: form.shortDescription.trim(),
      longDescription: form.longDescription.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean),
    };

    setSubmitting(true);
    setError(null);
    try {
      if (product) {
        await api.updateProduct(product.id, input);
        toast.success("Product updated");
      } else {
        await api.createProduct(input);
        toast.success("Product created");
      }
      router.push("/dashboard/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-bold text-ink">Details</h2>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Name <span className="text-rose-500">*</span>
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Aurora Wireless Headphones"
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Category <span className="text-rose-500">*</span>
              </span>
              <select
                required
                value={form.categoryId}
                onChange={(e) => set("categoryId")(e.target.value)}
                className={inputClass}
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Price (LKR) <span className="text-rose-500">*</span>
              </span>
              <input
                required
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => set("price")(e.target.value)}
                placeholder="85000"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Compare-at price
              </span>
              <input
                type="number"
                min="0"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice")(e.target.value)}
                placeholder="99000"
                className={inputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Stock
              </span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock")(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Tags (comma separated)
              </span>
              <input
                value={form.tags}
                onChange={(e) => set("tags")(e.target.value)}
                placeholder="audio, wireless, noise-cancelling"
                className={inputClass}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Short description
            </span>
            <textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription")(e.target.value)}
              placeholder="One or two sentences shown in listings."
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Full description
            </span>
            <textarea
              rows={5}
              value={form.longDescription}
              onChange={(e) => set("longDescription")(e.target.value)}
              placeholder="The full product story shown on the product page."
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Image URLs (comma separated)
            </span>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => set("images")(e.target.value)}
              placeholder="https://…/1.jpg, https://…/2.jpg"
              className={inputClass}
            />
            <span className="mt-1.5 block text-xs text-ink-muted">
              Use picsum.photos/seed/your-slug/800/800 for placeholder images.
            </span>
          </label>
        </div>
      </section>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-black-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black-950/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Saving…"
            : product
              ? "Save changes"
              : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink-soft transition hover:bg-surface-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
