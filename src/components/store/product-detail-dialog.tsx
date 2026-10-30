'use client'

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getColorwayClass,
  getTextColorway,
  getColorwayLabel,
  type Product,
} from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#FAF7F2] border-[#C9BBA3] rounded-none">
        {product && (
          <ProductDetailContent
            key={product.id}
            product={product}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ProductDetailContentProps {
  product: Product;
  onClose: () => void;
}

function ProductDetailContent({ product, onClose }: ProductDetailContentProps) {
  const cart = useCart();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const swatchClass = getColorwayClass(product.colorway);
  const textColor = getTextColorway(product.colorway);
  const colorwayLabel = getColorwayLabel(product.colorway);

  const handleAddToCart = () => {
    cart.addItem(product, selectedSize, quantity);
    toast({
      title: "Added to bag",
      description: `${product.name} — ${colorwayLabel} · ${selectedSize} × ${quantity}`,
    });
    onClose();
  };

  return (
    <div className="grid md:grid-cols-2">
      {/* Left: large color block */}
      <div className={cn("relative aspect-square md:aspect-auto md:h-full min-h-[400px]", swatchClass)}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <span
            className="font-serif font-black text-5xl md:text-7xl tracking-tight"
            style={{ color: textColor, opacity: 0.95 }}
          >
            FORGE<span style={{ color: "#8B5A3C", opacity: 0.85 }}>.</span>
          </span>
        </div>
        {product.hero && (
          <span className="absolute top-4 left-4 inline-flex items-center bg-[#FAF7F2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B5A3C]">
            Hero SKU
          </span>
        )}
      </div>

      {/* Right: details */}
      <div className="p-6 md:p-8 flex flex-col">
        <DialogHeader className="space-y-2 mb-2 p-0 text-left">
          <p className="brand-eyebrow text-[#8B5A3C]">{colorwayLabel}</p>
          <DialogTitle className="font-serif text-2xl md:text-3xl font-bold text-[#1A1614] leading-tight p-0">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-base text-[#6E6258] p-0">
            PKR {product.price.toLocaleString("en-PK")}
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-[#1A1614] leading-relaxed mt-4 mb-6">
          {product.description}
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 mb-6 py-4 border-y border-[#C9BBA3]">
          <div>
            <p className="brand-eyebrow text-[#6E6258] mb-1">Fabric</p>
            <p className="text-xs text-[#1A1614] font-semibold">{product.fabric}</p>
          </div>
          {product.gsm && (
            <div>
              <p className="brand-eyebrow text-[#6E6258] mb-1">Weight</p>
              <p className="text-xs text-[#1A1614] font-semibold">{product.gsm} GSM</p>
            </div>
          )}
        </div>

        {/* Size selector */}
        {product.sizes.length > 1 && (
          <div className="mb-6">
            <p className="brand-eyebrow text-[#6E6258] mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-12 h-10 px-3 text-xs font-semibold uppercase tracking-[0.1em] border transition-colors",
                    selectedSize === size
                      ? "bg-[#1A1614] text-[#FAF7F2] border-[#1A1614]"
                      : "bg-transparent text-[#1A1614] border-[#C9BBA3] hover:border-[#1A1614]"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <p className="brand-eyebrow text-[#6E6258] mb-2">Quantity</p>
          <div className="inline-flex items-center border border-[#C9BBA3]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-10 w-10 flex items-center justify-center text-[#1A1614] hover:bg-[#F2EDE4]"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-[#1A1614]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              className="h-10 w-10 flex items-center justify-center text-[#1A1614] hover:bg-[#F2EDE4]"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="w-full bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none h-12 gap-2 mt-auto"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Bag — PKR {(product.price * quantity).toLocaleString("en-PK")}
        </Button>

        {/* Trust line */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-[#6E6258]">
          <Check className="h-3 w-3 text-[#6B7A4F]" />
          <span>Pre-shrunk · GSM-disclosed · Free shipping over PKR 5,000</span>
        </div>
      </div>
    </div>
  );
}
