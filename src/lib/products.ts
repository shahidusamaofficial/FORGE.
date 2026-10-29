// AANGAN — Product catalog
// 10 categories, ~40 SKUs across the year-1 line
// All prices in PKR (Pakistani Rupees)

export type Colorway =
  | "cream"
  | "warm-black"
  | "terracotta"
  | "olive"
  | "sandstone";

export type ProductCategory =
  | "hoodies"
  | "t-shirts"
  | "sweatshirts"
  | "drop-shoulder-tees"
  | "polo-shirts"
  | "full-sleeve-tees"
  | "printed-mugs"
  | "zipper-hoodies"
  | "printed-notebooks";

export interface Category {
  id: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  fabric: string;
  priceRange: [number, number];
  heroColor: Colorway;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  colorway: Colorway;
  fabric: string;
  gsm?: number;
  sizes: string[];
  description: string;
  hero?: boolean;
}

export const categories: Category[] = [
  {
    id: "hoodies",
    name: "Hoodies",
    tagline: "The Everyday Hoodie",
    description:
      "320 GSM brushed-back cotton fleece. Pre-shrunk. Double-stitched seams. Built to be re-worn 100+ times.",
    fabric: "Cotton fleece, brushed back",
    priceRange: [4200, 5500],
    heroColor: "sandstone",
  },
  {
    id: "t-shirts",
    name: "T-Shirts",
    tagline: "The Daily Tee",
    description:
      "180 GSM combed cotton jersey. Pre-shrunk. Relaxed regular fit. The tee you reach for on a Tuesday.",
    fabric: "Combed cotton jersey",
    priceRange: [1800, 2200],
    heroColor: "cream",
  },
  {
    id: "sweatshirts",
    name: "Sweatshirts",
    tagline: "The Crew Sweat",
    description:
      "280 GSM cotton french terry. Loop-back interior. Ribbed cuffs and hem. Quiet, layered warmth.",
    fabric: "Cotton french terry",
    priceRange: [3200, 3800],
    heroColor: "olive",
  },
  {
    id: "drop-shoulder-tees",
    name: "Drop-Shoulder Tees",
    tagline: "The Drop Tee",
    description:
      "200 GSM combed cotton. Relaxed drop-shoulder construction. Longer body. Streetwear-adjacent without being loud.",
    fabric: "Combed cotton jersey, relaxed",
    priceRange: [2400, 2800],
    heroColor: "terracotta",
  },
  {
    id: "polo-shirts",
    name: "Polo Shirts",
    tagline: "The Office Polo",
    description:
      "220 GSM cotton pique. 2-button placket. Flat-knit collar that sits, never curls. Smart-casual without trying.",
    fabric: "Cotton pique, 2-button placket",
    priceRange: [2800, 3500],
    heroColor: "warm-black",
  },
  {
    id: "full-sleeve-tees",
    name: "Full-Sleeve Tees",
    tagline: "The Long Sleeve",
    description:
      "190 GSM combed cotton. Round neck, long sleeve. Layering essential for the commute or the office.",
    fabric: "Combed cotton jersey, long sleeve",
    priceRange: [2200, 2800],
    heroColor: "sandstone",
  },
  {
    id: "printed-mugs",
    name: "Printed Mugs",
    tagline: "The Courtyard Mug",
    description:
      "11oz ceramic. Sublimation print. Dishwasher-safe. Pairs with morning chai and a slow hour.",
    fabric: "Ceramic 11oz",
    priceRange: [900, 1200],
    heroColor: "cream",
  },
  {
    id: "zipper-hoodies",
    name: "Zipper Hoodies",
    tagline: "The Zip Hoodie",
    description:
      "320 GSM cotton fleece. YKK metal zipper. Draft-blocking storm flap. Layered for the Lahore winter.",
    fabric: "Cotton fleece, YKK metal zipper",
    priceRange: [4800, 5500],
    heroColor: "warm-black",
  },
  {
    id: "printed-notebooks",
    name: "Printed Notebooks",
    tagline: "The Daily Notebook",
    description:
      "Recycled kraft cover. 80 ruled sheets. A5 size. Lay-flat binding. For the lists, the letters, the late-night ideas.",
    fabric: "Recycled kraft cover, A5",
    priceRange: [700, 1000],
    heroColor: "sandstone",
  },
];

