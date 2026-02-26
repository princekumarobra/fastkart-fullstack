import { Navbar } from "@/components/layout/Navbar";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Terms and Conditions</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>Welcome to Fastkart Store. By accessing our website, you agree to be bound by these terms and conditions.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Use of Service</h2>
          <p>Our service allows you to browse and purchase various products. You agree to use the service only for lawful purposes.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Accounts</h2>
          <p>When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, and images, is the property of Fastkart Store and is protected by intellectual property laws.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
          <p>We reserve the right to terminate or suspend your access to our service immediately, without prior notice, for any reason whatsoever.</p>
        </div>
      </main>
    </div>
  );
}
