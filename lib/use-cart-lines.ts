"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { useCart } from "./cart";
import type { CartLine, Product } from "./types";

export function useCartLines() {
  const { items } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getCatalog()
      .then((list) => {
        if (mounted) setProducts(list);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const lines: CartLine[] = useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return items
      .map((item) => {
        const product = map.get(item.productId);
        if (!product) return null;
        return { product, qty: item.qty };
      })
      .filter((l): l is CartLine => l !== null);
  }, [items, products]);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
    [lines]
  );

  const shippingFee = useMemo(() => {
    if (lines.length === 0 || subtotal >= 50000) return 0;
    return 600;
  }, [lines.length, subtotal]);

  return { lines, loading, subtotal, shippingFee, total: subtotal + shippingFee };
}