export const products: Product[] = [
  // ─── Hoodies ──────────────────────────────────────────────
  {
    id: "hd-001",
    name: "The Everyday Hoodie",
    category: "hoodies",
    price: 4200,
    colorway: "sandstone",
    fabric: "Cotton fleece, brushed back",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The hoodie you'll reach for on an ordinary Tuesday. 320 GSM brushed-back cotton fleece, double-stitched seams, pre-shrunk. Sandstone is the hero colorway — earthy, warm, never loud.",
    hero: true,
  },
  {
    id: "hd-002",
    name: "The Everyday Hoodie / Warm Black",
    category: "hoodies",
    price: 4200,
    colorway: "warm-black",
    fabric: "Cotton fleece, brushed back",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Same construction, warm-black colorway. The brown undertone keeps it from looking corporate — it reads as a personal choice, not a uniform.",
  },
  {
    id: "hd-003",
    name: "The Everyday Hoodie / Olive",
    category: "hoodies",
    price: 4500,
    colorway: "olive",
    fabric: "Cotton fleece, brushed back",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Olive is the secondary hero colorway for the hoodie category. Reads as earthy and considered, never military.",
  },
  {
    id: "hd-004",
    name: "The Heavyweight Hoodie",
    category: "hoodies",
    price: 5500,
    colorway: "cream",
    fabric: "Cotton fleece, brushed back",
    gsm: 380,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A 380 GSM heavyweight variant for the Lahore winter. Cream colorway with the wordmark debossed on the inside collar only — quiet on the outside, considered on the inside.",
  },

  // ─── T-Shirts ─────────────────────────────────────────────
  {
    id: "ts-001",
    name: "The Daily Tee",
    category: "t-shirts",
    price: 1800,
    colorway: "cream",
    fabric: "Combed cotton jersey",
    gsm: 180,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "180 GSM combed cotton. Pre-shrunk. Relaxed regular fit. The hero tee in cream — pairs with literally everything in the catalog.",
    hero: true,
  },
  {
    id: "ts-002",
    name: "The Daily Tee / Warm Black",
    category: "t-shirts",
    price: 1800,
    colorway: "warm-black",
    fabric: "Combed cotton jersey",
    gsm: 180,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Same Daily Tee in warm-black. Brown undertone — never corporate.",
  },
  {
    id: "ts-003",
    name: "The Daily Tee / Terracotta",
    category: "t-shirts",
    price: 2000,
    colorway: "terracotta",
    fabric: "Combed cotton jersey",
    gsm: 180,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The terracotta colorway is the accent SKU of the tee category. One per wardrobe is enough — wear it on the days you want to be slightly more seen.",
  },
  {
    id: "ts-004",
    name: "The Daily Tee / Olive",
    category: "t-shirts",
    price: 2000,
    colorway: "olive",
    fabric: "Combed cotton jersey",
    gsm: 180,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Olive colorway of the Daily Tee. Pairs naturally with sandstone and warm-black.",
  },

  // ─── Sweatshirts ──────────────────────────────────────────
  {
    id: "sw-001",
    name: "The Crew Sweat",
    category: "sweatshirts",
    price: 3500,
    colorway: "olive",
    fabric: "Cotton french terry",
    gsm: 280,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "280 GSM cotton french terry with loop-back interior. Ribbed cuffs and hem. No hood, no zipper — just the crew. Olive is the hero colorway.",
    hero: true,
  },
  {
    id: "sw-002",
    name: "The Crew Sweat / Sandstone",
    category: "sweatshirts",
    price: 3200,
    colorway: "sandstone",
    fabric: "Cotton french terry",
    gsm: 280,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Same Crew Sweat in sandstone. The most versatile neutral in the catalog.",
  },
  {
    id: "sw-003",
    name: "The Crew Sweat / Cream",
    category: "sweatshirts",
    price: 3200,
    colorway: "cream",
    fabric: "Cotton french terry",
    gsm: 280,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Cream colorway — for monochrome layering with the warm-black hoodie.",
  },

  // ─── Drop-Shoulder Tees ───────────────────────────────────
  {
    id: "ds-001",
    name: "The Drop Tee",
    category: "drop-shoulder-tees",
    price: 2600,
    colorway: "terracotta",
    fabric: "Combed cotton jersey, relaxed",
    gsm: 200,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "200 GSM combed cotton. Drop-shoulder construction, longer body. Streetwear-adjacent without being loud. Terracotta is the hero colorway — the accent SKU of the catalog.",
    hero: true,
  },
  {
    id: "ds-002",
    name: "The Drop Tee / Cream",
    category: "drop-shoulder-tees",
    price: 2400,
    colorway: "cream",
    fabric: "Combed cotton jersey, relaxed",
    gsm: 200,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Cream colorway of the Drop Tee — pairs naturally under the Crew Sweat.",
  },
  {
    id: "ds-003",
    name: "The Drop Tee / Warm Black",
    category: "drop-shoulder-tees",
    price: 2400,
    colorway: "warm-black",
    fabric: "Combed cotton jersey, relaxed",
    gsm: 200,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Warm-black colorway of the Drop Tee. The piece that goes with everything.",
  },

  // ─── Polo Shirts ──────────────────────────────────────────
  {
    id: "po-001",
    name: "The Office Polo",
    category: "polo-shirts",
    price: 3200,
    colorway: "warm-black",
    fabric: "Cotton pique, 2-button placket",
    gsm: 220,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "220 GSM cotton pique. 2-button placket. Flat-knit collar that sits flat — never curls after a wash. Warm-black is the hero colorway for the office-casual context.",
    hero: true,
  },
  {
    id: "po-002",
    name: "The Office Polo / Olive",
    category: "polo-shirts",
    price: 2800,
    colorway: "olive",
    fabric: "Cotton pique, 2-button placket",
    gsm: 220,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Olive colorway — smart-casual without the corporate feel.",
  },
  {
    id: "po-003",
    name: "The Office Polo / Sandstone",
    category: "polo-shirts",
    price: 2800,
    colorway: "sandstone",
    fabric: "Cotton pique, 2-button placket",
    gsm: 220,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Sandstone colorway — the lightest polo in the line.",
  },

  // ─── Full-Sleeve Tees ─────────────────────────────────────
  {
    id: "fs-001",
    name: "The Long Sleeve",
    category: "full-sleeve-tees",
    price: 2400,
    colorway: "sandstone",
    fabric: "Combed cotton jersey, long sleeve",
    gsm: 190,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "190 GSM combed cotton. Round neck, long sleeve. Layering essential — under a blazer in the office, under a hoodie on the commute.",
    hero: true,
  },
  {
    id: "fs-002",
    name: "The Long Sleeve / Warm Black",
    category: "full-sleeve-tees",
    price: 2200,
    colorway: "warm-black",
    fabric: "Combed cotton jersey, long sleeve",
    gsm: 190,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Warm-black colorway of the Long Sleeve.",
  },
  {
    id: "fs-003",
    name: "The Long Sleeve / Cream",
    category: "full-sleeve-tees",
    price: 2200,
    colorway: "cream",
    fabric: "Combed cotton jersey, long sleeve",
    gsm: 190,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Cream colorway. Wear it under the Olive Crew Sweat for the catalogue flat-lay look.",
  },

  // ─── Printed Mugs ─────────────────────────────────────────
  {
    id: "mg-001",
    name: "The Courtyard Mug",
    category: "printed-mugs",
    price: 1100,
    colorway: "cream",
    fabric: "Ceramic 11oz",
    sizes: ["11oz"],
    description:
      "11oz ceramic mug in cream with terracotta wordmark centered opposite the handle. Sublimation print — dishwasher safe. Pairs with morning chai.",
    hero: true,
  },
  {
    id: "mg-002",
    name: "The Courtyard Mug / Warm Black",
    category: "printed-mugs",
    price: 900,
    colorway: "warm-black",
    fabric: "Ceramic 11oz",
    sizes: ["11oz"],
    description: "Warm-black ceramic with cream wordmark. The counterpart to the cream mug.",
  },
  {
    id: "mg-003",
    name: "The Courtyard Mug / Terracotta",
    category: "printed-mugs",
    price: 1200,
    colorway: "terracotta",
    fabric: "Ceramic 11oz",
    sizes: ["11oz"],
    description: "Terracotta ceramic with cream wordmark. The accent mug of the line.",
  },

  // ─── Zipper Hoodies ───────────────────────────────────────
  {
    id: "zh-001",
    name: "The Zip Hoodie",
    category: "zipper-hoodies",
    price: 4800,
    colorway: "warm-black",
    fabric: "Cotton fleece, YKK metal zipper",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "320 GSM cotton fleece with YKK metal zipper. Draft-blocking storm flap behind the zipper. Warm-black is the hero colorway — the zip-up you keep by the door.",
    hero: true,
  },
  {
    id: "zh-002",
    name: "The Zip Hoodie / Sandstone",
    category: "zipper-hoodies",
    price: 4800,
    colorway: "sandstone",
    fabric: "Cotton fleece, YKK metal zipper",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Sandstone colorway of the Zip Hoodie.",
  },
  {
    id: "zh-003",
    name: "The Zip Hoodie / Olive",
    category: "zipper-hoodies",
    price: 5500,
    colorway: "olive",
    fabric: "Cotton fleece, YKK metal zipper",
    gsm: 320,
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Olive colorway. The premium variant of the zip hoodie line.",
  },

  // ─── Printed Notebooks ────────────────────────────────────
  {
    id: "nb-001",
    name: "The Daily Notebook",
    category: "printed-notebooks",
    price: 800,
    colorway: "sandstone",
    fabric: "Recycled kraft cover, A5",
    sizes: ["A5"],
    description:
      "Recycled kraft cover with sandstone wrap, 80 ruled sheets, A5. Lay-flat binding. Debossed wordmark on the front. For lists, letters, and late-night ideas.",
    hero: true,
  },
  {
    id: "nb-002",
    name: "The Daily Notebook / Cream",
    category: "printed-notebooks",
    price: 700,
    colorway: "cream",
    fabric: "Recycled kraft cover, A5",
    sizes: ["A5"],
    description: "Cream cover variant — slightly softer in hand.",
  },
  {
    id: "nb-003",
    name: "The Daily Notebook / Warm Black",
    category: "printed-notebooks",
    price: 1000,
    colorway: "warm-black",
    fabric: "Recycled kraft cover, A5",
    sizes: ["A5"],
    description: "Warm-black cover with cream wordmark debossed. The premium variant.",
  },
];

