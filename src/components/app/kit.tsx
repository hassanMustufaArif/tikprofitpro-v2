import { useState } from "react";
import { Package } from "lucide-react";
import Sparkline from "@/components/landing/Sparkline";
import { safeImageSrc } from "@/lib/safeUrl";

/* Display-only building blocks for the logged-in app, in the landing page's vocabulary:
   black score bars, coloured growth chips, soft-shadow cards, rounded photos, skeletons. */

export const softShadow = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.14)]";
export const hoverLift = "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(16,24,40,0.05),0_20px_40px_-20px_rgba(16,24,40,0.22)]";

/** Score bar + number, as in the landing's example table. */
export const ScoreBar = ({ v, width = "w-14" }: { v: unknown; width?: string }) => {
  const n = Math.max(0, Math.min(100, Math.round(Number(v) || 0)));
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-1.5 ${width} overflow-hidden rounded-full bg-[#EAECF0]`}>
        <span className="block h-full rounded-full bg-[#0B0B0C]" style={{ width: `${n}%` }} />
      </span>
      <span className="w-6 text-right text-[13px] font-medium tabular-nums text-foreground">{n}</span>
    </span>
  );
};

const pctText = (v: number) => `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v) >= 100 ? Math.round(Math.abs(v)) : Math.abs(v).toFixed(1)}%`;

/** Growth chip (green up / red down). Renders nothing without a real, non-zero value. */
export const GrowthChip = ({ v, className = "" }: { v: unknown; className?: string }) => {
  const n = Number(v);
  if (v == null || !Number.isFinite(n) || n === 0) return null;
  const up = n > 0;
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-px text-[11px] font-medium tabular-nums ${className}`}
      style={{ color: up ? "#067647" : "#B42318", background: up ? "#ECFDF3" : "#FEF3F2" }}>
      {pctText(n)}
    </span>
  );
};

/** A product's own trend series, only when the API row carries one (never synthesised). */
export function trendPoints(p: any): number[] | null {
  for (const k of ["trend", "trend_points", "sparkline", "gmv_trend", "gmv_history", "daily_gmv"]) {
    const a = p?.[k];
    if (Array.isArray(a)) {
      const pts = a.map((x: any) => Number(typeof x === "object" && x ? x.value ?? x.gmv ?? x.y : x)).filter(Number.isFinite);
      if (pts.length >= 3) return pts;
    }
  }
  return null;
}

export const RowSparkline = ({ p, color }: { p: any; color: string }) => {
  const pts = trendPoints(p);
  return pts ? <Sparkline points={pts} color={color} /> : <span className="text-muted-foreground">—</span>;
};

/** Product photo with a quiet fallback tile. `fill` makes it cover its (aspect-ratio) parent. */
export const ProductPhoto = ({ src: raw, alt, size = 40, rounded = "rounded-lg", fill = false }: {
  src?: string; alt: string; size?: number; rounded?: string; fill?: boolean;
}) => {
  const [broken, setBroken] = useState(false);
  const src = safeImageSrc(raw);
  const box = fill ? "absolute inset-0 h-full w-full" : "shrink-0";
  const style = fill ? undefined : { width: size, height: size };
  return src && !broken ? (
    <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)}
      className={`${box} ${rounded} object-cover bg-[#F5F5F6] ${fill ? "" : "border border-border"}`} style={style} />
  ) : (
    <div className={`${box} ${rounded} flex items-center justify-center bg-[#F5F5F6] text-[#9A9EA5] ${fill ? "" : "border border-border"}`} style={style}>
      <Package className={fill ? "h-8 w-8" : "h-4 w-4"} strokeWidth={1.5} />
    </div>
  );
};

export const Skel = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-[#F2F2F4] ${className}`} aria-hidden />
);

/** Table-shaped skeleton for list loading states. */
export const SkeletonRows = ({ rows = 8 }: { rows?: number }) => (
  <div className="divide-y divide-border" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3.5">
        <Skel className="h-4 w-5" />
        <Skel className="h-11 w-11 rounded-lg" />
        <div className="flex-1 space-y-2"><Skel className="h-3.5 w-2/5" /><Skel className="h-3 w-1/5" /></div>
        <Skel className="hidden md:block h-5 w-20 rounded-full" />
        <Skel className="hidden md:block h-3.5 w-24" />
        <Skel className="hidden lg:block h-3.5 w-16" />
        <Skel className="h-7 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const SkeletonCards = ({ n = 8, cols = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" }: { n?: number; cols?: string }) => (
  <div className={`grid gap-4 ${cols}`} aria-busy="true" aria-label="Loading">
    {Array.from({ length: n }, (_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
        <Skel className="aspect-[4/3] w-full rounded-none" />
        <div className="space-y-2 p-4"><Skel className="h-3.5 w-3/4" /><Skel className="h-3 w-1/3" /><Skel className="h-5 w-1/2 rounded-full" /></div>
      </div>
    ))}
  </div>
);
