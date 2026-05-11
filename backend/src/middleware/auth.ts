import type { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { HttpError } from "../utils/http.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        role: "customer" | "admin";
        createdAt: Date;
      };
    }
  }
}

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) throw new HttpError(401, "Authentication required");
    req.user = await authService.verify(token);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(new HttpError(401, "Authentication required"));
  if (req.user.role !== "admin") return next(new HttpError(403, "Admin access required"));
  return next();
};
