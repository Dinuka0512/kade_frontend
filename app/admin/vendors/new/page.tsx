import type { Metadata } from "next";
import { VendorForm } from "@/components/vendor-form";

export const metadata: Metadata = {
  title: "New vendor",
};

export default function NewVendorPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        New vendor
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Fill in the details below to add a new vendor.
      </p>
      <div className="mt-6">
        <VendorForm />
      </div>
    </div>
  );
}
