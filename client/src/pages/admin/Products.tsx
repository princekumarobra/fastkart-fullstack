import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useProducts, useDeleteProduct, useBulkUploadProducts, useCreateProduct } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Upload, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const { data, isLoading } = useProducts({ limit: 100 });
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: uploadCsv, isPending: isUploading } = useBulkUploadProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", category: "", image: "", stock: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct({
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock)
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        toast({ title: "Product created successfully" });
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCsv(file, {
        onSuccess: (res) => toast({ title: "Upload complete", description: res.message }),
        onError: (err) => toast({ variant: "destructive", title: "Upload failed", description: err.message })
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Products</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Input 
                type="file" 
                accept=".csv" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> {isUploading ? "Uploading..." : "Import CSV"}
              </Button>
            </div>
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                  <Input placeholder="Product Name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <Input placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                  <div className="flex gap-4">
                    <Input type="number" step="0.01" placeholder="Price" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                    <Input type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  </div>
                  <Input placeholder="Image URL" required value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                  <Input placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  <Button type="submit" className="w-full" disabled={isCreating}>Create Product</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-sm text-muted-foreground font-medium uppercase tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : data?.products.map(product => (
                <tr key={product._id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-semibold">{product.name}</span>
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4 font-medium">${product.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                      {product.stock} left
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteProduct(product._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
