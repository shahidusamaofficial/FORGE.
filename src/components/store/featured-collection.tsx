'use client'

import { getHeroProducts, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";

interface FeaturedCollectionProps {
  onProductClick: (product: Product) => void;
}

export function FeaturedCollection({ onProductClick }: FeaturedCollectionProps) {
  const heroProducts = getHeroProducts();

  return (
    <section className="bg-[#FAF7F2] px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="brand-eyebrow mb-2">Featured</p>
            <h2 className="brand-section-title text-3xl md:text-5xl text-[#1A1614]">
              Hero pieces.
            </h2>
          </div>
          <p className="hidden md:block text-xs text-[#6E6258] max-w-xs text-right">
            One hero SKU per category. The colorway and construction we believe in most.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {heroProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onProductClick} />
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 md:mt-16 border-t border-[#C9BBA3] pt-6 flex items-center justify-between">
          <p className="text-xs text-[#6E6258]">
            All hero SKUs available in 3–4 colorways · Pre-shrunk · GSM-disclosed
          </p>
          <a
            href="#shop"
            className="text-xs font-bold uppercase tracking-[0.16em] text-[#8B5A3C] hover:text-[#1A1614] transition-colors"
          >
            Shop all →
          </a>
        </div>
      </div>
    </section>
  );
}
