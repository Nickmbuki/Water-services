import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { authService, loginInput, registerInput } from "../services/auth.service.js";
import { asyncHandler } from "../utils/http.js";

export const authRoutes = Router();

authRoutes.post(
  "/register",
  asyncHandler(async (req, res) => {
    const result = await authService.register(registerInput.parse(req.body));
    res.status(201).json(result);
  })
);

authRoutes.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = await authService.login(loginInput.parse(req.body));
    res.json(result);
  })
);

authRoutes.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
