import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>At Fastkart Store, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your data.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Collection</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes your name, email address, phone number, and shipping address.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Payment Processing</h2>
          <p>All payments are processed securely via <strong>Razorpay</strong>. We do not store your credit card or sensitive payment details on our servers.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Cookies Usage</h2>
          <p>We use cookies to improve your browsing experience, remember your cart, and analyze our traffic. You can choose to disable cookies in your browser settings.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Services</h2>
          <p>We may share your data with trusted third-party services for shipping and payment processing purposes only.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Data Protection</h2>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
        </div>
      </main>
    </div>
  );
}
