import { Loader2, AlertCircle, ArrowRight, ArrowUpRight, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCheckout } from "@/hooks/useCheckout";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import {
  formatPrice, normalizeStage, commonWindowDays, revenueFor, windowText, latestDataDate, isEstimated7d,
} from "@/lib/productFormat";
import StagePill, { STAGE_LOOK } from "@/components/app/StagePill";
import { ScoreBar, GrowthChip, ProductPhoto, Skel, SkeletonCards, softShadow, hoverLift } from "@/components/app/kit";

// /stats buckets are virality-score ranges, not life-cycle stages, so they're labelled by score.
// "Rising" etc. are reserved for the stage shown on each product (same as the Products page).
const KPIS: { key: string; label: string; range?: [number, number]; color: string; tint: string }[] = [
  { key: "total_products", label: "Total products", color: "#0B0B0C", tint: "#E4E4E7" },
  { key: "hot", label: "Score 80+", range: [80, 101], color: "#12B76A", tint: "#D1FADF" },
  { key: "rising", label: "Score 65–79", range: [65, 80], color: "#2E90FA", tint: "#D1E9FF" },
  { key: "watch", label: "Score 50–64", range: [50, 65], color: "#F79009", tint: "#FEF0C7" },
];

// Stage-mix order. The DB stores v1 names (hot/rising/watch/pass); normalizeStage maps them back
// (hot→emerging, pass→saturated) so "pass" no longer shows as "New data".
const MIX = ["emerging", "rising", "peaking", "watch", "saturated", "stable", "unknown"] as const;

const STAGE_NOTE: Record<string, string> = {
  emerging: "Early and growing fast.", rising: "Proven demand, still climbing.", peaking: "Crowded and slowing.",
  watch: "Slowing, or too new to call.", saturated: "Declining. Usually skip.", stable: "Flat demand.", unknown: "Not enough history yet.",
};

const fmtUsd = (n: number | null | undefined) => {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
};

