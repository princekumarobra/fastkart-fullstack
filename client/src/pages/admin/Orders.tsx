import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AdminOrders() {
  const { data: orders, isLoading } = useOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus({ id: orderId, status: newStatus as any });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Manage Orders</h1>

        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground font-medium uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : orders?.map(order => (
                <tr key={order._id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 font-mono text-sm">{order._id.slice(-8).toUpperCase()}</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-bold">${order.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={order.paymentStatus === 'paid' ? "default" : "secondary"}>
                      {order.paymentMethod.toUpperCase()} - {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Select defaultValue={order.orderStatus} onValueChange={(v) => handleStatusChange(order._id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
