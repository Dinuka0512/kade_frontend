"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </CartProvider>
    </AuthProvider>
  );
}
