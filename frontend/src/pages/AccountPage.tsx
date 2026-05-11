import { useQuery } from "@tanstack/react-query";
import { CalendarClock, MapPin, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatKes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AccountPage = () => {
  const { user } = useAuth();
  const ordersQuery = useQuery({ queryKey: ["my-orders"], queryFn: () => api.myOrders() });
  const orders = ordersQuery.data?.orders ?? [];

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-bold">Order tracking</h1>
            <p className="mt-2 text-muted-foreground">{user?.name} · {user?.phone}</p>
          </div>
          <Link to="/services">
            <Button type="button">Request another service</Button>
          </Link>
        </div>

        {ordersQuery.isLoading ? <p>Loading orders...</p> : null}
        {!ordersQuery.isLoading && orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ReceiptText className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h2 className="text-xl font-semibold">No orders yet</h2>
              <p className="mt-2 text-muted-foreground">Your paid service orders will appear here.</p>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <CardTitle>{order.service?.name ?? "Service"}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                </div>
                <span className="w-fit rounded-md bg-primary px-3 py-1 text-sm font-semibold capitalize text-white">
                  {order.status.replace("_", " ")}
                </span>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-700 md:grid-cols-3">
                <p className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4 text-primary" />
                  {formatKes(order.amount)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {order.location}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-primary" />
                  {new Date(order.scheduledDate).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};
