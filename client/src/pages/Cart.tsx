import { Navbar } from "@/components/layout/Navbar";
import { useCart, useRemoveFromCart, useAddToCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Cart() {
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 100 });
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: updateQuantity, isPending: isUpdating } = useAddToCart(); // add endpoint handles quantity updates too

  const isBusy = isRemoving || isUpdating;

  // Enhance cart items with product details
  const enhancedItems = cart?.items.map(item => {
    const product = productsData?.products.find(p => p._id === item.productId);
    return { ...item, product };
  }).filter(item => item.product) || [];

  const subtotal = enhancedItems.reduce((acc, item) => acc + (item.product!.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% dummy tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {isCartLoading || isProductsLoading ? (
          <div className="animate-pulse flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-6"><div className="h-32 bg-secondary rounded-2xl"></div></div>
            <div className="w-full lg:w-[400px] h-80 bg-secondary rounded-3xl"></div>
          </div>
        ) : enhancedItems.length === 0 ? (
          <div className="text-center py-32 bg-card rounded-3xl border border-border border-dashed">
            <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 text-muted-foreground">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-display text-3xl font-bold text-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground mt-4 mb-8 text-lg">Looks like you haven't added anything yet.</p>
            <Link href="/shop">
              <Button className="rounded-full px-8 py-6 text-lg bg-foreground text-background hover:bg-foreground/90">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Cart Items */}
            <div className="flex-1 w-full space-y-6">
              {enhancedItems.map((item) => (
                <div key={item.productId} className="flex gap-6 p-6 bg-card rounded-3xl border border-border/50 shadow-sm">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-2xl overflow-hidden shrink-0">
                    <img src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.product!.category}</p>
                        <h3 className="font-display text-lg font-bold text-foreground line-clamp-1">{item.product!.name}</h3>
                      </div>
                      <span className="font-bold text-lg">${item.product!.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-4 bg-secondary rounded-full px-2 py-1">
                        <button 
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors disabled:opacity-50"
                          onClick={() => updateQuantity({ productId: item.productId, quantity: item.quantity - 1 })}
                          disabled={item.quantity <= 1 || isBusy}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold w-4 text-center">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-background text-foreground transition-colors disabled:opacity-50"
                          onClick={() => updateQuantity({ productId: item.productId, quantity: item.quantity + 1 })}
                          disabled={isBusy}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        className="text-muted-foreground hover:text-destructive transition-colors p-2 disabled:opacity-50"
                        onClick={() => removeFromCart(item.productId)}
                        disabled={isBusy}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[400px] bg-foreground text-background rounded-3xl p-8 sticky top-24 shadow-2xl shadow-foreground/10">
              <h3 className="font-display text-2xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-background/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-background/80">
                  <span>Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-background/80">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="h-px bg-background/20 my-4"></div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full py-6 rounded-xl text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
