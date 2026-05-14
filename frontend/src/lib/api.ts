export type Role = "customer" | "admin";
export type ServiceCategory = "delivery" | "borehole" | "plumbing" | "purification";
export type OrderStatus = "pending" | "paid" | "in_progress" | "completed";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  imageUrl: string;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: "mpesa" | "paypal";
  transactionId: string;
  amount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  serviceId: string;
  amount: number;
  status: OrderStatus;
  location: string;
  scheduledDate: string;
  createdAt: string;
  service: Service | null;
  user: User | null;
  payment: Payment | null;
};

export type Analytics = {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  revenue: number;
  totalPayments: number;
  services: number;
};

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");
const TOKEN_KEY = "water_services_token";

export const authStore = {
  get token() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set token(value: string | null) {
    if (value) localStorage.setItem(TOKEN_KEY, value);
    else localStorage.removeItem(TOKEN_KEY);
  }
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (authStore.token) headers.set("Authorization", `Bearer ${authStore.token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload as T;
}

export const api = {
  register: (input: { name: string; email: string; phone: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(input) }),
  me: () => request<{ user: User }>("/auth/me"),
  services: () => request<{ services: Service[] }>("/services"),
  service: (id: string) => request<{ service: Service }>(`/services/${id}`),
  payMpesa: (input: { phone: string; amount: number; orderReference: string }) =>
    request<{ paymentSessionId: string; status: string; message?: string }>("/payments/mpesa/stkpush", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  createPayPalOrder: (input: { amount: number; orderReference: string }) =>
    request<{ paypalOrderId?: string; id?: string; status: string }>("/payments/paypal/create-order", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  capturePayPal: (input: { paypalOrderId: string; amount: number; orderReference: string }) =>
    request<{ paymentSessionId: string; status: string }>("/payments/paypal/capture", {
      method: "POST",
      body: JSON.stringify(input)
    }),
  createOrder: (input: { serviceId: string; amount: number; location: string; scheduledDate: string; paymentSessionId: string }) =>
    request<{ order: Order }>("/orders", { method: "POST", body: JSON.stringify(input) }),
  myOrders: () => request<{ orders: Order[] }>("/orders/mine"),
  adminAnalytics: () => request<{ analytics: Analytics }>("/admin/analytics"),
  adminOrders: () => request<{ orders: Order[] }>("/admin/orders"),
  adminPayments: () => request<{ payments: Payment[] }>("/admin/payments"),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<{ order: Order }>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) })
};
