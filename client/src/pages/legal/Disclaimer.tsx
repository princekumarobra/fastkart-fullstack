import { Navbar } from "@/components/layout/Navbar";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">Disclaimer</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>The information provided by <strong>Fastkart Store</strong> on our website is for general informational purposes only.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Product Appearance</h2>
          <p>Product colors and appearance may vary slightly from the images shown on the website due to photographic lighting sources or your monitor settings. We do not guarantee an exact match of appearance.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Limitation of Liability</h2>
          <p>In no event shall Fastkart Store be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of the Service or the contents of the Service.</p>
          <p>Fastkart Store reserves the right to make additions, deletions, or modifications to the contents on the Service at any time without prior notice.</p>
        </div>
      </main>
    </div>
  );
}
