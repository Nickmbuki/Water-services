# Services And Orders Agent

## Goal
Enable browsing services, scheduling work, and creating orders only after successful payment.

## Tasks
- Model delivery, borehole, plumbing, and purification services.
- Add public service listing endpoints.
- Add authenticated customer order history.
- Add order creation after payment confirmation.
- Add admin order listing and status updates.

## Files to create
- `backend/src/routes/services.routes.ts`
- `backend/src/routes/orders.routes.ts`
- `backend/src/services/order.service.ts`
- `frontend/src/pages/ServicesPage.tsx`
- `frontend/src/pages/CheckoutPage.tsx`
- `frontend/src/pages/AccountPage.tsx`

## Completion checklist
- [ ] Services include all required company offerings.
- [ ] Customers can schedule service details.
- [ ] Orders are not created before payment succeeds.
- [ ] Admin can update order status.
