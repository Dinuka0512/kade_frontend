"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import type { Vendor } from "@/lib/types";

export function VendorStatusToggle({ vendor }: { vendor: Vendor }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    const next = vendor.status === "active" ? "suspended" : "active";
    setBusy(true);
    try {
      await api.setVendorStatus(vendor.id, next);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
        vendor.status === "active"
          ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {busy ? "…" : vendor.status === "active" ? "Suspend" : "Activate"}
    </button>
  );
}
