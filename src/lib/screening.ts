// Configured pre-launch ingredient screening.
// Rule sets are illustrative samples for a demo, not the live FSSAI regulation text.

import { nutrientLevel } from "@/lib/products";

export type Severity = "banned" | "restricted" | "watch";
export type ReviewRoute = "returned" | "priority" | "standard";

export interface ScreeningInput {
  company: string;
  product: string;
  category: string;
  fssai: string;
  ingredients: string;
  kcal: string;
  sugar: string;
  satFat: string;
  sodium: string;
  bestBefore: string;
  batch: string;
  claims: string;
  logo: boolean;
  vegMark: boolean;
  allergens: boolean;
  substantiation: boolean;
}

export interface RegulatoryRule {
  id: string;
  label: string;
  severity: Severity;
  pattern: RegExp;
  reason: string;
  action: string;
}

/** Configured regulatory concerns matched against the submitted ingredient list. */
export const regulatoryRules: RegulatoryRule[] = [
  {
    id: "ethylene-oxide",
    label: "Ethylene oxide residue",
    severity: "banned",
    pattern: /\bethyle?ne\s*oxide\b|\beto\b/i,
    reason: "Prohibited fumigant residue. Not permitted in food sold in India.",
    action: "Attach a lab test report showing no ethylene oxide residue.",
  },
  {
    id: "carbendazim",
    label: "Carbendazim",
    severity: "banned",
    pattern: /\bcarbendazim\b/i,
    reason: "Prohibited pesticide residue in packaged food.",
    action: "Remove from the formulation or supply residue test results.",
  },
  {
    id: "sudan-dye",
    label: "Sudan colour",
    severity: "banned",
    pattern: /\bsudan\b/i,
    reason: "Industrial dye, not permitted as a food colour.",
    action: "Replace with a permitted colour and re-submit the label.",
  },
  {
    id: "potassium-bromate",
    label: "Potassium bromate",
    severity: "banned",
    pattern: /\bpotassium\s*bromate\b/i,
    reason: "Prohibited flour improver.",
    action: "Remove from the flour treatment list.",
  },
  {
    id: "trans-fat",
    label: "Artificial trans fat",
    severity: "banned",
    pattern: /\bpartially\s*hydrogenated\b|\btrans\s*fats?\b|\bvanaspati\b/i,
    reason: "Prohibited above the permitted limit in India.",
    action: "Switch to palm olein or another non-trans fat, then re-submit.",
  },
  {
    id: "e102",
    label: "E102 (tartrazine)",
    severity: "restricted",
    pattern: /\be\s*-?\s*102\b|\btartrazine\b/i,
    reason: "Restricted colour. Must be declared and can trigger reactions in sensitive people.",
    action: "Print 'contains permitted colour (E102)' on the front of pack.",
  },
  {
    id: "e110",
    label: "E110 (sunset yellow)",
    severity: "restricted",
    pattern: /\be\s*-?\s*110\b|\bsunset\s*yellow\b/i,
    reason: "Restricted colour linked to hyperactivity in children.",
    action: "Add the warning statement required for restricted colours.",
  },
  {
    id: "e211",
    label: "E211 (sodium benzoate)",
    severity: "restricted",
    pattern: /\be\s*-?\s*211\b|\bsodium\s*benzoate\b/i,
    reason: "Permitted only in some categories and up to a limit.",
    action: "Confirm the category and the used amount against the permitted limit.",
  },
  {
    id: "e621",
    label: "E621 (MSG)",
    severity: "restricted",
    pattern: /\be\s*-?\s*621\b|\bmonosodium\s*glutamate\b|\bmsg\b/i,
    reason: "Flavour enhancer that must be declared by name.",
    action: "Declare 'added flavour enhancer (E621)' on the label.",
  },
  {
    id: "aspartame",
    label: "Aspartame (E951)",
    severity: "restricted",
    pattern: /\baspartame\b|\be\s*-?\s*951\b/i,
    reason: "Needs a phenylalanine warning for people with phenylketonuria.",
    action: "Add the mandatory phenylalanine warning statement.",
  },
  {
    id: "refined-palm-oil",
    label: "Refined palm oil",
    severity: "restricted",
    pattern: /\bpalm\s+olein\b|\bpalm\s+oil\b|\bpalm\s*fats?\b/i,
    reason: "Refined vegetable fats must be declared as 'refined' with the source named.",
    action: "Change the label wording to 'refined palm oil'.",
  },
  {
    id: "carrageenan",
    label: "Carrageenan (E407)",
    severity: "restricted",
    pattern: /\bcarrageenan\b|\be\s*-?\s*407\b/i,
    reason: "Not permitted in infant and young child formula.",
    action: "Confirm the product is not sold as infant food.",
  },
  {
    id: "glucose-syrup",
    label: "Glucose or maltodextrin syrup",
    severity: "watch",
    pattern: /\bglucose\s*syrup\b|\bmaltodextrin\b|\binvert\s*syrup\b/i,
    reason: "Free sugars that must count toward the declared added-sugar figure.",
    action: "Include these in the added sugar declaration.",
  },
  {
    id: "artificial-flavour",
    label: "Artificial flavour",
    severity: "watch",
    pattern: /\bartificial\s*flavours?\b|\bsynthetic\s*flavours?\b/i,
    reason: "Must be declared as artificial; cannot support a 'natural' claim.",
    action: "Remove any 'natural' claim or drop the artificial flavour.",
  },
];

