import type { Metadata } from "next";
import { ProductForm } from "@/components/product-form";

export const metadata: Metadata = {
  title: "New product",
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        New product
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Fill in the details below to list a new product.
      </p>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}
