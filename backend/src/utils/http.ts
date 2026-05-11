import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "./env.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export const asyncHandler =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", issues: error.flatten() });
  }
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  const message = error instanceof Error ? error.message : "Internal server error";
  return res.status(500).json({
    message: env.nodeEnv === "production" ? "Internal server error" : message
  });
};
