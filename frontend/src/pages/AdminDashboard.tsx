import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Banknote, ClipboardList, Droplets, Truck } from "lucide-react";
import { api, type OrderStatus } from "@/lib/api";
import { formatKes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

const statusOptions: OrderStatus[] = ["pending", "paid", "in_progress", "completed"];
type StatCard = [string, string | number, LucideIcon];

export const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const analyticsQuery = useQuery({ queryKey: ["admin-analytics"], queryFn: () => api.adminAnalytics() });
  const ordersQuery = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.adminOrders() });
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    }
  });

  const analytics = analyticsQuery.data?.analytics;
  const orders = ordersQuery.data?.orders ?? [];

  return (
    <main className="bg-muted/60 py-12">
      <div className="container-shell">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin operations</p>
          <h1 className="mt-2 text-4xl font-bold">Water services dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {([
            ["Orders", analytics?.totalOrders ?? 0, ClipboardList],
            ["Active", analytics?.activeOrders ?? 0, Truck],
            ["Completed", analytics?.completedOrders ?? 0, BarChart3],
            ["Requested value", formatKes(analytics?.revenue ?? 0), Banknote],
            ["Services", analytics?.services ?? 0, Droplets]
          ] satisfies StatCard[]).map(([label, value, Icon]) => (
            <Card key={String(label)}>
              <CardContent className="p-5">
                <Icon className="mb-4 h-7 w-7 text-primary" />
                <p className="text-sm text-muted-foreground">{String(label)}</p>
                <p className="mt-1 text-2xl font-bold">{String(value)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Orders and deliveries</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="py-3">Customer</th>
                    <th>Service</th>
                    <th>Location</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/70">
                      <td className="py-3">
                        <p className="font-semibold">{order.user?.name ?? "Customer"}</p>
                        <p className="text-xs text-muted-foreground">{order.user?.phone}</p>
                      </td>
                      <td>{order.service?.name}</td>
                      <td className="max-w-xs">{order.location}</td>
                      <td>{formatKes(order.amount)}</td>
                      <td>
                        <Select
                          value={order.status}
                          onChange={(event) => statusMutation.mutate({ id: order.id, status: event.target.value as OrderStatus })}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.replace("_", " ")}
                            </option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 ? <p className="py-6 text-muted-foreground">No orders yet.</p> : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};
