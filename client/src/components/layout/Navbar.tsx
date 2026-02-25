import { Link, useLocation } from "wouter";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuthStore } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuthStore();
  const { data: cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">AURA</span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link href="/shop" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/shop' ? 'text-primary' : 'text-muted-foreground'}`}>
                Shop All
              </Link>
              <Link href="/shop?category=Cosmetics" className={`text-sm font-medium transition-colors hover:text-primary ${location.includes('Cosmetics') ? 'text-primary' : 'text-muted-foreground'}`}>
                Cosmetics
              </Link>
              <Link href="/shop?category=Mobile accessories" className={`text-sm font-medium transition-colors hover:text-primary ${location.includes('Mobile') ? 'text-primary' : 'text-muted-foreground'}`}>
                Tech
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                      <LayoutDashboard className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                
                <Link href="/orders">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hidden sm:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>

                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <ShoppingBag className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" onClick={() => logout()} className="text-muted-foreground hover:text-destructive hidden sm:flex">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="rounded-full px-6 bg-foreground text-background hover:bg-foreground/90">
                  Sign In
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link href="/shop" className="block text-sm font-medium text-foreground">Shop All</Link>
          <Link href="/shop?category=Cosmetics" className="block text-sm font-medium text-foreground">Cosmetics</Link>
          <Link href="/shop?category=Mobile accessories" className="block text-sm font-medium text-foreground">Tech</Link>
          {user && (
            <>
              <Link href="/orders" className="block text-sm font-medium text-foreground">My Orders</Link>
              <button onClick={() => logout()} className="block text-sm font-medium text-destructive">Sign Out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
