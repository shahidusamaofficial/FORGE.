'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { useView } from "@/lib/view-store";
import { getUserOrders, type Order } from "@/lib/data-access";
import { Package, ArrowLeft, Loader2 } from "lucide-react";
import { getColorwayClass, getTextColorway, getColorwayLabel } from "@/lib/products";
import { cn } from "@/lib/utils";

export function AccountView() {
  const { user, profile, signOut } = useAuth();
  const { goHome } = useView();

  if (!user) {
    return (
      <div className="px-4 md:px-8 py-24 md:py-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1A1614] mb-4">
            Sign in to view your account.
          </h1>
          <p className="text-sm text-[#6E6258] mb-8">
            Your order history, saved cart, and account details live here.
          </p>
          <Button
            onClick={goHome}
            className="bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none px-8"
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-12 md:py-16 bg-[#FAF7F2] min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <button
          onClick={goHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#6E6258] hover:text-[#8B5A3C] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to shop
        </button>

        {/* Header */}
        <div className="mb-12 border-b border-[#C9BBA3] pb-8">
          <p className="brand-eyebrow text-[#8B5A3C] mb-2">Account</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1614] mb-2">
            Hello, {profile?.full_name || user.email?.split("@")[0]}.
          </h1>
          <p className="text-sm text-[#6E6258]">{user.email}</p>
          {profile?.is_admin && (
            <span className="mt-3 inline-flex items-center bg-[#8B5A3C] text-[#FAF7F2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
              Admin
            </span>
          )}
        </div>

        {/* Sign out */}
        <div className="mb-12 flex justify-end">
          <Button
            onClick={() => {
              signOut();
              goHome();
            }}
            variant="outline"
            size="sm"
            className="border-[#1A1614] text-[#1A1614] hover:bg-[#F2EDE4] rounded-none"
          >
            Sign Out
          </Button>
        </div>

        {/* Orders list (child component handles its own loading state) */}
        <OrdersList userId={user.id} onGoHome={goHome} />
      </div>
    </div>
  );
}

interface OrdersListProps {
  userId: string;
  onGoHome: () => void;
}

function OrdersList({ userId, onGoHome }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getUserOrders(userId)
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[#8B5A3C]" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1614] mb-6">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#C9BBA3] bg-[#F2EDE4]">
          <Package className="h-10 w-10 text-[#6E6258] mx-auto mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#1A1614] mb-2">
            No orders yet.
          </h3>
          <p className="text-sm text-[#6E6258] mb-6 max-w-sm mx-auto">
            When you place your first order, it will appear here with tracking details.
          </p>
          <Button
            onClick={onGoHome}
            className="bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none px-8"
          >
            Start shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-[#C9BBA3] bg-[#FAF7F2] overflow-hidden">
      <div className="bg-[#F2EDE4] px-5 py-3 border-b border-[#C9BBA3] flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6E6258]">
            Order
          </p>
          <p className="font-mono text-xs text-[#1A1614]">
            #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6E6258]">
            Date
          </p>
          <p className="text-xs text-[#1A1614]">
            {new Date(order.created_at).toLocaleDateString("en-PK", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6E6258]">
            Total
          </p>
          <p className="font-serif text-base font-bold text-[#1A1614]">
            PKR {order.subtotal.toLocaleString("en-PK")}
          </p>
        </div>
        <div>
          <span
            className={cn(
              "inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
              order.status === "delivered"
                ? "bg-[#6B7A4F] text-[#FAF7F2]"
                : order.status === "shipped"
                ? "bg-[#8B5A3C] text-[#FAF7F2]"
                : "bg-[#F2EDE4] text-[#6E6258] border border-[#C9BBA3]"
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {order.items.map((item, idx) => {
          const swatchClass = getColorwayClass(item.colorway);
          const textColor = getTextColorway(item.colorway);
          return (
            <div
              key={`${item.product_id}-${item.size}-${idx}`}
              className="flex items-center gap-3 pb-3 last:border-0 last:pb-0 border-b border-[#C9BBA3]"
            >
              <div
                className={cn(
                  "relative h-16 w-14 flex-shrink-0 overflow-hidden",
                  swatchClass
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-serif font-black text-[10px] tracking-tight"
                    style={{ color: textColor, opacity: 0.9 }}
                  >
                    FORGE.
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-serif text-sm font-bold text-[#1A1614]">
                  {item.name}
                </p>
                <p className="text-[11px] text-[#6E6258] mt-0.5">
                  {getColorwayLabel(item.colorway)} · Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#1A1614]">
                PKR {(item.price * item.quantity).toLocaleString("en-PK")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