/** Ten score bins (0–9, 10–19 … 90–100) from the loaded rows: a real distribution, not a time series. */
const scoreBins = (rows: any[]) => {
  const bins = Array(10).fill(0);
  for (const r of rows) {
    const s = Number(r?.virality_score);
    if (Number.isFinite(s)) bins[Math.min(9, Math.max(0, Math.floor(s / 10)))] += 1;
  }
  return bins;
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-border bg-card ${softShadow} ${className}`}>{children}</div>
);

const SectionHead = ({ title, sub, action }: { title: string; sub?: React.ReactNode; action?: React.ReactNode }) => (
  <div className="mb-3 flex items-end justify-between gap-3">
    <div>
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">{title}</h2>
      {sub && <p className="mt-0.5 text-[12px] text-muted-foreground">{sub}</p>}
    </div>
    {action}
  </div>
);

const Dashboard = () => {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.getStats(),
  });

  // Wait for the session so the first request isn't sent signed-out (which returns the free top 10).
  const { user, loading: authLoading } = useAuth();
  const { data: productsData, isLoading: productsQueryLoading, error: productsError } = useQuery({
    queryKey: ["dashboard-products", user?.id ?? "anon"],
    queryFn: () => api.getProducts(),
    enabled: !authLoading,
  });

  const stats = statsData?.stats ?? {};
  const { checkout, loading: checkoutLoading } = useCheckout();

  const { plan, isLoading: planLoading } = usePlan();
  const productsLoading = authLoading || planLoading || productsQueryLoading;

  const rawProducts = Array.isArray(productsData) ? productsData : productsData?.products ?? [];
  // Show nothing plan-specific until the plan is known, so Pro users never see a Free flash.
  const isFree = !planLoading && plan === "free";
  const productLimit = isFree ? 10 : rawProducts.length;
  const products: any[] = rawProducts.slice(0, productLimit);

  // Same honest window as the Products page: real 1-day figures when every row is a 1-day export.
  const win = commonWindowDays(products);
  const rev = (p: any): number | null => (win ? revenueFor(p, win) : Number(p.gmv_7d) || null);
  const winShort = win ? `${win}d` : "7d";
  const winLong = win ? windowText(win) : `7 days${products.some(isEstimated7d) ? " (est.)" : ""}`;
  const asOf = latestDataDate(products);

  const bins = scoreBins(products);
  const binMax = Math.max(1, ...bins);

  const mix = MIX.map((k) => ({ k, n: products.filter((p) => normalizeStage(p.trend_phase) === k).length })).filter((m) => m.n > 0);
  const mixTotal = mix.reduce((s, m) => s + m.n, 0);
  const totalRev = products.reduce((s, p) => s + (rev(p) || 0), 0);

  const hasGrowth = products.some((p) => Number(p.gmv_growth_pct));
  const movers = [...products]
    .sort((a, b) => (hasGrowth ? (Number(b.gmv_growth_pct) || -Infinity) - (Number(a.gmv_growth_pct) || -Infinity) : (rev(b) || 0) - (rev(a) || 0)))
    .slice(0, 8);
  const topRev = [...products].sort((a, b) => (rev(b) || 0) - (rev(a) || 0)).slice(0, 3);
  const best = [...products].sort((a, b) => (Number(b.virality_score) || 0) - (Number(a.virality_score) || 0)).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 animate-slide-up pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em] text-foreground">Overview</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Your TikTok Shop research at a glance{asOf ? ` · Sales data to ${asOf}` : ""}
          </p>
        </div>
        <Link to="/products" className="inline-flex h-9 items-center gap-1.5 self-start rounded-full bg-foreground px-4 text-[13px] font-medium text-background hover:opacity-90 sm:self-auto">
          Browse all products <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isFree && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-[#FEDF89] bg-[#FFFCF5] px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3 sm:items-center">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B54708] sm:mt-0" />
            <p className="text-[13px] text-[#2A2C30]">
              You're on the <span className="font-semibold">Free plan</span>, which shows the top 10 products. Upgrade to Pro for the full list and search.
            </p>
          </div>
          <Link to="/pricing" className="inline-flex h-8 shrink-0 items-center rounded-full border border-[#E4E4E7] bg-white px-3.5 text-[13px] font-medium text-foreground hover:bg-[#FAFAFA]">
            Upgrade to Pro →
          </Link>
        </div>
      )}

      {/* KPI hero row */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {KPIS.map((k) => (
            <Card key={k.key} className="p-5"><Skel className="h-3.5 w-24" /><Skel className="mt-4 h-8 w-20" /><Skel className="mt-4 h-10 w-full" /></Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
          Failed to load stats. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {KPIS.map((k) => {
            const value = stats?.[k.key];
            const change = stats?.[`${k.key}_change`];
            return (
              <Card key={k.key} className="p-4 md:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-[#0B0B0C]">{k.label}</span>
                  {change != null && change !== "" && (
                    <span className="rounded-full bg-[#ECFDF3] px-1.5 py-px text-[11px] font-medium tabular-nums text-[#067647]">{change}</span>
                  )}
                </div>
                <div className="mt-2 text-[30px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-foreground md:text-[34px]">
                  {value != null ? Number(value).toLocaleString() : "—"}
                </div>
                {products.length > 0 && (
                  <>
                    <div className="mt-4 flex h-10 items-end gap-1" aria-hidden>
                      {bins.map((n, i) => {
                        const lo = i * 10;
                        const on = !k.range || (lo >= k.range[0] && lo < k.range[1]);
                        return (
                          <div key={i} className="flex-1 rounded-[3px]"
                            style={{ height: `${Math.max(6, (n / binMax) * 100)}%`, background: on ? (k.range ? k.color : "#0B0B0C") : (k.range ? k.tint : "#E4E4E7"), opacity: !k.range && !n ? 0.5 : 1 }} />
                        );
                      })}
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-muted-foreground">
                      <span>Score 0</span><span>100</span>
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {productsLoading ? (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2"><Skel className="h-4 w-32" /><Skel className="mt-5 h-3 w-full rounded-full" /><Skel className="mt-5 h-4 w-3/4" /></Card>
            <Card className="p-5"><Skel className="h-4 w-32" /><Skel className="mt-5 h-8 w-28" /></Card>
          </div>
          <SkeletonCards n={4} cols="grid-cols-2 lg:grid-cols-4" />
        </>
      ) : productsError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">Failed to load products.</div>
      ) : products.length === 0 ? (
        <Card className="py-14 text-center text-[13px] text-muted-foreground">No products found</Card>
      ) : (
        <>
          {/* Stage mix + revenue */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="flex flex-col p-5 lg:col-span-2">
              <SectionHead title="Stage mix" sub={`Where ${isFree ? `the top ${products.length}` : `these ${products.length.toLocaleString()}`} products are in their life cycle`} />
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#F2F4F7]">
                {mix.map((m) => (
                  <div key={m.k} title={`${STAGE_LOOK[m.k].label}: ${m.n}`} className="h-full border-r-2 border-white last:border-r-0"
                    style={{ width: `${(m.n / mixTotal) * 100}%`, background: STAGE_LOOK[m.k].dot }} />
                ))}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border pt-0 sm:grid-cols-4" style={{ marginTop: 20 }}>
                {mix.map((m) => (
                  <div key={m.k} className="bg-white p-4">
                    <StagePill phase={m.k} />
                    <div className="mt-2 flex items-baseline gap-1.5">
                      <span className="text-[22px] font-semibold tracking-[-0.03em] tabular-nums text-foreground">{m.n}</span>
                      <span className="text-[12px] tabular-nums text-muted-foreground">{Math.round((m.n / mixTotal) * 100)}%</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{STAGE_NOTE[m.k]}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex flex-col justify-between p-5">
              <SectionHead title={`Revenue, ${winLong}`} sub={isFree ? `Across the top ${products.length} products` : `Across ${products.length.toLocaleString()} products shown`} />
              <div>
                <div className="text-[34px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-foreground">{fmtUsd(totalRev)}</div>
                <div className="mt-4 space-y-2">
                  {topRev.map((p, i) => {
                    const r = rev(p) || 0;
                    return (
                      <div key={p.id ?? i} className="flex items-center gap-2 text-[12px]">
                        <span className="w-28 truncate text-[#55595F] sm:w-36">{p.product_name}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F2F4F7]">
                          <span className="block h-full rounded-full bg-[#0B0B0C]" style={{ width: `${totalRev ? Math.max(2, (r / totalRev) * 100) : 0}%` }} />
                        </span>
                        <span className="w-14 text-right tabular-nums text-foreground">{fmtUsd(r)}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">Top 3 products, share of the total.</p>
              </div>
            </Card>
          </div>

          {/* Top movers */}
          <section>
            <SectionHead
              title="Top movers"
              sub={hasGrowth ? "Biggest revenue growth" : `Highest revenue, ${winLong}`}
              action={<Link to="/products" className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground hover:underline">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
            />
            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
              {movers.slice(0, isFree ? 4 : 8).map((p, i) => (
                <Link to="/products" key={p.id ?? i}
                  className={`group block w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card lg:w-auto ${softShadow} ${hoverLift}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F6]">
                    <ProductPhoto src={p.image_storage_url || p.thumbnail_url} alt={p.product_name} fill rounded="rounded-none" />
                    <div className="absolute left-3 top-3"><span className="rounded-full bg-white/95 p-0.5 shadow-sm backdrop-blur inline-flex"><StagePill phase={p.trend_phase} /></span></div>
                    {Number(p.gmv_growth_pct) ? (
                      <div className="absolute right-3 top-3 rounded-full bg-white/95 px-0.5 py-0.5 shadow-sm"><GrowthChip v={p.gmv_growth_pct} /></div>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <div className="line-clamp-1 text-[14px] font-medium text-foreground">{p.product_name}</div>
                    <div className="mt-0.5 line-clamp-1 text-[12px] text-muted-foreground">{(p.category ?? "").split(">").pop()?.trim() || "Uncategorised"}</div>
                    <div className="mt-3 flex items-center justify-between">
                      <ScoreBar v={p.virality_score} width="w-12" />
                      <div className="text-right">
                        <div className="text-[14px] font-semibold tabular-nums text-foreground">{fmtUsd(rev(p))}</div>
                        <div className="text-[10px] text-muted-foreground">Revenue {winShort}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Best scoring */}
          <section>
            <SectionHead
              title={isFree ? `Top ${productLimit} by score` : "Best scoring"}
              sub="Highest virality scores right now"
              action={<Link to="/products" className="inline-flex items-center gap-1 text-[13px] font-medium text-foreground hover:underline">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link>}
            />
            <Card className="overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-[13px]">
                  <thead className="bg-[#FAFAFA]">
                    <tr className="text-[12px] text-muted-foreground">
                      <th className="w-10 px-4 py-2.5 text-center font-medium">#</th>
                      <th className="px-4 py-2.5 text-left font-medium">Product</th>
                      <th className="px-4 py-2.5 text-left font-medium">Stage</th>
                      <th className="px-4 py-2.5 text-right font-medium">Score</th>
                      <th className="px-4 py-2.5 text-right font-medium">Revenue {winShort}</th>
                      <th className="px-4 py-2.5 text-right font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {best.map((p, i) => (
                      <tr key={p.id ?? i} className="border-t border-border transition-colors hover:bg-[#FAFAFA]">
                        <td className="px-4 py-3 text-center tabular-nums text-muted-foreground">{i + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <ProductPhoto src={p.image_storage_url || p.thumbnail_url} alt={p.product_name} size={40} />
                            <div className="min-w-0">
                              <div className="line-clamp-1 font-medium text-foreground">{p.product_name}</div>
                              <div className="line-clamp-1 text-[12px] text-muted-foreground">{(p.category ?? "").split(">").pop()?.trim() || "Uncategorised"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3"><StagePill phase={p.trend_phase} /></td>
                        <td className="px-4 py-3 text-right"><ScoreBar v={p.virality_score} /></td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <div className="font-medium text-foreground">{fmtUsd(rev(p))}</div>
                          <GrowthChip v={p.gmv_growth_pct} className="mt-0.5" />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">{formatPrice(p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="divide-y divide-border md:hidden">
                {best.map((p, i) => (
                  <div key={p.id ?? i} className="flex items-center gap-3 p-4">
                    <ProductPhoto src={p.image_storage_url || p.thumbnail_url} alt={p.product_name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 text-[13px] font-medium text-foreground">{p.product_name}</div>
                      <div className="mt-1.5 flex items-center gap-2"><StagePill phase={p.trend_phase} /><ScoreBar v={p.virality_score} width="w-10" /></div>
                    </div>
                    <div className="text-right text-[13px] font-medium tabular-nums">{fmtUsd(rev(p))}</div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </>
      )}

      {isFree && (
        <div className={`flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#0B0B0C] p-5 text-white sm:flex-row md:p-6 ${softShadow}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10"><Lock className="h-4 w-4" /></span>
            <p className="text-[14px]">
              Unlock the full product list, search and 50 sourcing credits a month. <span className="font-semibold">Pro is $39/mo.</span>
            </p>
          </div>
          <button onClick={() => checkout("pro")} disabled={checkoutLoading}
            className="inline-flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-white px-5 text-[14px] font-medium text-[#0B0B0C] hover:bg-white/90 disabled:opacity-50 sm:w-auto">
            {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
