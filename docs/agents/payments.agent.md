# Payments Agent

## Goal
Prepare real M-Pesa Daraja and PayPal Checkout integrations while supporting local sandbox simulation.

## Tasks
- Implement M-Pesa STK push service structure.
- Implement M-Pesa callback endpoint.
- Implement PayPal create-order and capture service structure.
- Store successful payment records.
- Create the final order only after payment success.

## Files to create
- `backend/src/services/mpesa.service.ts`
- `backend/src/services/paypal.service.ts`
- `backend/src/routes/payments.routes.ts`
- `frontend/src/components/payment/PaymentModal.tsx`

## Completion checklist
- [ ] `POST /payments/mpesa/stkpush` accepts phone, amount, and order reference.
- [ ] `POST /payments/mpesa/callback` accepts Daraja callbacks.
- [ ] `POST /payments/paypal/create-order` creates a PayPal order.
- [ ] `POST /payments/paypal/capture` confirms payment.
- [ ] Frontend creates business order after successful payment.
