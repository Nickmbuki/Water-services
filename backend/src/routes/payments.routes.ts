import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { mpesaService } from "../services/mpesa.service.js";
import { paypalService } from "../services/paypal.service.js";
import { asyncHandler } from "../utils/http.js";

const paymentInput = z.object({
  phone: z.string().optional(),
  amount: z.coerce.number().positive(),
  orderReference: z.string().min(3)
});

export const paymentsRoutes = Router();

paymentsRoutes.post(
  "/mpesa/stkpush",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = paymentInput.extend({ phone: z.string().min(9) }).parse(req.body);
    const result = await mpesaService.stkPush(input);
    res.json(result);
  })
);

paymentsRoutes.post(
  "/mpesa/callback",
  asyncHandler(async (req, res) => {
    const result = await mpesaService.callback(req.body);
    res.json(result);
  })
);

paymentsRoutes.post(
  "/paypal/create-order",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = paymentInput.omit({ phone: true }).parse(req.body);
    const result = await paypalService.createOrder(input);
    res.json(result);
  })
);

paymentsRoutes.post(
  "/paypal/capture",
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        paypalOrderId: z.string().min(3),
        amount: z.coerce.number().positive(),
        orderReference: z.string().min(3)
      })
      .parse(req.body);
    const result = await paypalService.capture(input);
    res.json(result);
  })
);
