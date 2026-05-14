import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatKes } from "@/lib/utils";
import { PaymentModal } from "@/components/payment/PaymentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  location: z.string().min(3),
  scheduledDate: z.string().min(1),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export const CheckoutPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const serviceQuery = useQuery({ queryKey: ["service", params.id], queryFn: () => api.service(params.id ?? ""), enabled: Boolean(params.id) });
  const service = serviceQuery.data?.service;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { location: "", scheduledDate: "", notes: "" }
  });

  const orderReference = useMemo(() => `WS-${Date.now()}`, []);

  const submitDetails = form.handleSubmit(() => {
    setPaymentOpen(true);
  });

  const createOrder = async (paymentSessionId: string) => {
    const values = form.getValues();
    if (!service) return;
    const order = await api.createOrder({
      serviceId: service.id,
      amount: service.basePrice,
      location: values.notes ? `${values.location}. Notes: ${values.notes}` : values.location,
      scheduledDate: new Date(values.scheduledDate).toISOString(),
      paymentSessionId
    });
    setPaymentOpen(false);
    navigate(`/account?created=${order.order.id}`);
  };

  if (serviceQuery.isLoading) return <main className="container-shell py-16">Loading checkout...</main>;
  if (!service) return <main className="container-shell py-16">Service not found.</main>;

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell grid gap-8 lg:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle>Schedule service details</CardTitle>
            <p className="text-sm text-muted-foreground">Payment opens after these details are complete.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={submitDetails}>
              <div className="space-y-2">
                <Label>Delivery or service location</Label>
                <Input placeholder="Estate, road, building, nearest landmark" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label>Scheduled date and time</Label>
                <Input type="datetime-local" {...form.register("scheduledDate")} />
              </div>
              <div className="space-y-2">
                <Label>Instructions</Label>
                <Textarea placeholder="Tank size, access notes, emergency details, well notes..." {...form.register("notes")} />
              </div>
              <Button type="submit" size="lg">
                Pay & Place Order
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-5">
          <Card className="overflow-hidden">
            <img className="h-56 w-full object-cover" src={service.imageUrl} alt={service.name} />
            <CardContent className="p-5">
              <h1 className="text-2xl font-bold">{service.name}</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.description}</p>
              <div className="mt-5 rounded-md bg-primary/10 p-4">
                <p className="text-sm text-primary">Amount due before order creation</p>
                <p className="text-3xl font-bold text-primary">{formatKes(service.basePrice)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-sm leading-6 text-muted-foreground">
              Payments support M-Pesa STK Push and PayPal Checkout. In local sandbox mode, payment is simulated and the
              order is created immediately after payment confirmation.
            </CardContent>
          </Card>
        </aside>
      </div>

      <PaymentModal
        open={paymentOpen}
        service={service}
        orderReference={orderReference}
        customerPhone={user?.phone ?? ""}
        onClose={() => setPaymentOpen(false)}
        onPaid={createOrder}
      />
    </main>
  );
};
