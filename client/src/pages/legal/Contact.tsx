import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Message Sent", description: "We'll get back to you soon!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="font-display text-4xl font-bold mb-8 text-center">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-8">Have questions? We'd love to hear from you. Send us a message below or email us at <strong>fastkartupdate1@gmail.com</strong></p>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input 
              required 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="Your Email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea 
              required 
              rows={5} 
              value={formData.message} 
              onChange={e => setFormData({...formData, message: e.target.value})} 
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </main>
    </div>
  );
}
