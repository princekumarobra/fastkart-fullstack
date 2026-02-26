import { Navbar } from "@/components/layout/Navbar";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Shipping Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <h2 className="text-2xl font-bold mt-8 mb-4">Order Processing</h2>
          <p>All orders are processed within <strong>1-2 business days</strong>. Orders are not shipped or delivered on weekends or holidays.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Delivery Timeline</h2>
          <p>Delivery typically takes <strong>3-7 business days</strong> across India. Please note that delivery times may vary based on your location and the courier service.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Potential Delays</h2>
          <p>Occasionally, delays may occur due to courier issues, public holidays, or extreme weather conditions. We appreciate your patience during such times.</p>
        </div>
      </main>
    </div>
  );
}
