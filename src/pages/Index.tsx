import { Package, Flame, TrendingUp, Eye, Loader2, Crown, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCheckout } from "@/hooks/useCheckout";
import { safeImageSrc } from "@/lib/safeUrl";
import { usePlan } from "@/hooks/usePlan";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/productFormat";

const iconMap = {
  total_products: Package,
  hot: Flame,
  rising: TrendingUp,
  watch: Eye,
};

const colorMap: Record<string, string> = {
  total_products: "text-primary",
  hot: "text-primary",
  rising: "text-primary",
  watch: "text-primary",
};

const bgColorMap: Record<string, string> = {
  total_products: "bg-accent",
  hot: "bg-accent",
  rising: "bg-accent",
  watch: "bg-accent",
};

// /stats buckets are virality-score ranges, not life-cycle stages, so they're labelled by score.
// "Rising" etc. are reserved for the stage shown on each product (same as the Products page).
const labelMap: Record<string, string> = {
  total_products: "Total Products",
  hot: "Score 80+",
  rising: "Score 65–79",
  watch: "Score 50–64",
};

// Same stage names as the Products page (import_kalodata.py stages; hot/watch/stable from the old importer).
const STAGE_LABELS: Record<string, string> = {
  emerging: "Emerging", rising: "Rising", peaking: "Peaking", saturated: "Saturated",
  hot: "Hot", watch: "Watch", stable: "Stable", unknown: "New data",
};
const stageLabel = (phase?: string) => STAGE_LABELS[(phase ?? "unknown").toLowerCase()] ?? "New data";

// Muted pills, same palette as the Products page and landing.
const phaseStyles: Record<string, string> = {
  emerging: "border-transparent bg-[#E6F2EB] text-[#1C6B47]",
  rising: "border-transparent bg-[#E8F1F6] text-[#1F5675]",
  peaking: "border-transparent bg-[#FBF1DF] text-[#8A520C]",
  saturated: "border-transparent bg-[#F0EDE6] text-[#4F5D63]",
  hot: "border-transparent bg-[#FBECEA] text-[#9E3427]",
  watch: "border-transparent bg-[#FBF1DF] text-[#8A520C]",
  stable: "border-transparent bg-[#F0EDE6] text-[#4F5D63]",
};

