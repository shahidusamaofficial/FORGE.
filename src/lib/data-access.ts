// FORGE — Data access layer
// Supabase-first with local fallback. When Supabase env vars aren't set
// (e.g. in preview without configuration), returns local mock data.

import { getSupabase } from "./supabase";
import {
  products as localProducts,
  categories as localCategories,
  type Product,
  type Category,
  type ProductCategory,
} from "./products";

interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  colorway: Product["colorway"];
  fabric: string;
  gsm: number | null;
  sizes: string[];
  description: string;
  hero: boolean;
}

function mapSupabaseProduct(p: SupabaseProduct): Product {
  return {
    id: p.id,
    name: p.name,
    category: p.category as ProductCategory,
    price: p.price,
    colorway: p.colorway,
    fabric: p.fabric,
    gsm: p.gsm ?? undefined,
    sizes: p.sizes,
    description: p.description,
    hero: p.hero,
  };
}

/**
 * Get all products — tries Supabase first, falls back to local data.
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return localProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) {
    return localProducts;
  }

  return data.map(mapSupabaseProduct);
}

/**
 * Get products filtered by category.
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return localProducts.filter((p) => p.category === category);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return localProducts.filter((p) => p.category === category);
  }

  return data.map(mapSupabaseProduct);
}

/**
 * Get hero products (one per category).
 */
export async function getHeroProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return localProducts.filter((p) => p.hero);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("hero", true)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return localProducts.filter((p) => p.hero);
  }

  return data.map(mapSupabaseProduct);
}

/**
 * Get a single product by id.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabase();
  if (!supabase) return localProducts.find((p) => p.id === id) ?? null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return localProducts.find((p) => p.id === id) ?? null;
  }

  return mapSupabaseProduct(data);
}

/**
 * Categories are static (10 categories defined in lib/products.ts).
 * No need to fetch from Supabase.
 */
export function getCategories(): Category[] {
  return localCategories;
}

// ─── Orders ────────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  colorway: Product["colorway"];
}

export interface Order {
  id: string;
  user_id: string | null;
  email: string | null;
  items: OrderItem[];
  subtotal: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

/**
 * Create a new order. Works for both logged-in users and guests.
 */
export async function createOrder(
  items: OrderItem[],
  subtotal: number,
  email?: string | null,
  userId?: string | null
): Promise<{ order: Order | null; error: string | null }> {
  const supabase = getSupabase();
  if (!supabase) {
    // Local mode — return a fake order
    const fakeOrder: Order = {
      id: `local-${Date.now()}`,
      user_id: userId ?? null,
      email: email ?? null,
      items,
      subtotal,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    return { order: fakeOrder, error: null };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId ?? null,
      email: email ?? null,
      items,
      subtotal,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return { order: null, error: error.message };
  }

  return { order: data as Order, error: null };
}

/**
 * Get all orders for the current user.
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Order[];
}

// ─── Newsletter ─────────────────────────────────────────────

export async function subscribeToNewsletter(
  email: string
): Promise<{ error: string | null }> {
  const supabase = getSupabase();
  if (!supabase) {
    // Local mode — pretend success
    return { error: null };
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email });

  if (error) {
    // Email already subscribed — that's a success state, not an error
    if (error.code === "23505") {
      return { error: null };
    }
    return { error: error.message };
  }

  return { error: null };
}

// ─── Cart persistence (per logged-in user) ─────────────────

export async function syncCartToSupabase(
  userId: string,
  items: { product_id: string; size: string; quantity: number }[]
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  // Delete existing cart items for this user, then insert new ones
  await supabase.from("cart_items").delete().eq("user_id", userId);
  if (items.length > 0) {
    await supabase
      .from("cart_items")
      .insert(items.map((i) => ({ ...i, user_id: userId })));
  }
}

export async function loadCartFromSupabase(
  userId: string
): Promise<{ product_id: string; size: string; quantity: number }[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, size, quantity")
    .eq("user_id", userId);

  if (error || !data) return null;
  return data;
}
