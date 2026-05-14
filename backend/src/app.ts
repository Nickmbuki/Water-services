import cors from "cors";
import express from "express";
import { adminRoutes } from "./routes/admin.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { ordersRoutes } from "./routes/orders.routes.js";
import { paymentsRoutes } from "./routes/payments.routes.js";
import { servicesRoutes } from "./routes/services.routes.js";
import { env } from "./utils/env.js";
import { errorHandler } from "./utils/http.js";

export const app = express();

const allowedOrigins = new Set([env.frontendUrl, env.frontendUrl.replace(/\/+$/, "")].filter(Boolean));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "water-services-backend" });
});

app.use("/auth", authRoutes);
app.use("/services", servicesRoutes);
app.use("/orders", ordersRoutes);
app.use("/payments", paymentsRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);
