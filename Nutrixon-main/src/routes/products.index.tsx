import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/nutri";
import { approvalMeta, healthScore, products, type ApprovalStatus } from "@/lib/products";

const statuses: ApprovalStatus[] = ["approved", "review", "not-approved"];

export const Route = createFileRoute("/products/")({
  validateSearch: (s: Record<string, unknown>): { q?: string | undefined; status?: ApprovalStatus | undefined } => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    status: statuses.includes(s["status"] as ApprovalStatus) ? (s["status"] as ApprovalStatus) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Search food products | Nutrixon" },
      { name: "description", content: "Search packaged foods and compare junk percentage, score and approval status." },
      { property: "og:title", content: "Search food products | Nutrixon" },
      { property: "og:description", content: "Search packaged foods and compare junk percentage, score and approval status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, status } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const term = (q ?? "").toLowerCase();
  const list = products
    .filter((p) => !status || p.approval === status)
    .filter((p) => !term || `${p.name} ${p.brand} ${p.category} ${p.barcode}`.toLowerCase().includes(term))
    .sort((a, b) => healthScore(b) - healthScore(a));

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
    }`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Food products</h1>
      <input
        value={q ?? ""}
        onChange={(e) => navigate({ search: (prev) => ({ ...prev, q: e.target.value || undefined }), replace: true })}
        placeholder="Search by name, brand, category or barcode"
        aria-label="Search products"
        className="mt-5 w-full rounded-full border bg-card px-5 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <button className={chip(!status)} onClick={() => navigate({ search: (prev) => ({ ...prev, status: undefined }) })}>
          All
        </button>
        {statuses.map((s) => (
          <button key={s} className={chip(status === s)} onClick={() => navigate({ search: (prev) => ({ ...prev, status: s }) })}>
            {approvalMeta[s].label}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{list.length} products, best score first</p>
      <div className="mt-3 space-y-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {list.length === 0 && (
          <div className="card-surface p-8 text-center text-muted-foreground">No products match your search.</div>
        )}
      </div>
    </div>
  );
}
