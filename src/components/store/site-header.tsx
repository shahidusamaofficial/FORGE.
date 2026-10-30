'use client'

import { ShoppingBag, Menu, User, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { useView } from "@/lib/view-store";
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
import { isSupabaseConfigured } from "@/lib/supabase";

export function SiteHeader() {
  const cart = useCart();
  const auth = useAuth();
  const view = useView();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const itemCount = cart.getTotalItems();
  const supabaseReady = isSupabaseConfigured();

  const navLinks = [
    { label: "Shop", href: "#shop", action: () => view.goHome() },
    { label: "Categories", href: "#categories", action: () => view.goHome() },
    { label: "About", href: "#about", action: () => view.goHome() },
    { label: "Newsletter", href: "#newsletter", action: () => view.goHome() },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C9BBA3] bg-[#FAF7F2]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FAF7F2]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Wordmark */}
        <button
          onClick={() => view.goHome()}
          className="brand-wordmark text-2xl md:text-3xl text-[#1A1614] hover:opacity-80 transition-opacity"
        >
          FORGE<span className="period">.</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={view.currentView === "home" ? link.href : undefined}
              onClick={(e) => {
                if (view.currentView !== "home") {
                  e.preventDefault();
                  view.goHome();
                  setTimeout(() => {
                    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6E6258] hover:text-[#8B5A3C] transition-colors cursor-pointer"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Auth: account icon or sign in button */}
          {supabaseReady && (
            <>
              {auth.user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => view.goAccount()}
                  className="gap-2 px-3 text-[#1A1614] hover:bg-[#F2EDE4] hover:text-[#8B5A3C]"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.16em]">
                    {auth.profile?.full_name?.split(" ")[0] || "Account"}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthOpen(true)}
                  className="gap-2 px-3 text-[#1A1614] hover:bg-[#F2EDE4] hover:text-[#8B5A3C]"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold uppercase tracking-[0.16em]">
                    Sign In
                  </span>
                </Button>
              )}
            </>
          )}

          {/* Cart */}
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
                    onClick={() => {
                      setMobileOpen(false);
                      if (view.currentView !== "home") {
                        link.action();
                      }
                    }}
                    className="font-serif text-xl text-[#1A1614] hover:text-[#8B5A3C] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {supabaseReady && (
                  <>
                    <hr className="border-[#C9BBA3] my-2" />
                    {auth.user ? (
                      <>
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            view.goAccount();
                          }}
                          className="text-left font-serif text-xl text-[#1A1614] hover:text-[#8B5A3C] transition-colors"
                        >
                          My Account
                        </button>
                        <button
                          onClick={() => {
                            setMobileOpen(false);
                            auth.signOut();
                          }}
                          className="text-left font-serif text-xl text-[#6E6258] hover:text-[#90534D] transition-colors flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileOpen(false);
                          setAuthOpen(true);
                        }}
                        className="text-left font-serif text-xl text-[#1A1614] hover:text-[#8B5A3C] transition-colors"
                      >
                        Sign In
                      </button>
                    )}
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth modal (rendered at header level) */}
      {supabaseReady && (
        <AuthModalLazy open={authOpen} onOpenChange={setAuthOpen} />
      )}
    </header>
  );
}

// Lazy import to avoid SSR issues if AuthModal isn't loaded yet
import { AuthModal } from "./auth-modal";
function AuthModalLazy({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return <AuthModal open={open} onOpenChange={onOpenChange} />;
}
