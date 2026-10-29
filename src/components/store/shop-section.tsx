'use client'

import { useMemo, useState } from "react";
import {
  categories,
  products,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

interface ShopSectionProps {
  onProductClick: (product: Product) => void;
  initialCategory?: ProductCategory | "all";
}

export function ShopSection({
  onProductClick,
  initialCategory = "all",
}: ShopSectionProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    initialCategory
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Count products per category
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: products.length };
    for (const cat of categories) {
      c[cat.id] = products.filter((p) => p.category === cat.id).length;
    }
    return c;
  }, []);

  return (
    <section id="shop" className="bg-[#FAF7F2] px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12 max-w-2xl">
          <p className="brand-eyebrow mb-2">All products</p>
          <h2 className="brand-section-title text-3xl md:text-5xl text-[#1A1614] mb-3">
            Shop the catalog.
          </h2>
          <p className="text-sm md:text-base text-[#6E6258] leading-relaxed">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} ·
            Filter by category to narrow down.
          </p>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-full border transition-colors",
              activeCategory === "all"
                ? "bg-[#1A1614] text-[#FAF7F2] border-[#1A1614]"
                : "bg-transparent text-[#6E6258] border-[#C9BBA3] hover:border-[#1A1614] hover:text-[#1A1614]"
            )}
          >
            All ({counts.all})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-full border transition-colors",
                activeCategory === cat.id
                  ? "bg-[#1A1614] text-[#FAF7F2] border-[#1A1614]"
                  : "bg-transparent text-[#6E6258] border-[#C9BBA3] hover:border-[#1A1614] hover:text-[#1A1614]"
              )}
            >
              {cat.name} ({counts[cat.id]})
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={onProductClick} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-[#6E6258] italic">
              No products in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
