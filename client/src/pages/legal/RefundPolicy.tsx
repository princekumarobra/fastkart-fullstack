import { Navbar } from "@/components/layout/Navbar";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Refund and Return Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>Thank you for shopping at Fastkart Store. If you are not entirely satisfied with your purchase, we're here to help.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Return Policy</h2>
          <p>We offer a <strong>7-day return policy</strong> from the date of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Refund Processing</h2>
          <p>Once we receive and inspect your return, we will process your refund within <strong>5-7 business days</strong>. The refund will be credited to your original payment method.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Exclusions</h2>
          <p>We do not offer refunds or returns for items that are damaged or misused after delivery.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">COD Refunds</h2>
          <p>For Cash on Delivery (COD) orders, refunds will be processed via bank transfer. You will be required to provide your bank account details securely.</p>
        </div>
      </main>
    </div>
  );
}
