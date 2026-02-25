import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAdminDashboard } from "@/hooks/use-admin";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();

  // Dummy chart data since backend only provides totals
  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard Overview</h1>
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-muted-foreground">Total Sales</h3>
              <div className="bg-primary/10 text-primary p-2 rounded-lg"><DollarSign className="w-5 h-5" /></div>
            </div>
            <p className="font-display text-4xl font-bold text-foreground">${data?.totalSales.toFixed(2)}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-muted-foreground">Orders</h3>
              <div className="bg-blue-500/10 text-blue-500 p-2 rounded-lg"><ShoppingBag className="w-5 h-5" /></div>
            </div>
            <p className="font-display text-4xl font-bold text-foreground">{data?.totalOrders}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-muted-foreground">Products</h3>
              <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg"><Package className="w-5 h-5" /></div>
            </div>
            <p className="font-display text-4xl font-bold text-foreground">{data?.totalProducts}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-muted-foreground">Users</h3>
              <div className="bg-purple-500/10 text-purple-500 p-2 rounded-lg"><Users className="w-5 h-5" /></div>
            </div>
            <p className="font-display text-4xl font-bold text-foreground">{data?.totalUsers}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm h-[400px]">
          <h3 className="font-display text-xl font-bold mb-6">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
              <Tooltip 
                cursor={{fill: 'hsl(var(--secondary))'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
