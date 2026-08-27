"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function DeleteVendorButton({
  vendorId,
  onChanged,
}: {
  vendorId: string;
  onChanged?: () => void;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteVendor(vendorId);
      toast.success("Vendor deleted");
      setConfirming(false);
      router.refresh();
      onChanged?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete vendor");
    } finally {
      setDeleting(false);
    }
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {deleting ? "…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:bg-surface-2"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
    >
      Delete
    </button>
  );
}
