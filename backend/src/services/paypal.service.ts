import axios from "axios";
import { repository } from "../db/repository.js";
import { env } from "../utils/env.js";

type PayPalCreateInput = {
  amount: number;
  orderReference: string;
};

const hasPayPalCredentials = () => Boolean(env.paypal.clientId && env.paypal.clientSecret);
const paypalBaseUrl = () => (env.paypal.env === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");

const accessToken = async () => {
  const auth = Buffer.from(`${env.paypal.clientId}:${env.paypal.clientSecret}`).toString("base64");
  const response = await axios.post(
    `${paypalBaseUrl()}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );
  return response.data.access_token as string;
};

export const paypalService = {
  async createOrder(input: PayPalCreateInput) {
    if (!hasPayPalCredentials()) {
      return {
        mode: "sandbox-simulated",
        paypalOrderId: `PAYPAL-SANDBOX-${Date.now()}`,
        status: "CREATED",
        orderReference: input.orderReference,
        amount: input.amount
      };
    }
    const token = await accessToken();
    const response = await axios.post(
      `${paypalBaseUrl()}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: input.orderReference,
            amount: {
              currency_code: "USD",
              value: Math.max(1, Math.round(input.amount / 140)).toFixed(2)
            }
          }
        ]
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { mode: "paypal", ...response.data };
  },

  async capture(input: { paypalOrderId: string; amount: number; orderReference: string }) {
    if (!hasPayPalCredentials()) {
      const pendingPayment = await repository.createPendingPayment({
        provider: "paypal",
        transactionId: input.paypalOrderId,
        amount: input.amount,
        orderReference: input.orderReference,
        status: "paid"
      });
      return {
        mode: "sandbox-simulated",
        status: "COMPLETED",
        paymentSessionId: pendingPayment.id,
        transactionId: pendingPayment.transactionId
      };
    }
    const token = await accessToken();
    const response = await axios.post(
      `${paypalBaseUrl()}/v2/checkout/orders/${input.paypalOrderId}/capture`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const pendingPayment = await repository.createPendingPayment({
      provider: "paypal",
      transactionId: response.data.id,
      amount: input.amount,
      orderReference: input.orderReference,
      status: "paid"
    });
    return { paymentSessionId: pendingPayment.id, ...response.data };
  }
};
