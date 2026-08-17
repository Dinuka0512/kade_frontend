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

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new Error("Unable to connect to the server. Please try again later.");
  }

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

export const api = {
  getCatalog: async (params: CatalogParams = {}): Promise<Product[]> => {
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
    return request<Product>(`/products/${idOrSlug}`);
  },

  getCategories: async (): Promise<Category[]> => {
    return request<Category[]>("/categories");
  },

  getVendors: async (): Promise<Vendor[]> => {
    return request<Vendor[]>("/vendors");
  },

  setVendorStatus: async (
    id: string,
    status: Vendor["status"]
  ): Promise<Vendor> => {
    return request<Vendor>(`/vendors/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  getVendor: async (idOrSlug: string): Promise<Vendor> => {
    return request<Vendor>(`/vendors/${idOrSlug}`);
  },

  login: async (email: string, password: string): Promise<AuthSession> => {
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
    return request<AuthSession>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  placeOrder: async (input: PlaceOrderInput): Promise<Order> => {
    return request<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  getOrders: async (): Promise<Order[]> => {
    return request<Order[]>("/orders");
  },

  getOrder: async (id: string): Promise<Order> => {
    return request<Order>(`/orders/${id}`);
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>("/dashboard/stats");
  },

  createProduct: async (input: ProductInput): Promise<Product> => {
    return request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  updateProduct: async (id: string, input: ProductInput): Promise<Product> => {
    return request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    return request<void>(`/products/${id}`, { method: "DELETE" });
  },

  updateOrderStatus: async (
    id: string,
    status: OrderStatus
  ): Promise<Order> => {
    return request<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
