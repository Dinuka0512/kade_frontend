import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/products/[id]/edit">): Promise<Metadata> {
  try {
    const product = await api.getProduct((await params).id);
    return { title: `Edit ${product.name}` };
  } catch {
    return { title: "Edit product" };
  }
}

export default async function EditProductPage({
  params,
}: PageProps<"/dashboard/products/[id]/edit">) {
  const { id } = await params;
  const product = await api.getProduct(id).catch(() => null);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        Edit product
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{product.name}</p>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
