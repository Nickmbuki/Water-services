import { Router } from "express";
import { z } from "zod";
import { repository } from "../db/repository.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../utils/http.js";

const orderInput = z.object({
  serviceId: z.string().uuid(),
  amount: z.coerce.number().positive(),
  location: z.string().min(3),
  scheduledDate: z.coerce.date(),
  paymentSessionId: z.string().uuid()
});

export const ordersRoutes = Router();

ordersRoutes.use(requireAuth);

ordersRoutes.post(
  "/",
  asyncHandler(async (req, res) => {
    if (!req.user) throw new HttpError(401, "Authentication required");
    const input = orderInput.parse(req.body);
    const service = await repository.getService(input.serviceId);
    if (!service) throw new HttpError(404, "Service not found");
    const order = await repository.createOrderAfterPayment({
      userId: req.user.id,
      serviceId: input.serviceId,
      amount: input.amount,
      location: input.location,
      scheduledDate: input.scheduledDate,
      paymentSessionId: input.paymentSessionId
    });
    res.status(201).json({ order });
  })
);

ordersRoutes.get(
  "/mine",
  asyncHandler(async (req, res) => {
    if (!req.user) throw new HttpError(401, "Authentication required");
    res.json({ orders: await repository.listOrdersByUser(req.user.id) });
  })
);
