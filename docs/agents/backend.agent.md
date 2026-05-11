# Backend Agent

## Goal
Build a production-ready Node.js + Express + TypeScript API for water delivery, borehole, plumbing, purification, order, payment, and admin workflows.

## Tasks
- Configure Express middleware, CORS, JSON parsing, and error handling.
- Expose health, auth, services, orders, payments, and admin routes.
- Validate request bodies with Zod.
- Keep controllers thin and business logic in services/repositories.

## Files to create
- `backend/src/server.ts`
- `backend/src/app.ts`
- `backend/src/routes/*.ts`
- `backend/src/middleware/*.ts`
- `backend/src/utils/*.ts`

## Completion checklist
- [ ] `npm run dev` starts the API.
- [ ] API exposes `/health`.
- [ ] Routes return consistent JSON responses.
- [ ] Errors are handled without leaking stack traces in production.
