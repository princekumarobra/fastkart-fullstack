import { Navbar } from "@/components/layout/Navbar";

export default function RazorpayPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Razorpay Payment Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>We use <strong>Razorpay</strong> for secure and reliable payment processing on Fastkart Store.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Secure Payments</h2>
          <p>Razorpay is <strong>PCI-DSS compliant</strong>, ensuring your transaction data is encrypted and handled with the highest level of security.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">No Storage of Card Details</h2>
          <p>Fastkart Store does not store any of your credit card, debit card, or net banking credentials. All sensitive data is handled directly by Razorpay.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Refund Timeline</h2>
          <p>Once a refund is initiated by us, it typically takes <strong>5-7 business days</strong> to reflect in your original payment method.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Chargebacks</h2>
          <p>Any chargeback requests will be handled in accordance with the policies of the respective banks and Razorpay guidelines.</p>
        </div>
      </main>
    </div>
  );
}
