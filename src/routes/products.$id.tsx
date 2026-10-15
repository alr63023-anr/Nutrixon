import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ApprovalBadge, ScoreRing } from "@/components/nutri";
import {
  getProduct,
  healthScore,
  junkPercent,
  levelClass,
  nutrientLevel,
  verdictMeta,
  verdictOf,
  type NutrientKind,
} from "@/lib/products";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} score and approval | Nutrixon` : "Product not found | Nutrixon";
    const desc = loaderData
      ? `${loaderData.name} by ${loaderData.brand}: ${junkPercent(loaderData)}% junk, health score ${healthScore(loaderData)}/100.`
      : "This product could not be found.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const score = healthScore(p);
  const junk = junkPercent(p);
  const meta = verdictMeta[verdictOf(score)];

  const rows: { label: string; kind?: NutrientKind; value: number; unit: string }[] = [
    { label: "Sugar", kind: "sugar", value: p.sugar, unit: "g" },
    { label: "Saturated fat", kind: "satFat", value: p.satFat, unit: "g" },
    { label: "Sodium (salt)", kind: "sodium", value: p.sodium, unit: "mg" },
    { label: "Fibre", value: p.fibre, unit: "g" },
    { label: "Protein", value: p.protein, unit: "g" },
    { label: "Energy", value: p.kcal, unit: "kcal" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/products" className="text-sm text-muted-foreground hover:text-foreground">
        ← All products
      </Link>
      <div className="card-surface mt-4 p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={score} size={150} />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {p.brand} · {p.category}
            </p>
            <h1 className="text-3xl font-extrabold">{p.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${meta.badge}`}>{meta.label}</span>
              <ApprovalBadge status={p.approval} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Barcode {p.barcode}</p>
          </div>
        </div>

        <div className={`mt-6 rounded-xl p-4 ${meta.soft}`}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Junk percentage</span>
            <span className="font-display text-2xl font-extrabold">{junk}%</span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-card/70">
            <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${junk}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card-surface p-6">
          <h2 className="text-xl font-bold">Per 100 g / 100 ml</h2>
          <ul className="mt-4 space-y-4">
            {rows.map((r) => {
              const lvl = r.kind ? nutrientLevel(r.kind, r.value) : null;
              return (
                <li key={r.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{r.label}</span>
                    <span className="flex items-center gap-2">
                      {r.value} {r.unit}
                      {lvl && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelClass[lvl].chip}`}>
                          {lvl}
                        </span>
                      )}
                    </span>
                  </div>
                  {lvl && (
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className={`h-full rounded-full ${levelClass[lvl].bar} ${levelClass[lvl].width}`} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card-surface p-6">
            <h2 className="text-xl font-bold">Approval</h2>
            <div className="mt-3">
              <ApprovalBadge status={p.approval} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.approvalNote}</p>
          </section>
          <section className="card-surface p-6">
            <h2 className="text-xl font-bold">Additives</h2>
            {p.additives.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No additives listed.</p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.additives.map((a) => (
                  <li key={a} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                    {a}
                  </li>
                ))}
              </ul>
            )}
            <h3 className="mt-5 text-sm font-bold">Ingredients</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.ingredients}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
