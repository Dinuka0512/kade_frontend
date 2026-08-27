"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Vendor } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400";

type FormState = {
  name: string;
  tagline: string;
  description: string;
  location: string;
};

export function VendorForm({ vendor }: { vendor?: Vendor }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: vendor?.name ?? "",
    tagline: vendor?.tagline ?? "",
    description: vendor?.description ?? "",
    location: vendor?.location ?? "",
  });

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Vendor name is required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const input = {
        name: form.name.trim(),
        tagline: form.tagline.trim() || undefined,
        description: form.description.trim() || undefined,
        location: form.location.trim() || undefined,
      };

      if (vendor) {
        await api.updateVendor(
          vendor.id,
          input,
          logoFile ?? undefined,
          coverFile ?? undefined
        );
        toast.success("Vendor updated");
      } else {
        await api.createVendor(
          input,
          logoFile ?? undefined,
          coverFile ?? undefined
        );
        toast.success("Vendor created");
      }
      router.push("/admin/vendors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vendor");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-bold text-ink">Vendor Details</h2>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Name <span className="text-rose-500">*</span>
            </span>
            <input
              required
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              placeholder="Acme Electronics"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Tagline
            </span>
            <input
              value={form.tagline}
              onChange={(e) => set("tagline")(e.target.value)}
              placeholder="Quality electronics since 2020"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Location
            </span>
            <input
              value={form.location}
              onChange={(e) => set("location")(e.target.value)}
              placeholder="Colombo, Sri Lanka"
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              Description
            </span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Tell customers about this vendor..."
              className={inputClass}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Logo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 file:mr-4 file:rounded-lg file:border-0 file:bg-black-950 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-black-950/90"
              />
              {(logoPreview || vendor?.logo) && (
                <img
                  src={logoPreview || vendor?.logo}
                  alt="Logo preview"
                  className="mt-2 h-16 w-16 rounded-lg object-cover"
                />
              )}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                Cover Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 file:mr-4 file:rounded-lg file:border-0 file:bg-black-950 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-black-950/90"
              />
              {(coverPreview || vendor?.cover) && (
                <img
                  src={coverPreview || vendor?.cover}
                  alt="Cover preview"
                  className="mt-2 h-20 w-full rounded-lg object-cover"
                />
              )}
            </label>
          </div>
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
            : vendor
              ? "Save changes"
              : "Create vendor"}
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
