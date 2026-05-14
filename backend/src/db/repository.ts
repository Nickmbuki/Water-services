import bcrypt from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { db, hasDatabase } from "./client.js";
import { orders, payments, services, users } from "./schema.js";
import { env } from "../utils/env.js";

export type Role = "customer" | "admin";
export type ServiceCategory = "delivery" | "borehole" | "plumbing" | "purification";
export type OrderStatus = "pending" | "paid" | "in_progress" | "completed";
export type PaymentProvider = "mpesa" | "paypal";
export type PaymentStatus = "pending" | "paid" | "failed";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
};

export type PublicUser = Omit<User, "passwordHash">;

export type Service = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  imageUrl: string;
};

export type Order = {
  id: string;
  userId: string;
  serviceId: string;
  amount: number;
  status: OrderStatus;
  location: string;
  scheduledDate: Date;
  createdAt: Date;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
};

export type PendingPayment = {
  id: string;
  provider: PaymentProvider;
  transactionId: string;
  amount: number;
  orderReference: string;
  status: PaymentStatus;
  phone?: string;
  createdAt: Date;
};

export type OrderWithDetails = Order & {
  service: Service | null;
  user: PublicUser | null;
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

export type CreateOrderInput = {
  userId: string;
  serviceId: string;
  amount: number;
  location: string;
  scheduledDate: Date;
};

const serviceSeed: Service[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    name: "Water Tanker Bulk Delivery",
    description: "Scheduled bulk water bowser delivery for estates, construction sites, institutions, and businesses.",
    category: "delivery",
    basePrice: 6500,
    imageUrl: "/images/water-bowser/water-bowser-bulk.jpg"
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    name: "Emergency Water Supply",
    description: "Rapid response clean water supply across Nairobi and Kiambu for urgent shortages.",
    category: "delivery",
    basePrice: 7500,
    imageUrl: "/images/water-bowser/water-bowser-emergency.jpg"
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    name: "Home Water Delivery",
    description: "Reliable domestic clean water delivery for homes, apartments, and residential compounds.",
    category: "delivery",
    basePrice: 2500,
    imageUrl: "/images/water-bowser/water-bowser-home.jpg"
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    name: "Business Water Delivery",
    description: "Commercial water delivery plans for offices, hotels, factories, schools, and retail operations.",
    category: "delivery",
    basePrice: 5000,
    imageUrl: "/images/water-bowser/water-bowser-business.jpg"
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    name: "Well Drilling",
    description: "Professional well drilling and digging with site assessment, lining guidance, water access planning, and handover.",
    category: "borehole",
    basePrice: 180000,
    imageUrl: "/images/services/well-drilling.jpg"
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    name: "Well Inspection",
    description: "Well inspection, water level checks, pump diagnostics, safety checks, and technical reports.",
    category: "borehole",
    basePrice: 12000,
    imageUrl: "/images/services/well-inspection.jpg"
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    name: "Well Pump Installation",
    description: "Submersible pump sizing, installation, control panels, cabling, and commissioning.",
    category: "borehole",
    basePrice: 45000,
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    name: "Well Rehabilitation",
    description: "Restoration of low-yield and blocked wells through cleaning, lining support, flushing, and pump upgrades.",
    category: "borehole",
    basePrice: 35000,
    imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "99999999-9999-4999-8999-999999999999",
    name: "Home Plumbing",
    description: "Domestic plumbing repairs, pipework, tanks, pumps, fixtures, and water pressure solutions.",
    category: "plumbing",
    basePrice: 3500,
    imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    name: "Commercial Plumbing",
    description: "Plumbing installation and maintenance for commercial buildings and high-demand facilities.",
    category: "plumbing",
    basePrice: 15000,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    name: "Leak Repair",
    description: "Leak detection and repair for homes, compounds, storage tanks, pumps, and main lines.",
    category: "plumbing",
    basePrice: 3000,
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    name: "Tank Installation",
    description: "Water tank supply, base preparation, installation, fittings, float valves, and overflow systems.",
    category: "plumbing",
    basePrice: 10000,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80"
  }
];

const retiredServiceIds = new Set(["dddddddd-dddd-4ddd-8ddd-dddddddddddd"]);

const isVisibleService = (service: Service) => !retiredServiceIds.has(service.id);

const toPublicUser = (user: User): PublicUser => {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
};

const money = (value: string | number) => Number(value);

