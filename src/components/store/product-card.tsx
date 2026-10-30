'use client'

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  getColorwayClass,
  getColorwayHex,
  getTextColorway,
  type Product,
} from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onOpen?: (product: Product) => void;
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  const cart = useCart();
  const { toast } = useToast();

  const swatchClass = getColorwayClass(product.colorway);
  const textColor = getTextColorway(product.colorway);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1) {
      onOpen?.(product);
      return;
    }
    // Single-size product (mugs, notebooks): add directly
    cart.addItem(product, product.sizes[0], 1);
    toast({
      title: "Added to bag",
      description: `${product.name} — ${product.sizes[0]}`,
    });
  };

  return (
    <article
      onClick={() => onOpen?.(product)}
      className="group cursor-pointer"
    >
      {/* Color block visual */}
      <div
        className={cn(
          "relative aspect-[4/5] w-full overflow-hidden",
          swatchClass
        )}
      >
        {/* Wordmark overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <span
            className="font-serif font-black text-2xl md:text-3xl lg:text-4xl tracking-tight"
            style={{ color: textColor, opacity: 0.92 }}
          >
            FORGE<span style={{ color: "#8B5A3C", opacity: 0.85 }}>.</span>
          </span>
        </div>

        {/* Hero badge */}
        {product.hero && (
          <span className="absolute top-3 left-3 inline-flex items-center bg-[#FAF7F2] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8B5A3C]">
            Hero
          </span>
        )}

        {/* Quick add button — appears on hover */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#1A1614] opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-[#8B5A3C] hover:text-[#FAF7F2]"
          aria-label="Add to bag"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-sm md:text-base font-bold text-[#1A1614] leading-snug">
            {product.name}
          </h3>
          <span className="text-xs md:text-sm font-semibold text-[#1A1614] whitespace-nowrap">
            PKR {product.price.toLocaleString("en-PK")}
          </span>
        </div>
        <p className="text-[11px] text-[#6E6258]">
          {product.fabric}
          {product.gsm ? ` · ${product.gsm} GSM` : ""}
        </p>
      </div>
    </article>
  );
}
