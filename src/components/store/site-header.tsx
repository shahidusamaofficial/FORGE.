'use client'

import { ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";

export function SiteHeader() {
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = cart.getTotalItems();

  const navLinks = [
    { label: "Shop", href: "#shop" },
    { label: "Categories", href: "#categories" },
    { label: "About", href: "#about" },
    { label: "Newsletter", href: "#newsletter" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C9BBA3] bg-[#FAF7F2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAF7F2]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Wordmark */}
        <Link href="/" className="brand-wordmark text-2xl md:text-3xl text-[#1A1614] hover:opacity-80 transition-opacity">
          FORGE<span className="period">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E6258] hover:text-[#8B5A3C] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => cart.openCart()}
            className="relative gap-2 px-3 text-[#1A1614] hover:bg-[#F2EDE4] hover:text-[#8B5A3C]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.16em]">
              Bag
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#8B5A3C] px-1.5 text-[10px] font-bold text-[#FAF7F2]">
                {itemCount}
              </span>
            )}
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden p-2 text-[#1A1614]">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[#FAF7F2]">
              <SheetHeader>
                <SheetTitle className="brand-wordmark text-2xl text-[#1A1614]">
                  FORGE<span className="period">.</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-serif text-xl text-[#1A1614] hover:text-[#8B5A3C] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
