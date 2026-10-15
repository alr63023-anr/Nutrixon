// Sample data for demonstration. Brands are fictional; approval statuses are illustrative.

export type ApprovalStatus = "approved" | "review" | "not-approved";
export type Verdict = "good" | "ok" | "bad";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  kcal: number;
  sugar: number;
  satFat: number;
  sodium: number;
  fibre: number;
  protein: number;
  additives: string[];
  ingredients: string;
  approval: ApprovalStatus;
  approvalNote: string;
}

export const products: Product[] = [
  {
    id: "crunchy-masala-chips",
    name: "Crunchy Masala Chips",
    brand: "Demo Snacks",
    category: "Chips & snacks",
    barcode: "8901234500011",
    kcal: 536,
    sugar: 3,
    satFat: 14,
    sodium: 780,
    fibre: 3,
    protein: 6,
    additives: ["E621 (flavour enhancer)", "E631", "E330 (citric acid)", "Artificial flavours"],
    ingredients: "Potato, palm oil, spice mix, salt, flavour enhancers (E621, E631), acidity regulator (E330).",
    approval: "review",
    approvalNote: "Label claims are under review by the food safety authority.",
  },
  {
    id: "instant-masala-noodles",
    name: "Instant Masala Noodles",
    brand: "Quickbowl",
    category: "Instant food",
    barcode: "8901234500028",
    kcal: 450,
    sugar: 3,
    satFat: 8,
    sodium: 1650,
    fibre: 3,
    protein: 9,
    additives: ["E621 (flavour enhancer)", "E627", "E631", "TBHQ (E319)", "Flavour enhancers"],
    ingredients: "Refined wheat flour (maida), palm oil, salt, masala sachet, flavour enhancers, antioxidant (E319).",
    approval: "approved",
    approvalNote: "Approved for sale. Sodium is high; eat rarely.",
  },
  {
    id: "fizzy-cola-drink",
    name: "Fizzy Cola Drink",
    brand: "Bubblo",
    category: "Cold drinks",
    barcode: "8901234500035",
    kcal: 42,
    sugar: 10.6,
    satFat: 0,
    sodium: 8,
    fibre: 0,
    protein: 0,
    additives: ["E150d (caramel colour)", "E338 (phosphoric acid)", "Caffeine"],
    ingredients: "Carbonated water, sugar, caramel colour, phosphoric acid, natural flavours, caffeine.",
    approval: "approved",
    approvalNote: "Approved for sale. High in sugar; limit to occasional use.",
  },
  {
    id: "orange-cream-biscuits",
    name: "Orange Cream Biscuits",
    brand: "Sweetcrumb",
    category: "Biscuits",
    barcode: "8901234500042",
    kcal: 480,
    sugar: 36,
    satFat: 11,
    sodium: 290,
    fibre: 1.5,
    protein: 5,
    additives: ["E102 (tartrazine colour)", "E471", "Artificial orange flavour", "Invert syrup"],
    ingredients: "Refined wheat flour, sugar, palm oil, invert syrup, emulsifier (E471), colour (E102), flavour.",
    approval: "not-approved",
    approvalNote: "Not approved: colour level exceeds the permitted limit in this sample.",
  },
  {
    id: "multigrain-bread",
    name: "Whole Wheat Multigrain Bread",
    brand: "Hearthloaf",
    category: "Bakery",
    barcode: "8901234500059",
    kcal: 250,
    sugar: 4,
    satFat: 0.8,
    sodium: 450,
    fibre: 6,
    protein: 10,
    additives: ["E282 (preservative)", "E472e"],
    ingredients: "Whole wheat flour, mixed seeds, yeast, salt, preservative (E282), emulsifier (E472e).",
    approval: "approved",
    approvalNote: "Approved for sale.",
  },
  {
    id: "plain-dahi",
    name: "Fresh Plain Dahi (Curd)",
    brand: "Gokul Fresh",
    category: "Dairy",
    barcode: "8901234500066",
    kcal: 60,
    sugar: 4,
    satFat: 2,
    sodium: 45,
    fibre: 0,
    protein: 3.5,
    additives: [],
    ingredients: "Pasteurised toned milk, live curd cultures.",
    approval: "approved",
    approvalNote: "Approved for sale.",
  },
  {
    id: "roasted-chana",
    name: "Roasted Chana",
    brand: "Desi Bites",
    category: "Healthy snacks",
    barcode: "8901234500073",
    kcal: 370,
    sugar: 2,
    satFat: 0.8,
    sodium: 300,
    fibre: 12,
    protein: 20,
    additives: [],
    ingredients: "Roasted Bengal gram, rock salt.",
    approval: "approved",
    approvalNote: "Approved for sale.",
  },
  {
    id: "choco-hazelnut-spread",
    name: "Choco Hazelnut Spread",
    brand: "Nuttella Co.",
    category: "Spreads",
    barcode: "8901234500080",
    kcal: 540,
    sugar: 56,
    satFat: 10,
    sodium: 40,
    fibre: 3,
    protein: 6,
    additives: ["E322 (emulsifier)", "Palm oil", "Vanillin"],
    ingredients: "Sugar, palm oil, hazelnuts, skimmed milk powder, cocoa, emulsifier (E322), vanillin.",
    approval: "review",
    approvalNote: "Sugar claims on the pack are under review.",
  },
  {
    id: "mango-fruit-drink",
    name: "Mango Fruit Drink",
    brand: "Juicy Jar",
    category: "Cold drinks",
    barcode: "8901234500097",
    kcal: 60,
    sugar: 14,
    satFat: 0,
    sodium: 15,
    fibre: 0.2,
    protein: 0.2,
    additives: ["E211 (sodium benzoate)", "E110 (sunset yellow)", "Artificial mango flavour"],
    ingredients: "Water, sugar, mango pulp (12%), acidity regulator, preservative (E211), colour (E110), flavour.",
    approval: "not-approved",
    approvalNote: "Not approved: 'fruit' claim is misleading at 12% pulp in this sample.",
  },
  {
    id: "masala-oats",
    name: "Masala Oats",
    brand: "Oatsy",
    category: "Breakfast",
    barcode: "8901234500103",
    kcal: 380,
    sugar: 3,
    satFat: 1.5,
    sodium: 900,
    fibre: 9,
    protein: 11,
    additives: ["Flavour enhancer", "Anticaking agent (E551)"],
    ingredients: "Rolled oats, dehydrated vegetables, spice mix, salt, anticaking agent (E551).",
    approval: "approved",
    approvalNote: "Approved for sale.",
  },
  {
    id: "aloo-bhujia",
    name: "Aloo Bhujia Namkeen",
    brand: "Chatpata",
    category: "Chips & snacks",
    barcode: "8901234500110",
    kcal: 560,
    sugar: 2,
    satFat: 16,
    sodium: 1100,
    fibre: 5,
    protein: 14,
    additives: ["Palm oil"],
    ingredients: "Gram flour, potato, palm oil, spices, salt.",
    approval: "approved",
    approvalNote: "Approved for sale. High in fat and salt.",
  },
  {
    id: "choco-protein-bar",
    name: "Choco Protein Bar",
    brand: "FitSnap",
    category: "Bars",
    barcode: "8901234500127",
    kcal: 400,
    sugar: 22,
    satFat: 6,
    sodium: 180,
    fibre: 5,
    protein: 20,
    additives: ["E322", "Sweetener (E955)", "Artificial flavour", "Maltodextrin"],
    ingredients: "Whey protein, dates, cocoa, nuts, maltodextrin, sweetener (E955), emulsifier (E322).",
    approval: "review",
    approvalNote: "Protein claim is under review.",
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function findByBarcode(code: string) {
  const c = code.replace(/\s|-/g, "");
  return products.find((p) => p.barcode === c);
}

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

/** Junk percentage 0-100: higher means more junk. Per 100 g / 100 ml. */
export function junkPercent(p: Product) {
  const sugar = Math.min(p.sugar / 22.5, 1) * 25;
  const sat = Math.min(p.satFat / 5, 1) * 20;
  const sodium = Math.min(p.sodium / 600, 1) * 25;
  const energy = Math.min(p.kcal / 500, 1) * 10;
  const additives = Math.min(p.additives.length / 6, 1) * 20;
  const good = Math.min(p.fibre / 6, 1) * 8 + Math.min(p.protein / 20, 1) * 7;
  return Math.round(clamp(sugar + sat + sodium + energy + additives - good));
}

/** Health score 0-100: higher is better. */
export function healthScore(p: Product) {
  return 100 - junkPercent(p);
}

export function verdictOf(score: number): Verdict {
  if (score >= 65) return "good";
  if (score >= 40) return "ok";
  return "bad";
}

export const verdictMeta: Record<
  Verdict,
  { label: string; short: string; badge: string; soft: string; stroke: string; bar: string }
> = {
  good: {
    label: "Fine to eat regularly",
    short: "Eat freely",
    badge: "bg-good text-good-foreground",
    soft: "bg-good-soft text-good",
    stroke: "stroke-good",
    bar: "bg-good",
  },
  ok: {
    label: "Okay only occasionally",
    short: "Occasionally",
    badge: "bg-warn text-warn-foreground",
    soft: "bg-warn-soft text-warn-foreground",
    stroke: "stroke-warn",
    bar: "bg-warn",
  },
  bad: {
    label: "Best to avoid",
    short: "Avoid",
    badge: "bg-bad text-bad-foreground",
    soft: "bg-bad-soft text-bad",
    stroke: "stroke-bad",
    bar: "bg-bad",
  },
};

export const approvalMeta: Record<ApprovalStatus, { label: string; badge: string }> = {
  approved: { label: "Approved", badge: "bg-good-soft text-good" },
  review: { label: "Under review", badge: "bg-warn-soft text-warn-foreground" },
  "not-approved": { label: "Not approved", badge: "bg-bad-soft text-bad" },
};

export type NutrientKind = "sugar" | "satFat" | "sodium";
const thresholds: Record<NutrientKind, [number, number]> = {
  sugar: [5, 22.5],
  satFat: [1.5, 5],
  sodium: [120, 600],
};

export function nutrientLevel(kind: NutrientKind, value: number): "low" | "medium" | "high" {
  const [mid, high] = thresholds[kind];
  if (value > high) return "high";
  if (value > mid) return "medium";
  return "low";
}

export const levelClass = {
  low: { chip: "bg-good-soft text-good", bar: "bg-good", width: "w-1/4" },
  medium: { chip: "bg-warn-soft text-warn-foreground", bar: "bg-warn", width: "w-2/4" },
  high: { chip: "bg-bad-soft text-bad", bar: "bg-bad", width: "w-full" },
} as const;
