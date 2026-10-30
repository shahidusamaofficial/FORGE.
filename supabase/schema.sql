-- ============================================================
-- FORGE — Supabase Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================
-- This migration creates:
--   1. profiles table (extends auth.users with full_name + is_admin)
--   2. products table (10 categories, 29 SKUs seeded)
--   3. orders table (customer order history)
--   4. newsletter_subscribers table
--   5. cart_items table (persistent cart per user)
--   6. Row-Level Security (RLS) policies
--   7. Trigger to auto-create profile on signup
--   8. Seed data for all 29 products
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES — extends auth.users
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 2. PRODUCTS — public read, admin write
-- ────────────────────────────────────────────────────────────
create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text not null,
  price integer not null,
  colorway text not null check (colorway in ('cream','warm-black','terracotta','olive','sandstone')),
  fabric text not null,
  gsm integer,
  sizes text[] not null,
  description text not null,
  hero boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_hero_idx on public.products(hero) where hero = true;

alter table public.products enable row level security;

create policy "Products are publicly readable"
  on public.products for select
  using (true);

create policy "Admins can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- 3. ORDERS — user can read own, insert own
-- ────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  items jsonb not null,
  subtotal integer not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

alter table public.orders enable row level security;

create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Guests can insert orders with email"
  on public.orders for insert
  with check (user_id is null and email is not null);

create policy "Admins can read all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

create policy "Admins can update order status"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- 4. NEWSLETTER SUBSCRIBERS — public insert, admin read
-- ────────────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "Admins can read subscribers"
  on public.newsletter_subscribers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- 5. CART ITEMS — persistent cart per logged-in user
-- ────────────────────────────────────────────────────────────
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  size text not null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 10),
  created_at timestamptz not null default now(),
  unique(user_id, product_id, size)
);

alter table public.cart_items enable row level security;

