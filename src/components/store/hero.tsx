'use client'

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative hero-grain bg-[#FAF7F2] px-4 md:px-8 pt-20 pb-24 md:pt-32 md:pb-36">
      <div className="mx-auto max-w-7xl">
        {/* Edition label */}
        <div className="flex items-center justify-between mb-12 md:mb-16">
          <span className="brand-eyebrow text-[#6E6258]">
            FORGE / Brand Launch / 2026
          </span>
          <span className="hidden md:inline brand-eyebrow text-[#6E6258]">
            Lahore · Pakistan
          </span>
        </div>

        {/* Wordmark */}
        <h1 className="brand-wordmark text-[18vw] md:text-[12vw] lg:text-[10rem] leading-[0.85] text-[#1A1614]">
          FORGE<span className="period">.</span>
        </h1>

        {/* Rule */}
        <div className="brand-divider mt-6 md:mt-8 mb-8" />

        {/* Tagline */}
        <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-[#8B5A3C] leading-tight max-w-3xl">
          Forged for the everyday.
        </p>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-sm md:text-base text-[#1A1614] leading-relaxed">
          A minimal-premium everyday apparel brand from Lahore. Hoodies, tees,
          sweatshirts, polos, mugs, and notebooks — built to be re-worn 100+
          washes, in earth tones inspired by the Pakistani forge.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none px-8"
          >
            <a href="#shop" className="flex items-center gap-2">
              Shop the Collection
              <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#1A1614] text-[#1A1614] hover:bg-[#F2EDE4] rounded-none px-8"
          >
            <a href="#about" className="flex items-center gap-2">
              The Brand Story
            </a>
          </Button>
        </div>

        {/* Meta */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl border-t border-[#C9BBA3] pt-8">
          <div>
            <p className="brand-eyebrow text-[#6E6258] mb-2">Founded</p>
            <p className="text-sm font-bold text-[#1A1614]">Lahore / 2026</p>
          </div>
          <div>
            <p className="brand-eyebrow text-[#6E6258] mb-2">Categories</p>
            <p className="text-sm font-bold text-[#1A1614]">10 product lines</p>
          </div>
          <div>
            <p className="brand-eyebrow text-[#6E6258] mb-2">Price tier</p>
            <p className="text-sm font-bold text-[#1A1614]">PKR 700–5,500</p>
          </div>
        </div>
      </div>
    </section>
  );
}
