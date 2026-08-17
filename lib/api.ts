import {
  mockCategories,
  mockOrders,
  mockProducts,
  mockStats,
  mockVendors,
} from "./mock";
import type {
  AuthSession,
  CatalogParams,
  Category,
  DashboardStats,
  Order,
  OrderStatus,
  PlaceOrderInput,
  Product,
  ProductInput,
  User,
  Vendor,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export function isMockMode() {
  return USE_MOCK;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("kade.token");
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = (body as { message?: string }).message ?? message;
    } catch {
      /* ignore non-json bodies */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function sortProducts(
  products: Product[],
  sort: CatalogParams["sort"]
): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "newest":
    default:
      return list;
  }
}

export const api = {
  getCatalog: async (params: CatalogParams = {}): Promise<Product[]> => {
    if (USE_MOCK) {
      await delay();
      let list = mockProducts;
      if (params.featured) list = list.filter((p) => p.isFeatured);
      if (params.category) list = list.filter((p) => p.categoryId === params.category);
      if (params.vendorId) list = list.filter((p) => p.vendorId === params.vendorId);
      if (params.q) {
        const q = params.q.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.vendorName.toLowerCase().includes(q)
        );
      }
      return sortProducts(list, params.sort);
    }
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (params.category) search.set("categoryId", params.category);
    if (params.vendorId) search.set("vendorId", params.vendorId);
    if (params.sort) search.set("sort", params.sort);
    if (params.featured) search.set("featured", "true");
    const qs = search.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  },

  getProduct: async (idOrSlug: string): Promise<Product> => {
    if (USE_MOCK) {
      await delay(120);
      const p = mockProducts.find(
        (p) => p.id === idOrSlug || p.slug === idOrSlug
      );
      if (!p) throw new Error("Product not found");
      return p;
    }
    return request<Product>(`/products/${idOrSlug}`);
  },

  getCategories: async (): Promise<Category[]> => {
    if (USE_MOCK) {
      await delay(80);
      return mockCategories;
    }
    return request<Category[]>("/categories");
  },

  getVendors: async (): Promise<Vendor[]> => {
    if (USE_MOCK) {
      await delay();
      return mockVendors;
    }
    return request<Vendor[]>("/vendors");
  },

  setVendorStatus: async (
    id: string,
    status: Vendor["status"]
  ): Promise<Vendor> => {
    if (USE_MOCK) {
      await delay(300);
      const vendor = mockVendors.find((v) => v.id === id);
      if (!vendor) throw new Error("Vendor not found");
      vendor.status = status;
      return vendor;
    }
    return request<Vendor>(`/vendors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  getVendor: async (idOrSlug: string): Promise<Vendor> => {
    if (USE_MOCK) {
      await delay(120);
      const v = mockVendors.find(
        (v) => v.id === idOrSlug || v.slug === idOrSlug
      );
      if (!v) throw new Error("Vendor not found");
      return v;
    }
    return request<Vendor>(`/vendors/${idOrSlug}`);
  },

  login: async (email: string, password: string): Promise<AuthSession> => {
    if (USE_MOCK) {
      await delay(500);
      if (!email || !password) throw new Error("Email and password are required");
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      const lower = email.toLowerCase();
      const role = lower.includes("admin")
        ? "admin"
        : lower.includes("vendor")
          ? "vendor"
          : "customer";
      return {
        token: `mock-token-${Date.now()}`,
        user: {
          id: "customer-demo",
          name: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          role,
        },
      };
    }
    return request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: User["role"]
  ): Promise<AuthSession> => {
    if (USE_MOCK) {
      await delay(500);
      if (!name.trim() || !email.trim() || !password)
        throw new Error("All fields are required");
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      return {
        token: `mock-token-${Date.now()}`,
        user: { id: "customer-demo", name: name.trim(), email, role },
      };
    }
    return request<AuthSession>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  placeOrder: async (input: PlaceOrderInput): Promise<Order> => {
    if (USE_MOCK) {
      await delay(600);
      const lines = input.items
        .map((i) => {
          const product = mockProducts.find((p) => p.id === i.productId);
          if (!product) return null;
          return {
            productId: product.id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            qty: i.qty,
          };
        })
        .filter(Boolean);
      const subtotal = lines.reduce((sum, l) => sum + (l ? l.price * l.qty : 0), 0);
      const shippingFee = subtotal >= 50000 || subtotal === 0 ? 0 : 600;
      const order: Order = {
        id: `o-${Date.now()}`,
        number: `KD-${Math.floor(10000 + Math.random() * 89999)}`,
        customerId: "customer-demo",
        customerName: input.name,
        email: input.email,
        items: lines as Order["items"],
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        status: "pending",
        placedAt: new Date().toISOString(),
        address: input.address,
      };
      mockOrders.unshift(order);
      return order;
    }
    return request<Order>("/orders", { method: "POST", body: JSON.stringify(input) });
  },

  getOrders: async (): Promise<Order[]> => {
    if (USE_MOCK) {
      await delay();
      return mockOrders;
    }
    return request<Order[]>("/orders");
  },

  getOrder: async (id: string): Promise<Order> => {
    if (USE_MOCK) {
      await delay(120);
      const o = mockOrders.find((o) => o.id === id);
      if (!o) throw new Error("Order not found");
      return o;
    }
    return request<Order>(`/orders/${id}`);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK) {
      await delay();
      return mockStats;
    }
    return request<DashboardStats>("/dashboard/stats");
  },

  createProduct: async (input: ProductInput): Promise<Product> => {
    if (USE_MOCK) {
      await delay(400);
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const product: Product = {
        id: `p-${Date.now()}`,
        slug,
        name: input.name,
        shortDescription: input.shortDescription,
        longDescription: input.longDescription,
        price: input.price,
        compareAtPrice: input.compareAtPrice,
        images: input.images.length ? input.images : [`https://picsum.photos/seed/${slug}/800/800`],
        categoryId: input.categoryId,
        categoryName: mockCategories.find((c) => c.id === input.categoryId)?.name ?? "General",
        vendorId: "vendor-1",
        vendorName: "Colombo Digital Hub",
        stock: input.stock,
        soldCount: 0,
        rating: 0,
        reviewCount: 0,
        isFeatured: false,
        tags: input.tags,
      };
      mockProducts.unshift(product);
      return product;
    }
    return request<Product>("/products", { method: "POST", body: JSON.stringify(input) });
  },

  updateProduct: async (id: string, input: ProductInput): Promise<Product> => {
    if (USE_MOCK) {
      await delay(400);
      const product = mockProducts.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      Object.assign(product, input, {
        categoryName: mockCategories.find((c) => c.id === input.categoryId)?.name ?? "General",
      });
      return product;
    }
    return request<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(input) });
  },

  deleteProduct: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(300);
      const idx = mockProducts.findIndex((p) => p.id === id);
      if (idx >= 0) mockProducts.splice(idx, 1);
      return;
    }
    return request<void>(`/products/${id}`, { method: "DELETE" });
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    if (USE_MOCK) {
      await delay(300);
      const order = mockOrders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found");
      order.status = status;
      return order;
    }
    return request<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
