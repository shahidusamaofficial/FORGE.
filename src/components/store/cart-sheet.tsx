'use client'

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { useView } from "@/lib/view-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { getColorwayClass, getTextColorway, getColorwayLabel } from "@/lib/products";
import { createOrder, type OrderItem } from "@/lib/data-access";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const cart = useCart();
  const auth = useAuth();
  const view = useView();
  const { toast } = useToast();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "success">("cart");
  const [emailInput, setEmailInput] = useState("");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = cart.getSubtotal();
  const totalItems = cart.getTotalItems();
  const freeShippingThreshold = 5000;
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = async () => {
    if (cart.items.length === 0) return;

    // If not logged in and no email entered, prompt
    if (!auth.user && !emailInput) {
      toast({
        title: "Email required",
        description: "Enter your email for guest checkout, or sign in for faster checkout.",
        variant: "destructive",
      });
      return;
    }

    setPlacing(true);

    // Build order items
    const orderItems: OrderItem[] = cart.items.map((item) => ({
      product_id: item.product.id,
      name: item.product.name,
      size: item.size,
      quantity: item.quantity,
      price: item.product.price,
      colorway: item.product.colorway,
    }));

    const email = auth.user?.email || emailInput;
    const userId = auth.user?.id || null;

    const { order, error } = await createOrder(orderItems, subtotal, email, userId);

    setPlacing(false);

    if (error) {
      toast({
        title: "Checkout failed",
        description: error,
        variant: "destructive",
      });
      return;
    }

    if (order) {
      setOrderId(order.id);
      setCheckoutStep("success");
      cart.clearCart();
    }
  };

  const handleClose = (open: boolean) => {
    cart.closeCart();
    if (!open) {
      setTimeout(() => {
        setCheckoutStep("cart");
        setEmailInput("");
        setOrderId(null);
      }, 300);
    }
  };

  return (
    <Sheet open={cart.isOpen} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#FAF7F2] p-0 border-l border-[#C9BBA3] flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b border-[#C9BBA3]">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="font-serif text-xl font-bold text-[#1A1614] p-0">
                Your Bag
              </SheetTitle>
              <SheetDescription className="text-xs text-[#6E6258] p-0">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </SheetDescription>
            </div>
            {cart.items.length > 0 && (
              <button
                onClick={() => cart.clearCart()}
                className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6E6258] hover:text-[#8B5A3C] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </SheetHeader>

        {checkoutStep === "success" ? (
          // Success state
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#6B7A4F] flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-[#FAF7F2]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1614] mb-2">
              Order placed.
            </h3>
            <p className="text-sm text-[#6E6258] mb-2 max-w-xs">
              {auth.user
                ? "Your order is saved to your account. You'll receive an email with tracking within 24 hours."
                : "Your order is confirmed. You'll receive an email with tracking within 24 hours."}
            </p>
            {orderId && (
              <p className="text-[10px] text-[#6E6258] font-mono mb-6">
                Order #{orderId.slice(0, 8).toUpperCase()}
              </p>
            )}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {auth.user && (
                <Button
                  onClick={() => {
                    handleClose(false);
                    view.goAccount();
                  }}
                  className="bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none"
                >
                  View order history
                </Button>
              )}
              <Button
                onClick={() => handleClose(false)}
                variant="outline"
                className="border-[#1A1614] text-[#1A1614] hover:bg-[#F2EDE4] rounded-none"
              >
                Continue shopping
              </Button>
            </div>
          </div>
        ) : cart.items.length === 0 ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#F2EDE4] flex items-center justify-center mb-4">
              <ShoppingBag className="h-7 w-7 text-[#6E6258]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A1614] mb-2">
              Your bag is empty.
            </h3>
            <p className="text-sm text-[#6E6258] mb-6 max-w-xs">
              Browse the catalog and pick a piece you&apos;d re-wear on an ordinary Tuesday.
            </p>
            <Button
              onClick={() => handleClose(false)}
              className="bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none px-8"
            >
              Start shopping
            </Button>
          </div>
        ) : (
          // Cart items + checkout
          <>
            {/* Free shipping progress */}
            <div className="px-6 py-3 bg-[#F2EDE4] border-b border-[#C9BBA3]">
              {subtotal < freeShippingThreshold ? (
                <p className="text-[11px] text-[#1A1614] mb-1.5">
                  Add{" "}
                  <span className="font-bold text-[#8B5A3C]">
                    PKR {(freeShippingThreshold - subtotal).toLocaleString("en-PK")}
                  </span>{" "}
                  more for free shipping
                </p>
              ) : (
                <p className="text-[11px] text-[#6B7A4F] font-semibold mb-1.5">
                  ✓ You&apos;ve unlocked free shipping!
                </p>
              )}
              <div className="h-1 w-full bg-[#C9BBA3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5A3C] transition-all"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto scroll-thin px-6 py-4 space-y-4">
              {cart.items.map((item) => {
                const swatchClass = getColorwayClass(item.product.colorway);
                const textColor = getTextColorway(item.product.colorway);
                const colorwayLabel = getColorwayLabel(item.product.colorway);

                return (
                  <div
                    key={item.key}
                    className="flex gap-3 pb-4 border-b border-[#C9BBA3] last:border-0"
                  >
                    <div
                      className={cn(
                        "relative h-24 w-20 flex-shrink-0 overflow-hidden",
                        swatchClass
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="font-serif font-black text-xs tracking-tight"
                          style={{ color: textColor, opacity: 0.9 }}
                        >
                          FORGE<span style={{ color: "#8B5A3C", opacity: 0.85 }}>.</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#1A1614] leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-[#6E6258] mt-0.5">
                            {colorwayLabel} · Size {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => cart.removeItem(item.key)}
                          className="text-[#6E6258] hover:text-[#90534D] transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center border border-[#C9BBA3]">
                          <button
                            onClick={() => cart.updateQuantity(item.key, item.quantity - 1)}
                            className="h-7 w-7 flex items-center justify-center text-[#1A1614] hover:bg-[#F2EDE4]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#1A1614]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => cart.updateQuantity(item.key, item.quantity + 1)}
                            className="h-7 w-7 flex items-center justify-center text-[#1A1614] hover:bg-[#F2EDE4]"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#1A1614]">
                          PKR {(item.product.price * item.quantity).toLocaleString("en-PK")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with optional guest email + checkout */}
            <div className="border-t border-[#C9BBA3] p-6 space-y-4 bg-[#FAF7F2]">
              {/* Guest email field if not logged in */}
              {!auth.user && (
                <div className="space-y-1.5">
                  <label className="brand-eyebrow text-[#6E6258] block">
                    Email for order confirmation
                  </label>
                  <Input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@email.com"
                    className="h-10 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] text-sm rounded-none focus-visible:ring-[#8B5A3C]"
                  />
                  <p className="text-[10px] text-[#6E6258]">
                    Or sign in for faster checkout and order history.
                  </p>
                </div>
              )}

              {/* Subtotal */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E6258]">
                  Subtotal
                </span>
                <span className="font-serif text-xl font-bold text-[#1A1614]">
                  PKR {subtotal.toLocaleString("en-PK")}
                </span>
              </div>
              <p className="text-[10px] text-[#6E6258]">
                Shipping and taxes calculated at checkout. Free shipping on orders over PKR 5,000.
              </p>

              {/* Checkout button */}
              <Button
                onClick={handleCheckout}
                size="lg"
                disabled={placing}
                className="w-full bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none h-12 gap-2 group"
              >
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    Checkout
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
