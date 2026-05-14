import axios from "axios";
import { repository } from "../db/repository.js";
import { env } from "../utils/env.js";
import { HttpError } from "../utils/http.js";

type StkPushInput = {
  phone: string;
  amount: number;
  orderReference: string;
};

const hasDarajaCredentials = () =>
  Boolean(env.mpesa.consumerKey && env.mpesa.consumerSecret && env.mpesa.passkey && env.mpesa.shortcode);

const darajaBaseUrl = () =>
  env.mpesa.env === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

const timestamp = () => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(
    date.getMinutes()
  )}${pad(date.getSeconds())}`;
};

const normalizePhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  return digits;
};

export const mpesaService = {
  async stkPush(input: StkPushInput) {
    if (!hasDarajaCredentials()) {
      return this.simulatePayment(input, "M-Pesa sandbox payment simulated successfully");
    }

    try {
      const auth = Buffer.from(`${env.mpesa.consumerKey}:${env.mpesa.consumerSecret}`).toString("base64");
      const tokenResponse = await axios.get(`${darajaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: { Authorization: `Basic ${auth}` },
        timeout: 20000
      });
      const generatedTimestamp = timestamp();
      const password = Buffer.from(`${env.mpesa.shortcode}${env.mpesa.passkey}${generatedTimestamp}`).toString("base64");
      const response = await axios.post(
        `${darajaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: env.mpesa.shortcode,
          Password: password,
          Timestamp: generatedTimestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(input.amount),
          PartyA: normalizePhone(input.phone),
          PartyB: env.mpesa.shortcode,
          PhoneNumber: normalizePhone(input.phone),
          CallBackURL: env.mpesa.callbackUrl,
          AccountReference: input.orderReference,
          TransactionDesc: "Water services order payment"
        },
        {
          headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
          timeout: 20000
        }
      );
      const pendingPayment = await repository.createPendingPayment({
        provider: "mpesa",
        transactionId: response.data.CheckoutRequestID,
        amount: input.amount,
        orderReference: input.orderReference,
        status: env.mpesa.env === "sandbox" ? "paid" : "pending",
        phone: input.phone
      });
      return { mode: "daraja", paymentSessionId: pendingPayment.id, ...response.data };
    } catch (error) {
      if (env.mpesa.env === "sandbox") {
        return this.simulatePayment(input, "Daraja sandbox rejected the STK push, so payment was simulated for testing");
      }
      const message = axios.isAxiosError(error)
        ? error.response?.data?.errorMessage ?? error.response?.data?.ResponseDescription ?? error.message
        : "M-Pesa STK push failed";
      throw new HttpError(502, message);
    }
  },

  async simulatePayment(input: StkPushInput, message: string) {
    const pendingPayment = await repository.createPendingPayment({
      provider: "mpesa",
      transactionId: `MPESA-SANDBOX-${Date.now()}`,
      amount: input.amount,
      orderReference: input.orderReference,
      status: "paid",
      phone: input.phone
    });
    return {
      mode: "sandbox-simulated",
      message,
      checkoutRequestId: pendingPayment.transactionId,
      paymentSessionId: pendingPayment.id,
      status: pendingPayment.status
    };
  },

  async callback(payload: unknown) {
    return {
      received: true,
      payload
    };
  }
};