create policy "Users can CRUD own cart items"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 6. SEED DATA — all 29 FORGE products
-- ────────────────────────────────────────────────────────────
insert into public.products (id, name, slug, category, price, colorway, fabric, gsm, sizes, description, hero) values
  -- Hoodies (4)
  ('hd-001', 'The Everyday Hoodie', 'everyday-hoodie-sandstone', 'hoodies', 4200, 'sandstone', 'Cotton fleece, brushed back', 320, '{S,M,L,XL,XXL}', 'The hoodie you''ll reach for on an ordinary Tuesday. 320 GSM brushed-back cotton fleece, double-stitched seams, pre-shrunk.', true),
  ('hd-002', 'The Everyday Hoodie / Warm Black', 'everyday-hoodie-warm-black', 'hoodies', 4200, 'warm-black', 'Cotton fleece, brushed back', 320, '{S,M,L,XL,XXL}', 'Same construction, warm-black colorway. The brown undertone keeps it from looking corporate.', false),
  ('hd-003', 'The Everyday Hoodie / Olive', 'everyday-hoodie-olive', 'hoodies', 4500, 'olive', 'Cotton fleece, brushed back', 320, '{S,M,L,XL,XXL}', 'Olive is the secondary hero colorway for the hoodie category.', false),
  ('hd-004', 'The Heavyweight Hoodie', 'heavyweight-hoodie-cream', 'hoodies', 5500, 'cream', 'Cotton fleece, brushed back', 380, '{S,M,L,XL,XXL}', 'A 380 GSM heavyweight variant for the Lahore winter.', false),
  -- T-Shirts (4)
  ('ts-001', 'The Daily Tee', 'daily-tee-cream', 't-shirts', 1800, 'cream', 'Combed cotton jersey', 180, '{S,M,L,XL,XXL}', '180 GSM combed cotton. Pre-shrunk. Relaxed regular fit.', true),
  ('ts-002', 'The Daily Tee / Warm Black', 'daily-tee-warm-black', 't-shirts', 1800, 'warm-black', 'Combed cotton jersey', 180, '{S,M,L,XL,XXL}', 'Same Daily Tee in warm-black. Brown undertone.', false),
  ('ts-003', 'The Daily Tee / Terracotta', 'daily-tee-terracotta', 't-shirts', 2000, 'terracotta', 'Combed cotton jersey', 180, '{S,M,L,XL,XXL}', 'The terracotta colorway is the accent SKU of the tee category.', false),
  ('ts-004', 'The Daily Tee / Olive', 'daily-tee-olive', 't-shirts', 2000, 'olive', 'Combed cotton jersey', 180, '{S,M,L,XL,XXL}', 'Olive colorway of the Daily Tee.', false),
  -- Sweatshirts (3)
  ('sw-001', 'The Crew Sweat', 'crew-sweat-olive', 'sweatshirts', 3500, 'olive', 'Cotton french terry', 280, '{S,M,L,XL,XXL}', '280 GSM cotton french terry with loop-back interior. Ribbed cuffs and hem.', true),
  ('sw-002', 'The Crew Sweat / Sandstone', 'crew-sweat-sandstone', 'sweatshirts', 3200, 'sandstone', 'Cotton french terry', 280, '{S,M,L,XL,XXL}', 'Same Crew Sweat in sandstone.', false),
  ('sw-003', 'The Crew Sweat / Cream', 'crew-sweat-cream', 'sweatshirts', 3200, 'cream', 'Cotton french terry', 280, '{S,M,L,XL,XXL}', 'Cream colorway — for monochrome layering with the warm-black hoodie.', false),
  -- Drop-Shoulder Tees (3)
  ('ds-001', 'The Drop Tee', 'drop-tee-terracotta', 'drop-shoulder-tees', 2600, 'terracotta', 'Combed cotton jersey, relaxed', 200, '{S,M,L,XL,XXL}', '200 GSM combed cotton. Drop-shoulder construction, longer body.', true),
  ('ds-002', 'The Drop Tee / Cream', 'drop-tee-cream', 'drop-shoulder-tees', 2400, 'cream', 'Combed cotton jersey, relaxed', 200, '{S,M,L,XL,XXL}', 'Cream colorway of the Drop Tee.', false),
  ('ds-003', 'The Drop Tee / Warm Black', 'drop-tee-warm-black', 'drop-shoulder-tees', 2400, 'warm-black', 'Combed cotton jersey, relaxed', 200, '{S,M,L,XL,XXL}', 'Warm-black colorway of the Drop Tee.', false),
  -- Polo Shirts (3)
  ('po-001', 'The Office Polo', 'office-polo-warm-black', 'polo-shirts', 3200, 'warm-black', 'Cotton pique, 2-button placket', 220, '{S,M,L,XL,XXL}', '220 GSM cotton pique. 2-button placket. Flat-knit collar that sits flat.', true),
  ('po-002', 'The Office Polo / Olive', 'office-polo-olive', 'polo-shirts', 2800, 'olive', 'Cotton pique, 2-button placket', 220, '{S,M,L,XL,XXL}', 'Olive colorway — smart-casual without the corporate feel.', false),
  ('po-003', 'The Office Polo / Sandstone', 'office-polo-sandstone', 'polo-shirts', 2800, 'sandstone', 'Cotton pique, 2-button placket', 220, '{S,M,L,XL,XXL}', 'Sandstone colorway — the lightest polo in the line.', false),
  -- Full-Sleeve Tees (3)
  ('fs-001', 'The Long Sleeve', 'long-sleeve-sandstone', 'full-sleeve-tees', 2400, 'sandstone', 'Combed cotton jersey, long sleeve', 190, '{S,M,L,XL,XXL}', '190 GSM combed cotton. Round neck, long sleeve. Layering essential.', true),
  ('fs-002', 'The Long Sleeve / Warm Black', 'long-sleeve-warm-black', 'full-sleeve-tees', 2200, 'warm-black', 'Combed cotton jersey, long sleeve', 190, '{S,M,L,XL,XXL}', 'Warm-black colorway of the Long Sleeve.', false),
  ('fs-003', 'The Long Sleeve / Cream', 'long-sleeve-cream', 'full-sleeve-tees', 2200, 'cream', 'Combed cotton jersey, long sleeve', 190, '{S,M,L,XL,XXL}', 'Cream colorway.', false),
  -- Printed Mugs (3)
  ('mg-001', 'The Forge Mug', 'forge-mug-cream', 'printed-mugs', 1100, 'cream', 'Ceramic 11oz', null, '{11oz}', '11oz ceramic mug in cream with terracotta wordmark centered opposite the handle. Sublimation print — dishwasher safe.', true),
  ('mg-002', 'The Forge Mug / Warm Black', 'forge-mug-warm-black', 'printed-mugs', 900, 'warm-black', 'Ceramic 11oz', null, '{11oz}', 'Warm-black ceramic with cream wordmark.', false),
  ('mg-003', 'The Forge Mug / Terracotta', 'forge-mug-terracotta', 'printed-mugs', 1200, 'terracotta', 'Ceramic 11oz', null, '{11oz}', 'Terracotta ceramic with cream wordmark. The accent mug of the line.', false),
  -- Zipper Hoodies (3)
  ('zh-001', 'The Zip Hoodie', 'zip-hoodie-warm-black', 'zipper-hoodies', 4800, 'warm-black', 'Cotton fleece, YKK metal zipper', 320, '{S,M,L,XL,XXL}', '320 GSM cotton fleece with YKK metal zipper. Draft-blocking storm flap behind the zipper.', true),
  ('zh-002', 'The Zip Hoodie / Sandstone', 'zip-hoodie-sandstone', 'zipper-hoodies', 4800, 'sandstone', 'Cotton fleece, YKK metal zipper', 320, '{S,M,L,XL,XXL}', 'Sandstone colorway of the Zip Hoodie.', false),
  ('zh-003', 'The Zip Hoodie / Olive', 'zip-hoodie-olive', 'zipper-hoodies', 5500, 'olive', 'Cotton fleece, YKK metal zipper', 320, '{S,M,L,XL,XXL}', 'Olive colorway. The premium variant of the zip hoodie line.', false),
  -- Printed Notebooks (3)
  ('nb-001', 'The Daily Notebook', 'daily-notebook-sandstone', 'printed-notebooks', 800, 'sandstone', 'Recycled kraft cover, A5', null, '{A5}', 'Recycled kraft cover with sandstone wrap, 80 ruled sheets, A5. Lay-flat binding. Debossed wordmark on the front.', true),
  ('nb-002', 'The Daily Notebook / Cream', 'daily-notebook-cream', 'printed-notebooks', 700, 'cream', 'Recycled kraft cover, A5', null, '{A5}', 'Cream cover variant — slightly softer in hand.', false),
  ('nb-003', 'The Daily Notebook / Warm Black', 'daily-notebook-warm-black', 'printed-notebooks', 1000, 'warm-black', 'Recycled kraft cover, A5', null, '{A5}', 'Warm-black cover with cream wordmark debossed. The premium variant.', false)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- 7. MAKE FIRST USER ADMIN (run this AFTER you create your account)
-- Replace 'your-email@example.com' with the email you signed up with
-- ────────────────────────────────────────────────────────────
-- update public.profiles set is_admin = true where email = 'your-email@example.com';

-- ============================================================
-- Migration complete. Verify by running:
--   select count(*) from public.products;  -- should return 29
-- ============================================================
