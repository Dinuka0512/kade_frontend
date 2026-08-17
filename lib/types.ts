export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
};

export type Vendor = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  cover: string;
  location: string;
  rating: number;
  reviewCount: number;
  joinedAt: string;
  productCount: number;
  status: "active" | "suspended";
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  categoryName: string;
  vendorId: string;
  vendorName: string;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
};

export type ProductInput = {
  name: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  longDescription: string;
  categoryId: string;
  stock: number;
  images: string[];
  tags: string[];
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type CartLine = {
  product: Product;
  qty: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  address: {
    line1: string;
    city: string;
    zip: string;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
};

export type AuthSession = {
  user: User;
  token: string;
};

export type DashboardStats = {
  revenue: number;
  orders: number;
  pendingOrders: number;
  products: number;
  customers: number;
  avgOrderValue: number;
};

export type CatalogParams = {
  q?: string;
  category?: string;
  vendorId?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  featured?: boolean;
};

export type PlaceOrderInput = {
  name: string;
  email: string;
  address: {
    line1: string;
    city: string;
    zip: string;
  };
  items: CartItem[];
};