export interface ScreeningFlag extends RegulatoryRule {
  matched: string;
}

export interface MissingItem {
  id: string;
  label: string;
  why: string;
}

export interface ScreeningResult {
  flags: ScreeningFlag[];
  missing: MissingItem[];
  route: ReviewRoute;
}

const num = (s: string) => {
  const n = Number(String(s).replace(/,/g, "").trim());
  return String(s).trim() === "" || Number.isNaN(n) ? null : n;
};

/** Required information a case must carry before a reviewer can look at it. */
export function findMissing(s: ScreeningInput): MissingItem[] {
  const out: MissingItem[] = [];
  const need = (id: string, label: string, why: string, bad: boolean) => {
    if (bad) out.push({ id, label, why });
  };

  need("company", "Company name", "Every case needs a legal entity behind it.", !s.company.trim());
  need("product", "Product name", "Reviewers need the name as printed on the pack.", !s.product.trim());
  need("category", "Category", "The permitted additive limits depend on the category.", !s.category.trim());
  need(
    "fssai",
    "FSSAI licence number",
    "A licence number is 14 digits and proves the company is registered.",
    !/^\d{14}$/.test(s.fssai.trim()),
  );
  need(
    "ingredients",
    "Ingredient list",
    "Screening needs the full ingredient list as printed, longest to shortest.",
    s.ingredients.trim().length < 12,
  );

  const nutrition: [keyof ScreeningInput, string][] = [
    ["kcal", "Energy"],
    ["sugar", "Sugar"],
    ["satFat", "Saturated fat"],
    ["sodium", "Sodium"],
  ];
  const nutritionBad = nutrition.filter(([key]) => {
    const v = num(s[key] as string);
    return v === null || v < 0;
  });
  need(
    "nutrition",
    `Nutrition per 100 g (${nutritionBad.map(([, pretty]) => pretty).join(", ")})`,
    "Nutrient figures per 100 g are needed to check the limits.",
    nutritionBad.length > 0,
  );

  need(
    "bestBefore",
    "Best before or use-by date",
    "Shelf life is part of the label check.",
    !s.bestBefore.trim(),
  );
  need("batch", "Batch number", "Cases must be traceable to a batch.", !s.batch.trim());
  need(
    "logo",
    "FSSAI logo and licence number on label",
    "The pack must carry the logo and licence number.",
    !s.logo,
  );
  need("vegMark", "Green or brown veg/non-veg mark", "Mandatory mark on the pack.", !s.vegMark);
  need(
    "allergens",
    "Allergen declaration",
    "Declared allergens must be listed in bold on the label.",
    !s.allergens,
  );
  need(
    "claims",
    "Claim substantiation",
    "A pack claim needs evidence attached before review.",
    s.claims.trim().length > 0 && !s.substantiation,
  );

  return out;
}

