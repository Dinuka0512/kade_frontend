import type { Metadata } from "next";
import { OrderDetailView } from "@/components/order-detail-view";

export const metadata: Metadata = {
  title: "Order details",
};

export default function OrderDetailPage() {
  return <OrderDetailView />;
}
