import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  canApprove,
  regulatoryRules,
  routeMeta,
  screenSubmission,
  severityMeta,
  type ReviewRoute,
  type ScreeningInput,
  type ScreeningResult,
} from "@/lib/screening";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Pre-launch ingredient screening | Nutrixon" },
      {
        name: "description",
        content:
          "Companies submit ingredient lists for structured checks before launch. Nutrixon flags regulatory concerns and missing information, then routes each case for review.",
      },
      { property: "og:title", content: "Pre-launch ingredient screening | Nutrixon" },
      {
        property: "og:description",
        content:
          "Submit a packaged food product with its ingredient list and label details. Every case is screened before a reviewer sees it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

type Status = "pending" | "approved" | "rejected";

interface Submission extends ScreeningInput {
  id: string;
  status: Status;
  date: string;
  result: ScreeningResult;
}

const KEY = "nutrixon-registrations";

const statusMeta: Record<Status, { label: string; cls: string }> = {
  pending: { label: "Awaiting review", cls: "bg-warn-soft text-warn-foreground" },
  approved: { label: "Approved (demo)", cls: "bg-good-soft text-good" },
  rejected: { label: "Rejected (demo)", cls: "bg-bad-soft text-bad" },
};

const empty: ScreeningInput = {
  company: "",
  product: "",
  category: "",
  fssai: "",
  ingredients: "",
  kcal: "",
  sugar: "",
  satFat: "",
  sodium: "",
  bestBefore: "",
  batch: "",
  claims: "",
  logo: false,
  vegMark: false,
  allergens: false,
  substantiation: false,
};

const queueOrder: ReviewRoute[] = ["priority", "standard", "returned"];

/** Old saved rows predate screening, so fill the new fields and screen them now. */
function hydrate(raw: unknown): Submission | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Submission>;
  const input: ScreeningInput = {
    company: r.company ?? "",
    product: r.product ?? "",
    category: r.category ?? "",
    fssai: r.fssai ?? "",
    ingredients: r.ingredients ?? "",
    kcal: r.kcal ?? "",
    sugar: r.sugar ?? "",
    satFat: r.satFat ?? "",
    sodium: r.sodium ?? "",
    bestBefore: r.bestBefore ?? "",
    batch: r.batch ?? "",
    claims: r.claims ?? "",
    logo: Boolean(r.logo),
    vegMark: Boolean(r.vegMark),
    allergens: Boolean(r.allergens),
    substantiation: Boolean(r.substantiation),
  };
  return {
    ...input,
    id: r.id ?? crypto.randomUUID(),
    status: r.status ?? "pending",
    date: r.date ?? new Date().toLocaleDateString("en-IN"),
    result: r.result ?? screenSubmission(input),
  };
}

const field =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const label = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

function RegisterPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [form, setForm] = useState<ScreeningInput>(empty);
  const [checked, setChecked] = useState<ScreeningResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const raw: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
      const rows = Array.isArray(raw) ? raw.map(hydrate).filter((x): x is Submission => x !== null) : [];
      setItems(rows);
    } catch {
      setItems([]);
    }
  }, []);

  const save = (next: Submission[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const set = <K extends keyof ScreeningInput>(k: K, v: ScreeningInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const runCheck = () => {
    setChecked(screenSubmission(form));
    setSubmitted(false);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = screenSubmission(form);
    setChecked(result);
    setSubmitted(true);
    save([
      {
        ...form,
        id: crypto.randomUUID(),
        status: "pending",
        date: new Date().toLocaleDateString("en-IN"),
        result,
      },
      ...items,
    ]);
  };

  const setStatus = (id: string, status: Status) => save(items.map((i) => (i.id === id ? { ...i, status } : i)));
  const remove = (id: string) => save(items.filter((x) => x.id !== id));

  const grouped = useMemo(
    () =>
      queueOrder
        .map((route) => ({ route, list: items.filter((i) => i.result.route === route) }))
        .filter((g) => g.list.length > 0),
    [items],
  );

  const bannedCount = regulatoryRules.filter((r) => r.severity === "banned").length;
  const restrictedCount = regulatoryRules.filter((r) => r.severity === "restricted").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">Core differentiator</p>
      <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight">
        Ingredient screening before launch
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Companies submit the ingredient list and label details. Nutrixon runs structured checks against the
        configured regulatory concerns, lists what is missing, then routes the case to the right review queue.
      </p>
      <p className="mt-3 max-w-2xl rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn-foreground">
        Demo only: the rule set is illustrative and this portal is not connected to FSSAI. Approvals here are not
        official government approvals.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-6">
            <h2 className="font-display text-xl font-bold">New submission</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className={label}>Company name</span>
                <input className={field} value={form.company} onChange={(e) => set("company", e.target.value)} />
              </label>
              <label className="space-y-1">
                <span className={label}>Product name</span>
                <input className={field} value={form.product} onChange={(e) => set("product", e.target.value)} />
              </label>
              <label className="space-y-1">
                <span className={label}>Category</span>
                <input
                  className={field}
                  placeholder="e.g. Biscuits"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className={label}>FSSAI licence number (14 digits)</span>
                <input
                  className={field}
                  inputMode="numeric"
                  value={form.fssai}
                  onChange={(e) => set("fssai", e.target.value)}
                />
              </label>
            </div>

            <label className="block space-y-1">
              <span className={label}>Ingredients as on the label</span>
              <textarea
                className={field}
                rows={3}
                placeholder="Wheat flour, palm oil, sugar, salt, colour (E102)..."
                value={form.ingredients}
                onChange={(e) => set("ingredients", e.target.value)}
              />
            </label>

            <div>
              <p className={label}>Nutrition per 100 g / 100 ml</p>
              <div className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(
                  [
                    ["kcal", "Energy kcal"],
                    ["sugar", "Sugar g"],
                    ["satFat", "Sat fat g"],
                    ["sodium", "Sodium mg"],
                  ] as const
                ).map(([k, ph]) => (
                  <input
                    key={k}
                    className={field}
                    type="number"
                    inputMode="decimal"
                    placeholder={ph}
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className={label}>Best before / use-by date</span>
                <input
                  className={field}
                  type="date"
                  value={form.bestBefore}
                  onChange={(e) => set("bestBefore", e.target.value)}
                />
              </label>
              <label className="space-y-1">
                <span className={label}>Batch number</span>
                <input className={field} value={form.batch} onChange={(e) => set("batch", e.target.value)} />
              </label>
            </div>

            <label className="block space-y-1">
              <span className={label}>Claims on the pack (if any)</span>
              <input
                className={field}
                placeholder="e.g. High in protein, No added sugar"
                value={form.claims}
                onChange={(e) => set("claims", e.target.value)}
              />
            </label>

            <div className="space-y-2">
              <p className={label}>On-pack declarations</p>
              {(
                [
                  ["logo", "FSSAI logo and licence number printed on the pack"],
                  ["vegMark", "Green or brown veg / non-veg mark present"],
                  ["allergens", "Allergens declared in bold on the label"],
                  ["substantiation", "Evidence attached for the pack claim"],
                ] as const
              ).map(([k, text]) => (
                <label key={k} className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 accent-primary"
                    checked={form[k]}
                    onChange={(e) => set(k, e.target.checked)}
                  />
                  <span>{text}</span>
                </label>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={runCheck}
                className="rounded-full border border-input px-5 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Run screening check
              </button>
              <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Submit for review
              </button>
            </div>
          </form>

          {checked && (
            <section className="rounded-2xl border bg-card p-6" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-xl font-bold">Screening result</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${routeMeta[checked.route].cls}`}
                >
                  {routeMeta[checked.route].label}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{routeMeta[checked.route].blurb}</p>
              {submitted && (
                <p className="mt-2 text-sm text-primary">Saved to the review queue below.</p>
              )}

              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-bold">
                  Regulatory concerns ({checked.flags.length})
                </h3>
                {checked.flags.length === 0 && (
                  <p className="text-sm text-muted-foreground">No configured concern matched this list.</p>
                )}
                <ul className="space-y-2">
                  {checked.flags.map((f) => (
                    <li key={f.id} className="rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${severityMeta[f.severity].cls}`}
                        >
                          {severityMeta[f.severity].label}
                        </span>
                        <span className="font-semibold">{f.label}</span>
                        <span className="text-xs text-muted-foreground">matched “{f.matched}”</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{f.reason}</p>
                      <p className="mt-1 text-xs font-semibold text-primary">Fix: {f.action}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-bold">Missing information ({checked.missing.length})</h3>
                {checked.missing.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nothing missing. The case is complete.</p>
                )}
                <ul className="space-y-1 text-sm">
                  {checked.missing.map((m) => (
                    <li key={m.id}>
                      <span className="font-semibold">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.why}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <details className="rounded-2xl border bg-card p-5 text-sm">
            <summary className="cursor-pointer font-semibold">
              Configured concerns ({bannedCount} banned, {restrictedCount} restricted)
            </summary>
            <ul className="mt-3 space-y-2">
              {regulatoryRules.map((r) => (
                <li key={r.id}>
                  <span className={`mr-2 rounded-full px-2 py-0.5 text-[11px] font-bold ${severityMeta[r.severity].cls}`}>
                    {severityMeta[r.severity].label}
                  </span>
                  <span className="font-semibold">{r.label}</span>
                  <span className="block text-xs text-muted-foreground">{r.reason}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold">Review queue ({items.length})</h2>
          {items.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Nothing submitted yet. Every case is screened before it lands here.
            </p>
          )}

          <div className="mt-3 space-y-6">
            {grouped.map(({ route, list }) => (
              <section key={route}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide">{routeMeta[route].label}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${routeMeta[route].cls}`}>
                    {list.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{routeMeta[route].blurb}</p>
                <ul className="mt-3 space-y-3">
                  {list.map((i) => {
                    const blocked = !canApprove(i.result);
                    return (
                      <li key={i.id} className="rounded-2xl border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{i.product || "Untitled product"}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {i.company || "No company"} · {i.category || "Uncategorised"} · FSSAI{" "}
                              {i.fssai || "missing"} · {i.date}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta[i.status].cls}`}
                          >
                            {statusMeta[i.status].label}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {i.result.flags.slice(0, 4).map((f) => (
                            <span
                              key={f.id}
                              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityMeta[f.severity].cls}`}
                            >
                              {severityMeta[f.severity].label}: {f.label}
                            </span>
                          ))}
                          {i.result.missing.length > 0 && (
                            <span className="rounded-full bg-bad-soft px-2 py-0.5 text-[11px] font-semibold text-bad">
                              {i.result.missing.length} missing
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-muted-foreground">Reviewer (demo):</span>
                          <button
                            onClick={() => setStatus(i.id, "approved")}
                            disabled={blocked}
                            className="rounded-full bg-good-soft px-2.5 py-1 font-semibold text-good disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setStatus(i.id, "rejected")}
                            className="rounded-full bg-bad-soft px-2.5 py-1 font-semibold text-bad"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => remove(i.id)}
                            className="ml-auto text-muted-foreground hover:text-foreground"
                          >
                            Delete
                          </button>
                        </div>
                        {blocked && (
                          <p className="mt-2 text-xs text-bad">
                            Cannot approve: {" "}
                            {i.result.missing.length > 0 &&
                              `${i.result.missing.length} item(s) still missing. `}
                            {i.result.flags.some((f) => f.severity === "banned") &&
                              "A banned ingredient is still in the list."}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
