import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/nutri";
import { healthScore, products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nutrixon: Is this food safe to eat?" },
      {
        name: "description",
        content:
          "Search any packaged food in India and see its junk percentage, health score and food safety approval status.",
      },
      { property: "og:title", content: "Nutrixon: Is this food safe to eat?" },
      {
        property: "og:description",
        content:
          "Search any packaged food in India and see its junk percentage, health score and food safety approval status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const sorted = [...products].sort((a, b) => healthScore(a) - healthScore(b));
  const worst = sorted.slice(0, 3);
  const best = sorted.slice(-3).reverse();

  return (
    <div>
      <section className="hero-surface">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="mb-4 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
            Made for Indian shoppers
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Know what's really inside your food.
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-85">
            See the junk percentage, a simple 0 to 100 score, and whether the product is approved by
            the food safety authority.
          </p>
          <form
            className="mt-8 flex max-w-xl gap-2 rounded-full bg-card p-1.5 shadow-lift"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/products", search: { q: q || undefined } });
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search a product or brand, e.g. noodles"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-4 text-base text-card-foreground outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Check
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/scan" className="underline underline-offset-4 opacity-90 hover:opacity-100">
              Scan a barcode
            </Link>
            <Link to="/approvals" className="underline underline-offset-4 opacity-90 hover:opacity-100">
              See approval list
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Healthiest picks</h2>
          <p className="mb-4 text-sm text-muted-foreground">Highest scores in our sample list.</p>
          <div className="space-y-3">
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Most junk</h2>
          <p className="mb-4 text-sm text-muted-foreground">Think twice before the next purchase.</p>
          <div className="space-y-3">
            {worst.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          What makes Nutrixon different
        </p>
        <h2 className="mt-2 text-2xl font-bold">Ingredient screening before launch</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Most food apps only tell you what is already on the shelf. Nutrixon checks a product before it
          reaches you: companies submit the ingredient list, the app runs structured checks against the
          configured regulatory concerns and missing information, then routes each case for review.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            [
              "1. Submit",
              "A company sends the ingredient list, label details and nutrition per 100 g.",
            ],
            [
              "2. Structured checks",
              "Every ingredient is matched against banned, restricted and watch concerns, and anything missing is listed.",
            ],
            [
              "3. Routed for review",
              "The case goes to priority review, standard review, or back to the company for information.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="card-surface p-5">
              <h3 className="text-base font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <Link
          to="/register"
          className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Screen a product
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-bold">Everything in Nutrixon</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["/products", "Products", "Search and filter foods by score, junk % and approval."],
              ["/scan", "Scan a barcode", "Look up a pack by its barcode number."],
              ["/approvals", "Approval list", "Approved, under review and not approved products."],
              ["/learn", "Learn", "How sugar, salt, fats and additives affect your health."],
              ["/register", "Register a product", "Submit ingredients for pre-launch screening and approval."],
              ["/tasks", "Task tracker", "Organise tasks by status, due date and progress."],
            ] as const
          ).map(([to, t, d]) => (
            <Link key={to} to={to} className="card-surface p-5 transition-shadow hover:shadow-lift">
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Junk %", "How much of a product's profile comes from sugar, salt, bad fats and additives."],
            ["Score out of 100", "Higher is better. 65+ is fine, 40 to 64 is occasional, below 40 is best avoided."],
            ["Approval status", "Whether the product is approved, under review or not approved."],
          ].map(([t, d]) => (
            <div key={t} className="card-surface p-5">
              <h3 className="text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
