import { Router } from "express";
import { z } from "zod";
import { repository } from "../db/repository.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../utils/http.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireAdmin);

adminRoutes.get(
  "/analytics",
  asyncHandler(async (_req, res) => {
    res.json({ analytics: await repository.analytics() });
  })
);

adminRoutes.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    res.json({ orders: await repository.listOrders() });
  })
);

adminRoutes.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const input = z.object({ status: z.enum(["pending", "paid", "in_progress", "completed"]) }).parse(req.body);
    const order = await repository.updateOrderStatus(String(req.params.id), input.status);
    if (!order) throw new HttpError(404, "Order not found");
    res.json({ order });
  })
);

adminRoutes.get(
  "/payments",
  asyncHandler(async (_req, res) => {
    res.json({ payments: await repository.listPayments() });
  })
);

adminRoutes.get(
  "/services",
  asyncHandler(async (_req, res) => {
    res.json({ services: await repository.listServices() });
  })
);
