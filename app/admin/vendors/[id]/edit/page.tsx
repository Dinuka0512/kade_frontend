import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorForm } from "@/components/vendor-form";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/admin/vendors/[id]/edit">): Promise<Metadata> {
  try {
    const vendor = await api.getVendor((await params).id);
    return { title: `Edit ${vendor.name}` };
  } catch {
    return { title: "Edit vendor" };
  }
}

export default async function EditVendorPage({
  params,
}: PageProps<"/admin/vendors/[id]/edit">) {
  const { id } = await params;
  const vendor = await api.getVendor(id).catch(() => null);
  if (!vendor) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Edit vendor
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{vendor.name}</p>
      <div className="mt-6">
        <VendorForm vendor={vendor} />
      </div>
    </div>
  );
}
