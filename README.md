# FORGE. — Wear the Courtyard.

A minimal-premium everyday apparel brand from Lahore, Pakistan. Built to be re-worn 100+ washes, in earth tones drawn from the Pakistani forge tradition — cream ash, warm black iron, terracotta ember, olive slag, sandstone heat-patina.

This repository contains the full storefront: **Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Supabase**.

---

## What's inside

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js App Router root (`page.tsx` is the storefront) |
| `src/components/store/` | 11 storefront components (header, hero, featured, category, shop, product-card, product-detail-dialog, cart-sheet, about, newsletter, footer, auth-modal, account-view) |
| `src/lib/products.ts` | Local product catalog (10 categories, 29 SKUs) — used as fallback when Supabase isn't configured |
| `src/lib/supabase.ts` | Lazy Supabase client (returns null if env vars aren't set) |
| `src/lib/auth-store.ts` | Zustand auth store wrapping Supabase auth |
| `src/lib/cart-store.ts` | Zustand cart store with localStorage persistence |
| `src/lib/data-access.ts` | Supabase-first data layer with local fallback |
| `src/lib/view-store.ts` | Simple view-state router (home ↔ account) |
| `supabase/schema.sql` | Full SQL migration: tables, RLS policies, triggers, 29-product seed data |
| `.env.example` | Environment variable template |
| `download/` | Brand plan PDF + brand identity kit PDF + site screenshots |

## Catalog

10 product categories, 29 SKUs:
- **Hoodies** (4) — Cotton fleece, brushed back, 320 GSM
- **T-Shirts** (4) — Combed cotton jersey, 180 GSM
- **Sweatshirts** (3) — Cotton french terry, 280 GSM
- **Drop-Shoulder Tees** (3) — Combed cotton, relaxed, 200 GSM
- **Polo Shirts** (3) — Cotton pique, 2-button placket, 220 GSM
- **Full-Sleeve Tees** (3) — Combed cotton, long sleeve, 190 GSM
- **Printed Mugs** (3) — Ceramic 11oz, sublimation print
- **Zipper Hoodies** (3) — Cotton fleece, YKK metal zipper, 320 GSM
- **Printed Notebooks** (3) — Recycled kraft cover, A5

Pricing: PKR 700–5,500 (mid-premium). Color palette: Cream / Warm Black / Terracotta / Olive / Sandstone.

---

## Quick start (local development)

### Prerequisites
- Node.js 18+ (or [Bun](https://bun.sh) 1.0+)
- A Supabase account (free tier works) — sign up at https://supabase.com

### 1. Install dependencies
```bash
bun install
# or: npm install
```

### 2. Set up Supabase
1. Create a new Supabase project at https://supabase.com/dashboard
2. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://yourproject.supabase.co`)
   - **anon public key** (looks like `eyJhbGciOiJIUzI1NiIsInR5cCI6...`)
3. Open the **SQL Editor** in Supabase dashboard
4. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and run it as a new query
5. Verify the migration by running: `select count(*) from public.products;` — should return **29**

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and replace the placeholder values with your actual Supabase URL and anon key.

### 4. Run the dev server
```bash
bun run dev
# or: npm run dev
```
Open http://localhost:3000 — you should see the FORGE storefront.

### 5. Make yourself an admin (optional)
1. Sign up for an account via the storefront's "Sign In" button (top-right)
2. Go back to Supabase SQL Editor and run:
   ```sql
   update public.profiles set is_admin = true where email = 'your-email@example.com';
   ```
3. Refresh the page — you'll now see admin capabilities

---

## Deploy to production (Vercel + Supabase + GitHub)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: FORGE storefront with Supabase"
git branch -M main
git remote add origin https://github.com/your-username/forge.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **New Project** → import your `forge` repo
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy** — Vercel will build and deploy in ~2 minutes
5. Your site goes live at `https://forge-xxxx.vercel.app`

### 3. Configure Supabase for production
1. In Supabase dashboard → **Authentication → URL Configuration**
2. Add your Vercel URL to **Site URL** and **Redirect URLs**
3. (Optional) Configure custom domain in Vercel project settings

---

## Architecture

### Data flow
```
User action
    ↓
Component (e.g. ShopSection, CartSheet)
    ↓
lib/data-access.ts  ← tries Supabase first, falls back to lib/products.ts
    ↓
lib/supabase.ts     ← lazy client, null if env vars not set
    ↓
Supabase Postgres   ← RLS policies enforce per-user access
```

### Auth flow
- Supabase Auth handles signup/login/logout client-side
- `lib/auth-store.ts` (Zustand) wraps Supabase auth + caches the user profile
- `profiles` table extends `auth.users` with `full_name` and `is_admin`
- A Postgres trigger auto-creates a profile row when a new user signs up

### Cart flow
- Cart state in Zustand (`lib/cart-store.ts`), persisted to `localStorage`
- On checkout: cart items are converted to an order and inserted into `orders` table
- Logged-in users: order is linked to `user_id` and shows in their order history
- Guest users: order is saved with just `email` field

### Row-Level Security (RLS)
All tables have RLS enabled with the following policies:

| Table | Read | Write |
|-------|------|-------|
| `products` | Public | Admin only |
| `profiles` | Owner + Admin | Owner (own row) |
| `orders` | Owner + Admin | Owner insert + Guest insert with email |
| `newsletter_subscribers` | Admin only | Public insert |
| `cart_items` | Owner | Owner (CRUD own items) |

---

## Brand assets

The following PDFs are in `download/` and ship with the repo:

- **`FORGE_Brand_Plan.pdf`** (13 pages) — Executive summary, brand story, market analysis, competitor table, personas, positioning, full 10-category catalog, supplier map, 12-month marketing plan, financial projections, visual identity, roadmap.
- **`FORGE_Brand_Identity_Kit.pdf`** (10 pages) — Logo concepts (3 lockups), 5-color palette with hex codes, typography system (Playfair Display + Inter), tagline + voice rules, packaging mockups, applied product examples.

---

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York variant)
- **State**: Zustand (cart, auth, view)
- **Backend**: Supabase (Postgres + Auth + RLS)
- **Fonts**: Playfair Display (display serif) + Inter (body sans)
- **Icons**: Lucide React
- **Package manager**: Bun (or npm)

---

## License

MIT — see [LICENSE](./LICENSE) for details.

## Brand

© 2026 FORGE Brand Studio. All rights reserved.
- Site: forge.pk
- Email: hello@forge.pk
- Instagram: @forge.pk
- Founded in Lahore, Pakistan
