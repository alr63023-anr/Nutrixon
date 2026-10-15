import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register a product | Nutrixon" },
      { name: "description", content: "Submit a packaged food product with its label details for safety review." },
      { property: "og:title", content: "Register a product | Nutrixon" },
      { property: "og:description", content: "Submit a packaged food product with its label details for safety review." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

type Status = "pending" | "approved" | "rejected";
interface Submission {
  id: string;
  company: string;
  product: string;
  category: string;
  fssai: string;
  ingredients: string;
  status: Status;
  date: string;
}

const KEY = "nutrixon-registrations";
const statusMeta: Record<Status, { label: string; cls: string }> = {
  pending: { label: "Pending review", cls: "bg-warn-soft text-warn-foreground" },
  approved: { label: "Approved (demo)", cls: "bg-good-soft text-good" },
  rejected: { label: "Rejected (demo)", cls: "bg-bad-soft text-bad" },
};

const empty = { company: "", product: "", category: "", fssai: "", ingredients: "" };

function RegisterPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
    } catch {}
  }, []);

  const save = (next: Submission[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.product.trim() || !form.ingredients.trim()) {
      setError("Please fill in company, product name and ingredients.");
      return;
    }
    if (!/^\d{14}$/.test(form.fssai.trim())) {
      setError("FSSAI licence number must be 14 digits.");
      return;
    }
    setError("");
    save([
      { ...form, id: crypto.randomUUID(), status: "pending", date: new Date().toLocaleDateString("en-IN") },
      ...items,
    ]);
    setForm(empty);
  };

  const setStatus = (id: string, status: Status) =>
    save(items.map((i) => (i.id === id ? { ...i, status } : i)));

  const field = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Product registration portal</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Food companies can submit a product for safety review. Every submission starts as “Pending review”.
      </p>
      <p className="mt-3 max-w-2xl rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn-foreground">
        Demo only: this portal is not connected to FSSAI. Approvals here are not official government approvals.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-6">
          <h2 className="font-display text-xl font-bold">New submission</h2>
          <input className={field} placeholder="Company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <input className={field} placeholder="Product name" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
          <input className={field} placeholder="Category (e.g. Biscuits)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className={field} placeholder="FSSAI licence number (14 digits)" inputMode="numeric" value={form.fssai} onChange={(e) => setForm({ ...form, fssai: e.target.value })} />
          <textarea className={field} rows={3} placeholder="Ingredients as on the label" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
          {error && <p className="text-sm text-bad">{error}</p>}
          <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Submit for review
          </button>
        </form>

        <div>
          <h2 className="font-display text-xl font-bold">Submissions ({items.length})</h2>
          {items.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No products submitted yet.</p>}
          <ul className="mt-3 space-y-3">
            {items.map((i) => (
              <li key={i.id} className="rounded-2xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{i.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {i.company} · {i.category || "Uncategorised"} · FSSAI {i.fssai} · {i.date}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusMeta[i.status].cls}`}>
                    {statusMeta[i.status].label}
                  </span>
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="text-muted-foreground">Reviewer (demo):</span>
                  <button onClick={() => setStatus(i.id, "approved")} className="rounded-full bg-good-soft px-2.5 py-1 font-semibold text-good">Approve</button>
                  <button onClick={() => setStatus(i.id, "rejected")} className="rounded-full bg-bad-soft px-2.5 py-1 font-semibold text-bad">Reject</button>
                  <button onClick={() => save(items.filter((x) => x.id !== i.id))} className="ml-auto text-muted-foreground hover:text-foreground">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