/** Match the ingredient list against the configured regulatory concerns. */
export function findConcerns(s: ScreeningInput): ScreeningFlag[] {
  const text = `${s.ingredients} ${s.claims}`;
  const flags: ScreeningFlag[] = [];

  for (const rule of regulatoryRules) {
    const hit = text.match(rule.pattern);
    if (hit) flags.push({ ...rule, matched: hit[0] });
  }

  const sugar = num(s.sugar);
  const satFat = num(s.satFat);
  const sodium = num(s.sodium);

  if (sugar !== null && nutrientLevel("sugar", sugar) === "high") {
    flags.push({
      id: "sugar-high",
      label: "Added sugar above 22.5 g per 100 g",
      severity: "watch",
      pattern: /^$/,
      reason: "Above the high-sugar level used for labelling warnings.",
      action: "Reformulate or add the front-of-pack high sugar warning.",
      matched: `${sugar} g`,
    });
  }
  if (satFat !== null && nutrientLevel("satFat", satFat) === "high") {
    flags.push({
      id: "satfat-high",
      label: "Saturated fat above 5 g per 100 g",
      severity: "watch",
      pattern: /^$/,
      reason: "Above the high saturated fat level used for labelling warnings.",
      action: "Reformulate or add the front-of-pack high in saturated fat warning.",
      matched: `${satFat} g`,
    });
  }
  if (sodium !== null && nutrientLevel("sodium", sodium) === "high") {
    flags.push({
      id: "sodium-high",
      label: "Sodium above 600 mg per 100 g",
      severity: "watch",
      pattern: /^$/,
      reason: "Above the high-salt level used for labelling warnings.",
      action: "Reformulate or add the front-of-pack high salt warning.",
      matched: `${sodium} mg`,
    });
  }

  return flags;
}

/** Where a screened case goes. */
export function routeFor(flags: ScreeningFlag[], missing: MissingItem[]): ReviewRoute {
  if (missing.length > 0 || flags.some((f) => f.severity === "banned")) return "returned";
  if (flags.some((f) => f.severity === "restricted")) return "priority";
  return "standard";
}

export function screenSubmission(s: ScreeningInput): ScreeningResult {
  const flags = findConcerns(s);
  const missing = findMissing(s);
  return { flags, missing, route: routeFor(flags, missing) };
}

/** A banned concern or a missing item blocks sign-off. */
export function canApprove(r: ScreeningResult) {
  return r.missing.length === 0 && !r.flags.some((f) => f.severity === "banned");
}

export const severityMeta: Record<Severity, { label: string; cls: string }> = {
  banned: { label: "Banned", cls: "bg-bad-soft text-bad" },
  restricted: { label: "Restricted", cls: "bg-warn-soft text-warn-foreground" },
  watch: { label: "Watch", cls: "bg-secondary text-secondary-foreground" },
};

export const routeMeta: Record<ReviewRoute, { label: string; blurb: string; cls: string }> = {
  returned: {
    label: "Returned for information",
    blurb: "Missing documents or a banned ingredient. The company must fix and re-submit.",
    cls: "bg-bad-soft text-bad",
  },
  priority: {
    label: "Priority review",
    blurb: "A restricted substance was flagged, so an officer looks at this first.",
    cls: "bg-warn-soft text-warn-foreground",
  },
  standard: {
    label: "Standard review",
    blurb: "No concerns and nothing missing. Queued for the normal check.",
    cls: "bg-good-soft text-good",
  },
};
