'use client'

import { useState } from "react";
import { SiteHeader } from "@/components/store/site-header";
import { Hero } from "@/components/store/hero";
import { FeaturedCollection } from "@/components/store/featured-collection";
import { CategorySection } from "@/components/store/category-section";
import { ShopSection } from "@/components/store/shop-section";
import { ProductDetailDialog } from "@/components/store/product-detail-dialog";
import { CartSheet } from "@/components/store/cart-sheet";
import { AboutSection } from "@/components/store/about-section";
import { Newsletter } from "@/components/store/newsletter";
import { SiteFooter } from "@/components/store/site-footer";
import type { Product, ProductCategory } from "@/lib/products";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shopInitialCategory, setShopInitialCategory] = useState<
    ProductCategory | "all"
  >("all");

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSelectCategory = (id: ProductCategory) => {
    setShopInitialCategory(id);
    // Smooth-scroll to shop after a tick
    setTimeout(() => {
      const el = document.getElementById("shop");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="app-shell bg-background text-foreground">
      <SiteHeader />

      <main className="app-main">
        <Hero />
        <FeaturedCollection onProductClick={handleProductClick} />
        <CategorySection onSelectCategory={handleSelectCategory} />
        <ShopSection
          key={shopInitialCategory}
          onProductClick={handleProductClick}
          initialCategory={shopInitialCategory}
        />
        <AboutSection />
        <Newsletter />
      </main>

      <SiteFooter />

      {/* Overlays */}
      <ProductDetailDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      <CartSheet />
    </div>
  );
}
