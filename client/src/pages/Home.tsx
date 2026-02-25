import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Link } from "wouter";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data, isLoading } = useProducts({ limit: 4 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-foreground text-background py-24 sm:py-32">
          {/* <!-- abstract elegant gradient background --> */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Curated essentials for the <span className="text-primary">modern lifestyle</span>.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl">
                Discover our meticulously selected collection of tech accessories, premium cosmetics, and minimalist home goods.
              </p>
              <Link href="/shop">
                <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                  Shop the Collection <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 border-b border-border bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Premium Quality</h4>
                  <p className="text-sm text-muted-foreground">Ethically sourced materials</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Secure Checkout</h4>
                  <p className="text-sm text-muted-foreground">100% protected payments</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary p-3 rounded-2xl">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Fast Dispatch</h4>
                  <p className="text-sm text-muted-foreground">Orders ship within 24hrs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">New Arrivals</h2>
                <p className="text-muted-foreground mt-2">The latest additions to our store.</p>
              </div>
              <Link href="/shop" className="hidden sm:flex text-primary font-semibold hover:underline items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-secondary animate-pulse rounded-2xl h-[400px]"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data?.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            <div className="mt-10 sm:hidden">
              <Link href="/shop" className="w-full block text-center bg-secondary py-3 rounded-xl font-semibold">
                View all products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
