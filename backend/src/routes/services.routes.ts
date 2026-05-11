import { Router } from "express";
import { z } from "zod";
import { repository } from "../db/repository.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler, HttpError } from "../utils/http.js";

const serviceInput = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(["delivery", "borehole", "plumbing", "purification"]),
  basePrice: z.coerce.number().positive(),
  imageUrl: z.string().url()
});

export const servicesRoutes = Router();

servicesRoutes.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ services: await repository.listServices() });
  })
);

servicesRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const service = await repository.getService(String(req.params.id));
    if (!service) throw new HttpError(404, "Service not found");
    res.json({ service });
  })
);

servicesRoutes.post(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const service = await repository.createService(serviceInput.parse(req.body));
    res.status(201).json({ service });
  })
);

servicesRoutes.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const service = await repository.updateService(String(req.params.id), serviceInput.partial().parse(req.body));
    if (!service) throw new HttpError(404, "Service not found");
    res.json({ service });
  })
);
