# Nairobi Kiambu Water Services Platform

Production-ready local platform for clean water delivery, borehole services, plumbing, filtration, payments, order tracking, and admin operations.

## Structure

- `backend/` - Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, JWT auth.
- `frontend/` - React, Vite, TypeScript, TailwindCSS, shadcn-style UI, React Query, React Hook Form, Zod, Framer Motion.
- `docs/agents/` - implementation agent files.

## Local Run

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Default Local Admin

- Email: `admin@waterservices.co.ke`
- Password: `Admin12345!`

## Environment

Copy `.env.example` in each app when deploying. If `DATABASE_URL` is not set, the backend runs in local in-memory mode so the full flow can be tested without credentials. Set `DATABASE_URL` to use PostgreSQL and Drizzle.

## Business Details

- Office: Nairobi, Kenya
- Service areas: Nairobi County, Kiambu County
- Phone: `0782 602171`, `0797 608086`

## Payment Flow

Orders are created only after payment success:

1. Customer selects service.
2. Customer enters service location and schedule.
3. Customer clicks `Pay & Place Order`.
4. Payment modal opens.
5. Customer chooses M-Pesa STK Push or PayPal Checkout.
6. Successful payment creates the order and payment record.
