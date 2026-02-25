import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { useAuthStore } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product detail
    if (!user) {
      toast({ title: "Please sign in", description: "You need to log in to add items to your cart." });
      return;
    }
    addToCart({ productId: product._id, quantity: 1 }, {
      onSuccess: () => {
        toast({ title: "Added to cart", description: `${product.name} has been added.` });
      }
    });
  };

  return (
    <Link href={`/product/${product._id}`} className="group block">
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm hover:shadow-xl hover:border-border transition-all duration-300 h-full flex flex-col">
        <div className="aspect-square overflow-hidden bg-secondary relative">
          {product.stock <= 0 && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded-md z-10">
              OUT OF STOCK
            </div>
          )}
          <img 
            src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"} 
            alt={product.name} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{product.category}</p>
          <h3 className="font-display text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-2 mb-4 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            <Button 
              size="icon" 
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
              onClick={handleAddToCart}
              disabled={isPending || product.stock <= 0}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
