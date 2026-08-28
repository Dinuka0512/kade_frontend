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
  VendorInput,
} from "./types";

const API_BASE =
  typeof window === "undefined"
    ? process.env.API_BASE_URL || "http://8.234.94.139:8000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

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

  updateVendorImages: async (
    id: string,
    logo?: File,
    cover?: File
  ): Promise<Vendor> => {
    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    if (cover) formData.append("cover", cover);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/vendors/${id}/images`, {
        method: "PATCH",
        headers,
        body: formData,
      });
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

    return (await res.json()) as Vendor;
  },

  getVendor: async (idOrSlug: string): Promise<Vendor> => {
    return request<Vendor>(`/vendors/${idOrSlug}`);
  },

  getMyVendor: async (): Promise<Vendor> => {
    return request<Vendor>("/vendors/me");
  },

  createVendor: async (input: VendorInput, logo?: File, cover?: File): Promise<Vendor> => {
    const formData = new FormData();
    formData.append("name", input.name);
    if (input.tagline) formData.append("tagline", input.tagline);
    if (input.description) formData.append("description", input.description);
    if (input.location) formData.append("location", input.location);
    if (logo) formData.append("logo", logo);
    if (cover) formData.append("cover", cover);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/vendors`, {
        method: "POST",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Unable to connect to the server. Please try again later.");
    }

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        message = (body as { message?: string }).message ?? message;
      } catch {}
      throw new Error(message);
    }

    return (await res.json()) as Vendor;
  },

  updateVendor: async (id: string, input: VendorInput, logo?: File, cover?: File): Promise<Vendor> => {
    const formData = new FormData();
    formData.append("name", input.name);
    if (input.tagline) formData.append("tagline", input.tagline);
    if (input.description) formData.append("description", input.description);
    if (input.location) formData.append("location", input.location);
    if (logo) formData.append("logo", logo);
    if (cover) formData.append("cover", cover);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/vendors/${id}`, {
        method: "PUT",
        headers,
        body: formData,
      });
    } catch {
      throw new Error("Unable to connect to the server. Please try again later.");
    }

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        message = (body as { message?: string }).message ?? message;
      } catch {}
      throw new Error(message);
    }

    return (await res.json()) as Vendor;
  },

  deleteVendor: async (id: string): Promise<void> => {
    return request<void>(`/vendors/${id}`, { method: "DELETE" });
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

  createProduct: async (input: ProductInput, images?: File[]): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("price", String(input.price));
    if (input.compareAtPrice !== undefined) {
      formData.append("compareAtPrice", String(input.compareAtPrice));
    }
    formData.append("shortDescription", input.shortDescription);
    if (input.longDescription) {
      formData.append("longDescription", input.longDescription);
    }
    formData.append("categoryId", String(input.categoryId));
    formData.append("stock", String(input.stock ?? 0));
    if (input.tags && input.tags.length > 0) {
      formData.append("tags", input.tags.join(","));
    }
    if (images && images.length > 0) {
      images.forEach((file) => formData.append("images", file));
    }

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers,
        body: formData,
      });
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

    return (await res.json()) as Product;
  },

  updateProduct: async (id: string, input: ProductInput, images?: File[]): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("price", String(input.price));
    if (input.compareAtPrice !== undefined) {
      formData.append("compareAtPrice", String(input.compareAtPrice));
    }
    formData.append("shortDescription", input.shortDescription);
    if (input.longDescription) {
      formData.append("longDescription", input.longDescription);
    }
    formData.append("categoryId", String(input.categoryId));
    formData.append("stock", String(input.stock ?? 0));
    if (input.tags && input.tags.length > 0) {
      formData.append("tags", input.tags.join(","));
    }
    if (images && images.length > 0) {
      images.forEach((file) => formData.append("images", file));
    }

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers,
        body: formData,
      });
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

    return (await res.json()) as Product;
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
