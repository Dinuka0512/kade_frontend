import Image from "next/image";
import Link from "next/link";
import type { Vendor } from "@/lib/types";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/vendors/${vendor.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition duration-200 hover:border-line-strong hover:shadow-md"
    >
      <div className="relative h-32 bg-surface-2">
        <Image
          src={vendor.cover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
      </div>
      <div className="relative flex flex-1 flex-col p-5">
        <div className="-mt-12 flex items-end justify-between">
          <div className="relative h-16 w-16 overflow-hidden rounded-md border-4 border-white bg-surface shadow-sm">
            <Image
              src={vendor.logo}
              alt={vendor.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <span className="rounded bg-surface-2 px-2 py-0.5 text-xs font-semibold text-ink">
            {vendor.rating.toFixed(1)}
          </span>
        </div>
        <h2 className="mt-3 font-bold text-ink">{vendor.name}</h2>
        <p className="text-sm text-ink-soft">{vendor.tagline}</p>
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
          {vendor.description}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-line-soft pt-4 text-xs text-ink-soft">
          <span>{vendor.location}</span>
          <span className="font-medium text-ink">
            {vendor.productCount} products
          </span>
        </div>
      </div>
    </Link>
  );
}
