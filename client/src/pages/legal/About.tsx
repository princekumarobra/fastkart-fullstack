import { Navbar } from "@/components/layout/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-display text-4xl font-bold mb-8">About Fastkart Store</h1>
        <div className="prose prose-lg dark:prose-invert">
          <p>Welcome to <strong>Fastkart Store</strong>, your premier destination for high-quality, affordable products delivered across India.</p>
          <p>We are a dedicated all-India e-commerce store focused on customer satisfaction and excellence. Our mission is to provide you with the best experience, whether you're looking for mobile accessories, cosmetics, or home and kitchen essentials.</p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Our Values</h2>
          <ul>
            <li><strong>Quality:</strong> We handpick products that meet our high standards.</li>
            <li><strong>Affordability:</strong> Making quality products accessible to everyone.</li>
            <li><strong>Satisfaction:</strong> Our customers are at the heart of everything we do.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
