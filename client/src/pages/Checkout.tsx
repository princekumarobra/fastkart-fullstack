import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { useCreateOrder, useVerifyPayment } from "@/hooks/use-orders";
import { useAuthStore } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const { data: cart } = useCart();
  const { data: productsData } = useProducts({ limit: 100 });
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();
  
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart?.items.reduce((acc, item) => {
    const p = productsData?.products.find(p => p._id === item.productId);
    return acc + ((p?.price || 0) * item.quantity);
  }, 0) || 0;
  const total = subtotal + (subtotal * 0.1); // add 10% tax

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderRes = await createOrder.mutateAsync({ paymentMethod });
      
      if (paymentMethod === "cod") {
        setIsSuccess(true);
        setTimeout(() => setLocation("/orders"), 2000);
      } else {
        // Online Payment via Razorpay
        const res = await loadRazorpayScript();
        if (!res) throw new Error("Razorpay SDK failed to load");

        // The Razorpay mock checkout options
        const options = {
          key: "dummy_key", // Usually comes from env or API
          amount: Math.round(total * 100),
          currency: "INR",
          name: "Fastkart Store",
          description: "Premium Purchase",
          order_id: orderRes.razorpayOrderId,
          handler: async function (response: any) {
            try {
              await verifyPayment.mutateAsync({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
              setIsSuccess(true);
              setTimeout(() => setLocation("/orders"), 2000);
            } catch (err) {
              toast({ variant: "destructive", title: "Verification failed" });
              setIsProcessing(false);
            }
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: {
            color: "#059669" // Emerald 600
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function () {
          toast({ variant: "destructive", title: "Payment failed" });
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Order failed", description: error.message });
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8">Thank you for shopping with AURA. Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Payment Method */}
          <div className="flex-1">
            <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm mb-8">
              <h3 className="font-display text-2xl font-bold mb-6">Payment Method</h3>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="space-y-4">
                <Label htmlFor="online" className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <RadioGroupItem value="online" id="online" className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'online' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {paymentMethod === 'online' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <CreditCard className="w-6 h-6 text-foreground" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-base">Pay Online (Razorpay)</p>
                    <p className="text-sm text-muted-foreground">Credit Card, UPI, NetBanking</p>
                  </div>
                </Label>

                <Label htmlFor="cod" className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <RadioGroupItem value="cod" id="cod" className="sr-only" />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <Truck className="w-6 h-6 text-foreground" />
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-base">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-secondary rounded-3xl p-8 sticky top-24">
              <h3 className="font-display text-2xl font-bold mb-6">Order Total</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%)</span>
                  <span className="text-foreground">${(subtotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-4"></div>
                <div className="flex justify-between text-2xl font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full py-6 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90"
                onClick={handlePlaceOrder}
                disabled={isProcessing || total === 0}
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