export interface Repository {
  initialize(): Promise<void>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  createUser(input: { name: string; email: string; phone: string; passwordHash: string; role?: Role }): Promise<User>;
  listServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | null>;
  createService(input: Omit<Service, "id">): Promise<Service>;
  updateService(id: string, input: Partial<Omit<Service, "id">>): Promise<Service | null>;
  createPendingPayment(input: Omit<PendingPayment, "id" | "createdAt">): Promise<PendingPayment>;
  getPendingPayment(id: string): Promise<PendingPayment | null>;
  createOrderRequest(input: CreateOrderInput): Promise<OrderWithDetails>;
  listOrdersByUser(userId: string): Promise<OrderWithDetails[]>;
  listOrders(): Promise<OrderWithDetails[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<OrderWithDetails | null>;
  listPayments(): Promise<Payment[]>;
  analytics(): Promise<Analytics>;
}

class MemoryRepository implements Repository {
  private users: User[] = [];
  private services: Service[] = [...serviceSeed];
  private orders: Order[] = [];
  private payments: Payment[] = [];
  private pendingPayments: PendingPayment[] = [];

  async initialize() {
    const existingAdmin = this.users.find((user) => user.email === env.adminEmail.toLowerCase());
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(env.adminPassword, 12);
      this.users.push({
        id: uuid(),
        name: env.adminName,
        email: env.adminEmail.toLowerCase(),
        phone: env.adminPhone,
        passwordHash,
        role: "admin",
        createdAt: new Date()
      });
    }
  }

  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email.toLowerCase()) ?? null;
  }

  async findUserById(id: string) {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async createUser(input: { name: string; email: string; phone: string; passwordHash: string; role?: Role }) {
    const user: User = {
      id: uuid(),
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash: input.passwordHash,
      role: input.role ?? "customer",
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async listServices() {
    return this.services.filter(isVisibleService);
  }

  async getService(id: string) {
    if (retiredServiceIds.has(id)) return null;
    return this.services.find((service) => service.id === id) ?? null;
  }

  async createService(input: Omit<Service, "id">) {
    const service = { id: uuid(), ...input };
    this.services.push(service);
    return service;
  }

  async updateService(id: string, input: Partial<Omit<Service, "id">>) {
    const index = this.services.findIndex((service) => service.id === id);
    if (index === -1) return null;
    this.services[index] = { ...this.services[index], ...input };
    return this.services[index];
  }

  async createPendingPayment(input: Omit<PendingPayment, "id" | "createdAt">) {
    const payment: PendingPayment = { ...input, id: uuid(), createdAt: new Date() };
    this.pendingPayments.push(payment);
    return payment;
  }

  async getPendingPayment(id: string) {
    return this.pendingPayments.find((payment) => payment.id === id) ?? null;
  }

  async createOrderRequest(input: CreateOrderInput) {
    const order: Order = {
      id: uuid(),
      userId: input.userId,
      serviceId: input.serviceId,
      amount: input.amount,
      status: "pending",
      location: input.location,
      scheduledDate: input.scheduledDate,
      createdAt: new Date()
    };
    this.orders.push(order);
    return this.hydrateOrder(order);
  }

  async listOrdersByUser(userId: string) {
    return Promise.all(
      this.orders
        .filter((order) => order.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((order) => this.hydrateOrder(order))
    );
  }

  async listOrders() {
    return Promise.all(
      [...this.orders]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map((order) => this.hydrateOrder(order))
    );
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = this.orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    return this.hydrateOrder(order);
  }

  async listPayments() {
    return [...this.payments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async analytics() {
    return {
      totalOrders: this.orders.length,
      activeOrders: this.orders.filter((order) => order.status === "pending" || order.status === "paid" || order.status === "in_progress").length,
      completedOrders: this.orders.filter((order) => order.status === "completed").length,
      revenue: this.orders.reduce((total, order) => total + order.amount, 0),
      totalPayments: this.payments.length,
      services: this.services.filter(isVisibleService).length
    };
  }

  private async hydrateOrder(order: Order): Promise<OrderWithDetails> {
    const service = this.services.find((item) => item.id === order.serviceId) ?? null;
    const user = this.users.find((item) => item.id === order.userId) ?? null;
    const payment = this.payments.find((item) => item.orderId === order.id) ?? null;
    return { ...order, service, user: user ? toPublicUser(user) : null, payment };
  }
}

class PostgresRepository implements Repository {
  async initialize() {
    if (!db) return;
    for (const service of serviceSeed) {
      const existing = await db.query.services.findFirst({ where: eq(services.id, service.id) });
      if (!existing) {
        await db.insert(services).values({ ...service, basePrice: String(service.basePrice) });
      } else {
        await db
          .update(services)
          .set({
            name: service.name,
            description: service.description,
            category: service.category,
            basePrice: String(service.basePrice),
            imageUrl: service.imageUrl
          })
          .where(eq(services.id, service.id));
      }
    }
    const existingAdmin = await this.findUserByEmail(env.adminEmail);
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(env.adminPassword, 12);
      await this.createUser({
        name: env.adminName,
        email: env.adminEmail,
        phone: env.adminPhone,
        passwordHash,
        role: "admin"
      });
    }
  }

  async findUserByEmail(email: string) {
    if (!db) return null;
    const user = await db.query.users.findFirst({ where: eq(users.email, email.toLowerCase()) });
    return user ? this.mapUser(user) : null;
  }

  async findUserById(id: string) {
    if (!db) return null;
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    return user ? this.mapUser(user) : null;
  }

  async createUser(input: { name: string; email: string; phone: string; passwordHash: string; role?: Role }) {
    if (!db) throw new Error("Database is not configured");
    const [user] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        passwordHash: input.passwordHash,
        role: input.role ?? "customer"
      })
      .returning();
    return this.mapUser(user);
  }

  async listServices() {
    if (!db) return [];
    const rows = await db.select().from(services);
    return rows.map(this.mapService).filter(isVisibleService);
  }

  async getService(id: string) {
    if (retiredServiceIds.has(id)) return null;
    if (!db) return null;
    const service = await db.query.services.findFirst({ where: eq(services.id, id) });
    return service ? this.mapService(service) : null;
  }

  async createService(input: Omit<Service, "id">) {
    if (!db) throw new Error("Database is not configured");
    const [service] = await db.insert(services).values({ ...input, basePrice: String(input.basePrice) }).returning();
    return this.mapService(service);
  }

  async updateService(id: string, input: Partial<Omit<Service, "id">>) {
    if (!db) return null;
    const values = {
      ...input,
      basePrice: input.basePrice === undefined ? undefined : String(input.basePrice)
    };
    const [service] = await db.update(services).set(values).where(eq(services.id, id)).returning();
    return service ? this.mapService(service) : null;
  }

  private pendingPayments = new Map<string, PendingPayment>();

  async createPendingPayment(input: Omit<PendingPayment, "id" | "createdAt">) {
    const payment = { ...input, id: uuid(), createdAt: new Date() };
    this.pendingPayments.set(payment.id, payment);
    return payment;
  }

  async getPendingPayment(id: string) {
    return this.pendingPayments.get(id) ?? null;
  }

  async createOrderRequest(input: CreateOrderInput) {
    if (!db) throw new Error("Database is not configured");
    const [order] = await db
      .insert(orders)
      .values({
        userId: input.userId,
        serviceId: input.serviceId,
        amount: String(input.amount),
        status: "pending",
        location: input.location,
        scheduledDate: input.scheduledDate
      })
      .returning();
    return this.getOrderDetails(order.id);
  }

  async listOrdersByUser(userId: string) {
    if (!db) return [];
    const rows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    return Promise.all(rows.map((order) => this.getOrderDetails(order.id)));
  }

  async listOrders() {
    if (!db) return [];
    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return Promise.all(rows.map((order) => this.getOrderDetails(order.id)));
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    if (!db) return null;
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order ? this.getOrderDetails(order.id) : null;
  }

  async listPayments() {
    if (!db) return [];
    const rows = await db.select().from(payments).orderBy(desc(payments.createdAt));
    return rows.map(this.mapPayment);
  }

  async analytics() {
    const allOrders = await this.listOrders();
    const allServices = await this.listServices();
    return {
      totalOrders: allOrders.length,
      activeOrders: allOrders.filter((order) => order.status === "pending" || order.status === "paid" || order.status === "in_progress").length,
      completedOrders: allOrders.filter((order) => order.status === "completed").length,
      revenue: allOrders.reduce((total, order) => total + order.amount, 0),
      totalPayments: 0,
      services: allServices.length
    };
  }

  private async getOrderDetails(id: string): Promise<OrderWithDetails> {
    if (!db) throw new Error("Database is not configured");
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) throw new Error("Order not found");
    const [service, user, payment] = await Promise.all([
      db.query.services.findFirst({ where: eq(services.id, order.serviceId) }),
      db.query.users.findFirst({ where: eq(users.id, order.userId) }),
      db.query.payments.findFirst({ where: eq(payments.orderId, order.id) })
    ]);
    return {
      ...this.mapOrder(order),
      service: service ? this.mapService(service) : null,
      user: user ? toPublicUser(this.mapUser(user)) : null,
      payment: payment ? this.mapPayment(payment) : null
    };
  }

  private mapUser(user: typeof users.$inferSelect): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  private mapService(service: typeof services.$inferSelect): Service {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      category: service.category,
      basePrice: money(service.basePrice),
      imageUrl: service.imageUrl
    };
  }

  private mapOrder(order: typeof orders.$inferSelect): Order {
    return {
      id: order.id,
      userId: order.userId,
      serviceId: order.serviceId,
      amount: money(order.amount),
      status: order.status,
      location: order.location,
      scheduledDate: order.scheduledDate,
      createdAt: order.createdAt
    };
  }

  private mapPayment(payment: typeof payments.$inferSelect): Payment {
    return {
      id: payment.id,
      orderId: payment.orderId,
      provider: payment.provider,
      transactionId: payment.transactionId,
      amount: money(payment.amount),
      status: payment.status,
      createdAt: payment.createdAt
    };
  }
}

export const repository: Repository = hasDatabase ? new PostgresRepository() : new MemoryRepository();
export const publicUser = toPublicUser;
