import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "How food can harm your health | Nutrixon" },
      { name: "description", content: "Learn how sugar, salt, trans fat and common additives affect health, and how the Nutrixon score works." },
      { property: "og:title", content: "How food can harm your health | Nutrixon" },
      { property: "og:description", content: "Learn how sugar, salt, trans fat and common additives affect health, and how the Nutrixon score works." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnPage,
});

const topics = [
  { t: "Added sugar", found: "Cola, biscuits, spreads, packaged juices", why: "Raises the risk of weight gain, type 2 diabetes and tooth decay. More than 22.5 g per 100 g is high." },
  { t: "Excess salt (sodium)", found: "Instant noodles, chips, namkeen", why: "Pushes up blood pressure and strains the heart and kidneys. More than 600 mg sodium per 100 g is high." },
  { t: "Saturated and trans fat", found: "Fried snacks, bakery items, palm oil", why: "Raises bad cholesterol and heart disease risk. More than 5 g saturated fat per 100 g is high." },
  { t: "Artificial colours (E102, E110)", found: "Sweets, drinks, biscuits", why: "Some colours are linked to hyperactivity in children and allergic reactions in sensitive people." },
  { t: "Preservatives (E211)", found: "Fruit drinks, sauces", why: "Sodium benzoate can form irritants with vitamin C and may trigger reactions in some people." },
  { t: "Flavour enhancers (E621)", found: "Masala snacks, instant mixes", why: "MSG makes food hard to stop eating and can cause headaches in sensitive people. It also hides high salt." },
];

function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">How food can harm</h1>
      <p className="mt-2 text-muted-foreground">The usual suspects on Indian packaged food labels.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {topics.map((x) => (
          <article key={x.t} className="card-surface p-5">
            <h2 className="text-lg font-bold">{x.t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{x.why}</p>
            <p className="mt-3 text-xs font-semibold text-primary">Found in: {x.found}</p>
          </article>
        ))}
      </div>

      <section className="hero-surface mt-10 rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">How the score works</h2>
        <p className="mt-2 text-sm opacity-90">
          Junk percentage combines sugar, saturated fat, sodium, calories and the number of additives per 100 g, then
          subtracts credit for fibre and protein. The health score is 100 minus the junk percentage.
        </p>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <li className="rounded-xl bg-good px-4 py-3 font-semibold text-good-foreground">65 to 100: fine regularly</li>
          <li className="rounded-xl bg-warn px-4 py-3 font-semibold text-warn-foreground">40 to 64: occasionally</li>
          <li className="rounded-xl bg-bad px-4 py-3 font-semibold text-bad-foreground">0 to 39: best avoided</li>
        </ul>
      </section>
    </div>
  );
}
