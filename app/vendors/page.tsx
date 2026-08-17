import type { Metadata } from "next";
import Link from "next/link";
import { ErrorBanner } from "@/components/error-banner";
import { VendorCard } from "@/components/vendor-card";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendors",
  description: "Meet the vendors of the Kade marketplace.",
};

export default async function VendorsPage() {
  let vendors: Awaited<ReturnType<typeof api.getVendors>> = [];
  let serverError = false;

  try {
    vendors = await api.getVendors();
  } catch {
    serverError = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Our vendors
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {vendors.length} local businesses selling on Kade
        </p>
      </div>

      {serverError && <ErrorBanner />}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))}
      </div>

      <div className="mt-10 rounded-lg bg-surface-2 px-6 py-8 text-center">
        <h2 className="text-lg font-bold text-ink">
          Want to sell on Kade?
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
          Create a vendor account and get your storefront, product management
          and order tracking running in minutes.
        </p>
        <Link
          href="/register"
          className="mt-4 inline-block rounded-md bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Become a vendor
        </Link>
      </div>
    </div>
  );
}
