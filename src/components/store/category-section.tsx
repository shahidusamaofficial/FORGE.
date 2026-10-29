'use client'

import { ArrowRight } from "lucide-react";
import {
  categories,
  getColorwayClass,
  getTextColorway,
  type Category,
} from "@/lib/products";
import { cn } from "@/lib/utils";

interface CategorySectionProps {
  onSelectCategory: (id: Category["id"]) => void;
}

export function CategorySection({ onSelectCategory }: CategorySectionProps) {
  return (
    <section id="categories" className="bg-[#F2EDE4] px-4 md:px-8 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 md:mb-14 max-w-2xl">
          <p className="brand-eyebrow mb-2">Shop by category</p>
          <h2 className="brand-section-title text-3xl md:text-5xl text-[#1A1614] mb-4">
            Ten categories, one palette.
          </h2>
          <p className="text-sm md:text-base text-[#6E6258] leading-relaxed">
            Every AANGAN product is built on the same five-color earth-tone palette and
            the same construction philosophy. Pick a category to see its hero SKUs and
            full colorway range.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat) => {
            const swatchClass = getColorwayClass(cat.heroColor);
            const textColor = getTextColorway(cat.heroColor);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group text-left"
              >
                <div
                  className={cn(
                    "relative aspect-square overflow-hidden border border-[#C9BBA3]",
                    swatchClass
                  )}
                >
                  {/* Mini wordmark */}
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <span
                      className="font-serif font-black text-base md:text-lg tracking-tight"
                      style={{ color: textColor, opacity: 0.9 }}
                    >
                      aangan<span style={{ color: "#8B5A3C", opacity: 0.85 }}>.</span>
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF7F2] opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowRight className="h-3.5 w-3.5 text-[#1A1614]" />
                  </div>
                </div>
                <div className="mt-2.5 px-1">
                  <p className="font-serif text-sm font-bold text-[#1A1614] leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-[#6E6258] mt-0.5">
                    PKR {cat.priceRange[0].toLocaleString("en-PK")}–{cat.priceRange[1].toLocaleString("en-PK")}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
