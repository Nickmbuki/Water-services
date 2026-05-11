# Deployment Guide

## Railway Config

Railway currently reads `railway.toml` or `railway.json` for config-as-code. This repo includes:

- `/backend/railway.toml` for the API service.
- `/frontend/railway.toml` for the customer/admin web app.
- `/railway.yaml` as a human-readable service map and variable checklist.

Create two Railway services from the same GitHub repository. Set the backend service root directory to `/backend` and the frontend service root directory to `/frontend`.

## Backend

Deploy `backend/` as an independent Node.js service.

Required environment variables:

- `PORT`
- `FRONTEND_URL`
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_PASSKEY`
- `MPESA_SHORTCODE`
- `MPESA_CALLBACK_URL`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`

Build command:

```bash
npm install
npm run build
```

Start command:

```bash
npm start
```

Use `npm run db:push` or generated migrations against the production PostgreSQL database before accepting traffic.

## Frontend

Deploy `frontend/` as a static Vite application.

Required environment variable:

- `VITE_API_URL`

Build command:

```bash
npm install
npm run build
```

Publish the generated `dist/` directory.

## Payments

M-Pesa Daraja callbacks must point to:

```text
https://your-api-domain/payments/mpesa/callback
```

PayPal sandbox/live credentials should match `PAYPAL_ENV`. Use sandbox credentials for testing and production credentials only after the full capture flow is verified.
