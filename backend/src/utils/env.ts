import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET ?? "local-development-secret-change-me",
  adminName: process.env.ADMIN_NAME ?? "Water Services Admin",
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@waterservices.co.ke",
  adminPhone: process.env.ADMIN_PHONE ?? "0782602171",
  adminPassword: process.env.ADMIN_PASSWORD ?? "Admin12345!",
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passkey: process.env.MPESA_PASSKEY,
    shortcode: process.env.MPESA_SHORTCODE,
    callbackUrl: process.env.MPESA_CALLBACK_URL ?? "http://localhost:4000/payments/mpesa/callback",
    env: process.env.MPESA_ENV ?? "sandbox"
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    env: process.env.PAYPAL_ENV ?? "sandbox"
  }
};
