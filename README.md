# Nairobi Kiambu Water Services Platform

Production-ready local platform for bulk water bowser delivery, order tracking, and admin operations.

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

## Ordering Flow

The platform is focused on one service: bulk clean water delivery by bowser truck.

1. Customer opens `Order Water`.
2. Customer enters delivery location, schedule, estimated budget, and access notes.
3. Customer submits the request.
4. The admin dashboard receives the delivery request for dispatch follow-up.
