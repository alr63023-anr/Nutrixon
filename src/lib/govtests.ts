// Sample government safety test panel. Illustrative only — not real FSSAI lab results.
import type { Product } from "@/lib/products";

export type TestResult = "pass" | "pending" | "fail";

export interface GovTest {
  id: string;
  name: string;
  checks: string;
}

export const govTests: GovTest[] = [
  { id: "microbial", name: "Microbiological safety", checks: "E. coli, Salmonella, yeast & mould counts" },
  { id: "pesticide", name: "Pesticide residue", checks: "Residues within permitted maximum limits" },
  { id: "metals", name: "Heavy metals", checks: "Lead, arsenic, cadmium, mercury" },
  { id: "adulteration", name: "Adulteration check", checks: "No harmful fillers, dyes or substitutes" },
  { id: "additives", name: "Additive & colour limits", checks: "Only permitted additives, within limits" },
  { id: "nutrition", name: "Nutrition label verification", checks: "Lab values match the pack label" },
  { id: "label", name: "Label & claims review", checks: "Claims are truthful and substantiated" },
  { id: "packaging", name: "Packaging safety", checks: "No harmful migration from packaging" },
];

export interface TestOutcome extends GovTest {
  result: TestResult;
}

export function testsFor(p: Product): TestOutcome[] {
  const note = p.approvalNote.toLowerCase();
  const flagged = note.includes("colour") ? "additives" : "label";
  return govTests.map((t) => {
    let result: TestResult = "pass";
    if (t.id === flagged && p.approval === "review") result = "pending";
    if (t.id === flagged && p.approval === "not-approved") result = "fail";
    return { ...t, result };
  });
}

export function testSummary(p: Product) {
  const r = testsFor(p);
  return { passed: r.filter((t) => t.result === "pass").length, total: r.length };
}

export const resultMeta: Record<TestResult, { label: string; chip: string; icon: string }> = {
  pass: { label: "Passed", chip: "bg-good-soft text-good", icon: "✓" },
  pending: { label: "Pending", chip: "bg-warn-soft text-warn", icon: "…" },
  fail: { label: "Failed", chip: "bg-bad-soft text-bad", icon: "✕" },
};
