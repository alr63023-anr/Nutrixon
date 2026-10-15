import { Link } from "@tanstack/react-router";
import {
  approvalMeta,
  healthScore,
  junkPercent,
  verdictMeta,
  verdictOf,
  type Product,
} from "@/lib/products";

export function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const meta = verdictMeta[verdictOf(score)];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" width={size} height={size}>
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="9" className="stroke-muted" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          className={meta.stroke}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold leading-none">{score}</span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  );
}

export function ApprovalBadge({ status }: { status: Product["approval"] }) {
  const m = approvalMeta[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.badge}`}>
      {m.label}
    </span>
  );
}

export function VerdictBadge({ product }: { product: Product }) {
  const m = verdictMeta[verdictOf(healthScore(product))];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.badge}`}>
      {m.short}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const score = healthScore(product);
  const junk = junkPercent(product);
  return (
    <Link
      to="/products/$id"
      params={{ id: product.id }}
      className="card-surface group flex items-center gap-4 p-4 transition-shadow hover:shadow-lift"
    >
      <ScoreRing score={score} size={76} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          {product.brand} · {product.category}
        </p>
        <h3 className="truncate text-base font-semibold group-hover:text-primary">{product.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VerdictBadge product={product} />
          <ApprovalBadge status={product.approval} />
          <span className="text-xs text-muted-foreground">{junk}% junk</span>
        </div>
      </div>
    </Link>
  );
}
