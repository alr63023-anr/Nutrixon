import { describe, expect, it } from "vitest";

import {
  canApprove,
  findConcerns,
  findMissing,
  screenSubmission,
  type ScreeningInput,
} from "@/lib/screening";

const base: ScreeningInput = {
  company: "Desi Bites Foods Pvt Ltd",
  product: "Roasted Chana",
  category: "Healthy snacks",
  fssai: "10021054001234",
  ingredients: "Roasted Bengal gram, rock salt.",
  kcal: "370",
  sugar: "2",
  satFat: "0.8",
  sodium: "300",
  bestBefore: "2027-03-31",
  batch: "B-2214",
  claims: "",
  logo: true,
  vegMark: true,
  allergens: true,
  substantiation: true,
};

describe("Pre-launch ingredient screening", () => {
  it("returns a complete, clean case to the standard review queue", () => {
    const r = screenSubmission(base);
    expect(r.flags).toEqual([]);
    expect(r.missing).toEqual([]);
    expect(r.route).toBe("standard");
    expect(canApprove(r)).toBe(true);
  });

  it("routes a case carrying a restricted colour to priority review", () => {
    const r = screenSubmission({
      ...base,
      product: "Orange Cream Biscuits",
      ingredients: "Refined wheat flour, sugar, palm oil, emulsifier (E471), colour (E102), flavour.",
    });
    expect(r.flags.map((f) => f.id)).toContain("e102");
    expect(r.missing).toEqual([]);
    expect(r.route).toBe("priority");
    expect(canApprove(r)).toBe(true);
  });

  it("returns a case containing a banned substance without a reviewer sign-off", () => {
    const r = screenSubmission({
      ...base,
      ingredients: "Wheat flour, salt, potassium bromate (flour improver).",
    });
    expect(r.flags.map((f) => f.id)).toContain("potassium-bromate");
    expect(r.route).toBe("returned");
    expect(canApprove(r)).toBe(false);
  });

  it("holds an incomplete FSSAI licence number as missing information", () => {
    const r = screenSubmission({ ...base, fssai: "100210540012" });
    expect(r.missing.map((m) => m.id)).toContain("fssai");
    expect(r.route).toBe("returned");
    expect(canApprove(r)).toBe(false);
  });

  it("asks for claim evidence when the pack makes a claim", () => {
    const r = screenSubmission({ ...base, claims: "High in protein", substantiation: false });
    expect(r.missing.map((m) => m.id)).toContain("claims");
    expect(r.route).toBe("returned");
  });

  it("does not ask for claim evidence when no claim is made", () => {
    const r = screenSubmission({ ...base, claims: "", substantiation: false });
    expect(r.missing.map((m) => m.id)).not.toContain("claims");
  });

  it("flags sodium above 600 mg per 100 g as a watch concern", () => {
    const r = screenSubmission({ ...base, product: "Instant Masala Noodles", sodium: "1650" });
    expect(r.flags.map((f) => f.id)).toContain("sodium-high");
    expect(r.route).toBe("standard");
  });

  it("reports the missing nutrient fields by name", () => {
    const r = findMissing({ ...base, sodium: "", sugar: "" });
    const nutrition = r.find((m) => m.id === "nutrition");
    expect(nutrition?.label).toContain("Sugar");
    expect(nutrition?.label).toContain("Sodium");
  });

  it("matches a restricted flavour enhancer written as MSG", () => {
    const r = findConcerns({ ...base, ingredients: "Gram flour, spices, salt, MSG." });
    expect(r.map((f) => f.id)).toContain("e621");
  });
});
