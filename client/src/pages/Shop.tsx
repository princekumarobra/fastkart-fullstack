import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get("category") || "");
  }, [location]);

  const { data, isLoading } = useProducts({ 
    category: category || undefined, 
    search: debouncedSearch,
    page,
    limit: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchTerm);
    setPage(1);
  };

  const categories = ["Mobile accessories", "Cosmetics", "Home & kitchen"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              {category || "Shop All"}
            </h1>
            <p className="text-muted-foreground">Find the perfect products for your lifestyle.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10 rounded-full bg-secondary border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Categories
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => { setCategory(""); setPage(1); }}
                  className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`block w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-96 bg-secondary animate-pulse rounded-3xl"></div>
                ))}
              </div>
            ) : data?.products.length === 0 ? (
              <div className="text-center py-24 bg-secondary/30 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {data?.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                {data && data.pages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                        className="w-10 h-10 p-0 rounded-full"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
