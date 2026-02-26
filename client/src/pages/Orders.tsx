import { Navbar } from "@/components/layout/Navbar";
import { useOrders } from "@/hooks/use-orders";
import { useAuthStore } from "@/hooks/use-auth";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";

export default function Orders() {
  const { data: orders, isLoading } = useOrders();
  const { user } = useAuthStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered': return <CheckCircle className="w-5 h-5 text-primary" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">My Orders</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-secondary animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold">No orders found</h3>
            <p className="text-muted-foreground mt-2">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                  <p className="text-sm text-muted-foreground mb-4">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary w-fit rounded-full text-sm font-medium capitalize">
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                  <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                  <p className="font-display text-2xl font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-sm font-medium mt-2 capitalize text-muted-foreground">
                    Payment: <span className={order.paymentStatus === 'paid' ? 'text-primary' : 'text-amber-500'}>{order.paymentStatus}</span> ({order.paymentMethod})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
