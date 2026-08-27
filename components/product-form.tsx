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
};

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    price: product ? String(product.price) : "",
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : "",
    stock: product ? String(product.stock) : "10",
    shortDescription: product?.shortDescription ?? "",
    longDescription: product?.longDescription ?? "",
    tags: product?.tags.join(", ") ?? "",
  });

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

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
    };

    setSubmitting(true);
    setError(null);
    try {
      if (product) {
        await api.updateProduct(product.id, input, imageFiles.length > 0 ? imageFiles : undefined);
        toast.success("Product updated");
      } else {
        await api.createProduct(input, imageFiles.length > 0 ? imageFiles : undefined);
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
              Product Images
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 file:mr-4 file:rounded-lg file:border-0 file:bg-black-950 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-black-950/90"
            />
            {product?.images && product.images.length > 0 && imageFiles.length === 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.images.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`Existing ${i + 1}`}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black-950 text-xs text-white">
                      Existing
                    </span>
                  </div>
                ))}
              </div>
            )}
            {imagePreviews.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${i + 1}`}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white hover:bg-rose-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <span className="mt-1.5 block text-xs text-ink-muted">
              Upload product images (JPG, PNG, WebP). Max 10MB per file.
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
