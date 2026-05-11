import { useState } from "react";
import { CreditCard, Loader2, Smartphone } from "lucide-react";
import { api, type Service } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKes } from "@/lib/utils";

type PaymentModalProps = {
  open: boolean;
  service: Service;
  orderReference: string;
  customerPhone: string;
  onClose: () => void;
  onPaid: (paymentSessionId: string) => Promise<void>;
};

export const PaymentModal = ({ open, service, orderReference, customerPhone, onClose, onPaid }: PaymentModalProps) => {
  const [phone, setPhone] = useState(customerPhone);
  const [loading, setLoading] = useState<"mpesa" | "paypal" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const payMpesa = async () => {
    setLoading("mpesa");
    setMessage(null);
    try {
      const payment = await api.payMpesa({ phone, amount: service.basePrice, orderReference });
      await onPaid(payment.paymentSessionId);
      setMessage("M-Pesa payment confirmed. Order created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "M-Pesa payment failed");
    } finally {
      setLoading(null);
    }
  };

  const payPayPal = async () => {
    setLoading("paypal");
    setMessage(null);
    try {
      const created = await api.createPayPalOrder({ amount: service.basePrice, orderReference });
      const paypalOrderId = created.paypalOrderId ?? created.id;
      if (!paypalOrderId) throw new Error("PayPal order was not created");
      const captured = await api.capturePayPal({ paypalOrderId, amount: service.basePrice, orderReference });
      await onPaid(captured.paymentSessionId);
      setMessage("PayPal payment confirmed. Order created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PayPal payment failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} title="Pay & place order" onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm text-muted-foreground">Service</p>
          <p className="font-semibold">{service.name}</p>
          <p className="mt-1 text-2xl font-bold text-primary">{formatKes(service.basePrice)}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mpesa-phone">M-Pesa phone number</Label>
          <Input id="mpesa-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="07..." />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" onClick={payMpesa} disabled={Boolean(loading)}>
            {loading === "mpesa" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
            M-Pesa STK Push
          </Button>
          <Button type="button" variant="secondary" onClick={payPayPal} disabled={Boolean(loading)}>
            {loading === "paypal" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
            PayPal Checkout
          </Button>
        </div>
        {message ? <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{message}</p> : null}
      </div>
    </Dialog>
  );
};
