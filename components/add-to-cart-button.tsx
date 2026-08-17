"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";

export function AddToCartButton({
  productId,
  disabled,
  className = "",
}: {
  productId: string;
  disabled?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    add(productId, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {added ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          Added to cart
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
            <circle cx="9" cy="21" r="1.4" />
            <circle cx="19" cy="21" r="1.4" />
            <path d="M2 3h3l2.5 12.5a2 2 0 0 0 2 1.5h8.7a2 2 0 0 0 2-1.6L22 7H6" />
          </svg>
          Add to cart
        </>
      )}
    </button>
  );
}
