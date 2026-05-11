# Auth Agent

## Goal
Provide secure JWT authentication for customers and admins.

## Tasks
- Implement registration and login.
- Hash passwords with bcrypt.
- Sign and verify JWT tokens.
- Add role-aware authorization middleware.
- Return a current-user endpoint.

## Files to create
- `backend/src/routes/auth.routes.ts`
- `backend/src/services/auth.service.ts`
- `backend/src/middleware/auth.ts`
- `frontend/src/lib/auth.ts`
- `frontend/src/pages/LoginPage.tsx`
- `frontend/src/pages/RegisterPage.tsx`

## Completion checklist
- [ ] Customers can register.
- [ ] Customers and admins can login.
- [ ] JWT protects customer and admin routes.
- [ ] Admin-only routes reject non-admin users.
