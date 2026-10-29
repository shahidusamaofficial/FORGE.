'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // In a real app: POST to /api/newsletter
    setSubmitted(true);
    toast({
      title: "Subscribed.",
      description: "You'll hear from us at the next drop. No spam, ever.",
    });
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="newsletter" className="bg-[#FAF7F2] px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="brand-eyebrow text-[#8B5A3C] mb-3">
          Stay in the forge
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1A1614] mb-4 leading-tight">
          One email per drop.
        </h2>
        <p className="text-sm md:text-base text-[#6E6258] mb-8 max-w-xl mx-auto leading-relaxed">
          New product drops, behind-the-scenes from the Faisalabad mills, and
          occasional notes from the founder. No spam, no daily deals, no countdown timers. Unsubscribe anytime.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 h-12 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
          />
          <Button
            type="submit"
            size="lg"
            className="h-12 bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none px-6 gap-2 group"
          >
            {submitted ? "Subscribed ✓" : "Subscribe"}
            {!submitted && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <p className="mt-4 text-[10px] text-[#6E6258]">
          By subscribing, you agree to receive marketing emails from FORGE. We send 1–2 emails per month.
        </p>
      </div>
    </section>
  );
}
