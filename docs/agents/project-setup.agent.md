# Project Setup Agent

## Goal
Establish the `water-services` platform as two independent applications: `backend` and `frontend`, with shared planning documentation under `docs/agents`.

## Tasks
- Create the required directory structure.
- Configure independent package manifests for backend and frontend.
- Add TypeScript, linting-friendly project settings, and environment examples.
- Keep backend and frontend dependency graphs separate.

## Files to create
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.env.example`
- `frontend/package.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/.env.example`

## Completion checklist
- [ ] `water-services/backend` exists and runs independently.
- [ ] `water-services/frontend` exists and runs independently.
- [ ] No monorepo package workspace is introduced.
- [ ] Environment variables are documented with examples.
