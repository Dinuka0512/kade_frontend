import type { Metadata } from "next";
import Link from "next/link";
import { VendorStatusToggle } from "@/components/vendor-status-toggle";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendors",
};

export default async function AdminVendorsPage() {
  const vendors = await api.getVendors();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">Vendors</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {vendors.length} registered · {vendors.filter((v) => v.status === "active").length} active
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-5 py-3 font-semibold">Vendor</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Products</th>
                <th className="px-5 py-3 font-semibold">Rating</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-line-soft last:border-0">
                  <td className="px-5 py-4">
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="font-semibold text-ink hover:text-brand-600"
                    >
                      {vendor.name}
                    </Link>
                    <p className="text-xs text-ink-soft">Joined {vendor.joinedAt}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{vendor.location}</td>
                  <td className="px-5 py-4 text-ink-soft">{vendor.productCount}</td>
                  <td className="px-5 py-4 text-ink-soft">
                    {vendor.rating.toFixed(1)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${
                        vendor.status === "active"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-rose-50 text-rose-700 ring-rose-200"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <VendorStatusToggle vendor={vendor} />
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
