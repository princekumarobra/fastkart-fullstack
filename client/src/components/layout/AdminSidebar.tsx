import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft } from "lucide-react";

export function AdminSidebar() {
  const [location] = useLocation();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/users", label: "Users", icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-medium" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