// ─── Helpers ────────────────────────────────────────────────
export function getCategory(id: ProductCategory): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getProductsByCategory(id: ProductCategory): Product[] {
  return products.filter((p) => p.category === id);
}

export function getHeroProducts(): Product[] {
  return products.filter((p) => p.hero);
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

export function getColorwayLabel(c: Colorway): string {
  const labels: Record<Colorway, string> = {
    cream: "Cream",
    "warm-black": "Warm Black",
    terracotta: "Terracotta",
    olive: "Olive",
    sandstone: "Sandstone",
  };
  return labels[c];
}

export function getColorwayClass(c: Colorway): string {
  const classes: Record<Colorway, string> = {
    cream: "swatch-cream",
    "warm-black": "swatch-warm-black",
    terracotta: "swatch-terracotta",
    olive: "swatch-olive",
    sandstone: "swatch-sandstone",
  };
  return classes[c];
}

export function getColorwayHex(c: Colorway): string {
  const hex: Record<Colorway, string> = {
    cream: "#FAF7F2",
    "warm-black": "#1A1614",
    terracotta: "#8B5A3C",
    olive: "#6B7A4F",
    sandstone: "#C9BBA3",
  };
  return hex[c];
}

export function getTextColorway(c: Colorway): string {
  // Return readable text color for a given background colorway
  const dark: Colorway[] = ["warm-black", "terracotta", "olive"];
  return dark.includes(c) ? "#FAF7F2" : "#1A1614";
}