// Bold score chip: darker the higher the score.
const scoreCls = (n: number) => (n >= 80 ? "app-score app-score-hi" : n >= 60 ? "app-score" : "app-score app-score-lo");

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
  const statKeys = ["total_products", "hot", "rising", "watch"];
  const productsLoading = authLoading || planLoading || productsQueryLoading;

  const rawProducts = Array.isArray(productsData) ? productsData : productsData?.products ?? [];
  // Show nothing plan-specific until the plan is known, so Pro users never see a Free flash.
  const isFree = !planLoading && plan === "free";
  const productLimit = isFree ? 10 : rawProducts.length;
  const products = rawProducts.slice(0, productLimit);

  return (
    <div className="space-y-6 md:space-y-8 animate-slide-up pb-20 md:pb-6">
      {isFree && (
        <div className="rounded-xl border border-[#D5E3E8] bg-accent/70 p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm font-medium">
              You're on the <span className="font-bold">Free Plan</span>, which shows the top 10 products. Upgrade to Pro for the full list and search.
            </p>
          </div>
          <Link to="/pricing">
            <Button variant="outline" className="border-primary/30 text-primary font-semibold shrink-0 w-full sm:w-auto min-h-[44px]">
              Upgrade to Pro →
            </Button>
          </Link>
        </div>
      )}

      <div>
        <h1 className="app-h1">Dashboard</h1>
        <p className="app-sub mt-1.5 !text-[14px]">Track your TikTok Shop product performance</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
          Failed to load stats. Please try again later.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {statKeys.map((key) => {
            const Icon = iconMap[key as keyof typeof iconMap] ?? Package;
            const value = stats?.[key];
            const change = stats?.[`${key}_change`];
            return (
              <div key={key} className="app-panel p-4 md:p-5 space-y-3 md:space-y-4 transition-colors hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="app-eyebrow">{labelMap[key]}</span>
                  <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${bgColorMap[key]}`}>
                    <Icon className={`h-3.5 w-3.5 ${colorMap[key]}`} strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="font-display text-[36px] md:text-[44px] leading-none tabular-nums">
                    {value != null ? Number(value).toLocaleString() : "—"}
                  </span>
                  {change != null && <span className="text-sm text-success mb-1">{change}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[24px] md:text-[28px] leading-tight">{isFree ? `Top ${productLimit} Trending Products` : "Trending Products"}</h2>
          <Link to="/products" className="text-sm text-primary hover:underline underline-offset-4 font-medium">View all →</Link>
        </div>
        {productsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : productsError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">Failed to load products.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block app-panel overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="app-th px-4">Product</th>
                    <th className="app-th px-4">Category</th>
                    <th className="app-th px-4">Virality</th>
                    <th className="app-th px-4">Trend</th>
                    <th className="app-th px-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any, i: number) => (
                    <tr key={product.id ?? i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium max-w-xs">
                        <div className="flex items-center gap-3">
                          {safeImageSrc(product.thumbnail_url) ? (
                            <img
                              src={safeImageSrc(product.thumbnail_url)}
                              alt={product.product_name}
                              className="w-10 h-10 app-thumb"
                              onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = "none";
                                const fallback = img.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className="w-10 h-10 rounded-lg bg-muted shrink-0 items-center justify-center text-base border border-border"
                            style={{ display: safeImageSrc(product.thumbnail_url) ? "none" : "flex" }}
                          >
                            <Package className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                          </div>
                          <span className="truncate">{product.product_name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[12.5px]">{product.category}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className={scoreCls(Number(product.virality_score ?? 0))}>{product.virality_score ?? 0}</span>
                          <div className="w-14 h-1 rounded-full bg-muted overflow-hidden" aria-hidden>
                            <div className="h-full rounded-full bg-primary/70" style={{ width: `${product.virality_score ?? 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={phaseStyles[(product.trend_phase ?? "").toLowerCase()] ?? phaseStyles.stable}>
                          {stageLabel(product.trend_phase)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium tabular-nums">{formatPrice(product)}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {products.map((product: any, i: number) => (
                <div key={product.id ?? i} className="app-panel p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {safeImageSrc(product.thumbnail_url) ? (
                        <img
                          src={safeImageSrc(product.thumbnail_url)}
                          alt={product.product_name}
                          className="w-10 h-10 app-thumb"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-10 h-10 rounded-lg bg-muted shrink-0 items-center justify-center text-base border border-border"
                        style={{ display: safeImageSrc(product.thumbnail_url) ? "none" : "flex" }}
                      >
                        <Package className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm md:text-base truncate">{product.product_name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${phaseStyles[(product.trend_phase ?? "").toLowerCase()] ?? phaseStyles.stable}`}>
                      {stageLabel(product.trend_phase)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={scoreCls(Number(product.virality_score ?? 0))}>{product.virality_score ?? 0}</span>
                      <span className="text-[12px] text-muted-foreground">virality</span>
                    </div>
                    <span className="text-sm md:text-base font-medium text-foreground tabular-nums">{formatPrice(product)}</span>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">No products found</div>
              )}
            </div>
          </>
        )}
      </div>

      {isFree && (
        <div className="relative overflow-hidden rounded-xl border border-border p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
          <img src="/images/rooftops-sky.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-40" style={{ objectPosition: "50% 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-card/40" aria-hidden />
          <div className="relative flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary shrink-0" strokeWidth={1.75} />
            <p className="text-sm font-medium">
              Unlock the full product list, search and 50 sourcing credits a month –{" "}
              <span className="text-primary font-semibold">Upgrade to Pro $39/mo</span>
            </p>
          </div>
          <Button onClick={() => checkout("pro")} disabled={checkoutLoading}
            className="relative font-semibold shrink-0 w-full sm:w-auto min-h-[44px]">
            {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade Now"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
