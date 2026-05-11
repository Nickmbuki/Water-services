# Database Agent

## Goal
Implement PostgreSQL persistence using Drizzle ORM with schema support for users, services, orders, and payments.

## Tasks
- Define Drizzle schema for required tables and enums.
- Add database connection setup.
- Add migration generation scripts.
- Seed default services and an admin account for local testing.
- Provide a local fallback mode when PostgreSQL credentials are absent.

## Files to create
- `backend/src/db/schema.ts`
- `backend/src/db/client.ts`
- `backend/src/db/repository.ts`
- `backend/src/db/seed.ts`
- `backend/drizzle.config.ts`

## Completion checklist
- [ ] Tables match the requested schema.
- [ ] Drizzle can target PostgreSQL through `DATABASE_URL`.
- [ ] Default services are available.
- [ ] Local development can proceed without missing credentials.
