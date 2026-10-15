import { createFileRoute, Link } from "@tanstack/react-router";
import { VerdictBadge } from "@/components/nutri";
import { govTests } from "@/lib/govtests";
import { approvalMeta, healthScore, products, type ApprovalStatus } from "@/lib/products";

export const Route = createFileRoute("/approvals")({
  head: () => ({
    meta: [
      { title: "Food approval list | Nutrixon" },
      { name: "description", content: "See which food products are approved, under review or not approved by the food safety authority." },
      { property: "og:title", content: "Food approval list | Nutrixon" },
      { property: "og:description", content: "See which food products are approved, under review or not approved by the food safety authority." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ApprovalsPage,
});

const groups: { status: ApprovalStatus; blurb: string }[] = [
  { status: "approved", blurb: "Cleared for sale in India." },
  { status: "review", blurb: "Claims or ingredients are being checked." },
  { status: "not-approved", blurb: "Failed a check. Avoid until cleared." },
];

function ApprovalsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Approval list</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Approval starts before launch: each product is screened for ingredient concerns and missing information
        first, then reviewed. Here is where each sample product stands.
      </p>
      <section className="card-surface mt-8 border-2 border-good p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-good">🛡 Government approved tag</p>
        <h2 className="mt-1 text-2xl font-bold">The {govTests.length} tests a product must pass to be approved to eat</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {govTests.map((t, i) => (
            <li key={t.id} className="rounded-xl bg-good-soft p-3">
              <p className="text-sm font-bold">{i + 1}. {t.name}</p>
              <p className="text-xs text-muted-foreground">{t.checks}</p>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">Sample test panel for demonstration; not official FSSAI lab results.</p>
      </section>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {groups.map((g) => {
          const list = products.filter((p) => p.approval === g.status);
          return (
            <section key={g.status} className="card-surface p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-bold">{approvalMeta[g.status].label}</h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${approvalMeta[g.status].badge}`}>
                  {list.length}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{g.blurb}</p>
              <ul className="mt-4 divide-y">
                {list.map((p) => (
                  <li key={p.id}>
                    <Link to="/products/$id" params={{ id: p.id }} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{p.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.brand} · score {healthScore(p)}
                        </span>
                      </span>
                      <VerdictBadge product={p} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
