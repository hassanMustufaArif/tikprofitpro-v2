import { Search, SlidersHorizontal, Factory } from "lucide-react";
import Sparkline from "./Sparkline";
import StageBadge, { Stage } from "./StageBadge";

// Illustrative sample rows for the marketing mock. Labelled as example data in the UI.
const ROWS: { name: string; cat: string; stage: Stage; score: number; gmv: string; growth: string; trend: number[]; margin: string }[] = [
  { name: "Magnetic phone tripod", cat: "Phones & Electronics", stage: "emerging", score: 91, gmv: "$48.2K", growth: "+212%", trend: [3, 4, 4, 6, 8, 11, 17], margin: "41%" },
  { name: "Heatless curling ribbon", cat: "Beauty & Personal Care", stage: "emerging", score: 87, gmv: "$31.9K", growth: "+168%", trend: [2, 2, 3, 5, 6, 9, 12], margin: "58%" },
  { name: "Silicone stove gap cover", cat: "Home & Kitchen", stage: "rising", score: 78, gmv: "$112K", growth: "+64%", trend: [6, 8, 9, 11, 13, 14, 16], margin: "47%" },
  { name: "Posture corrector vest", cat: "Health", stage: "peaking", score: 62, gmv: "$286K", growth: "+9%", trend: [8, 12, 15, 17, 18, 18, 17], margin: "33%" },
  { name: "LED galaxy projector", cat: "Home Decor", stage: "saturated", score: 34, gmv: "$198K", growth: "−22%", trend: [18, 17, 15, 13, 12, 10, 9], margin: "19%" },
];

const trendColor: Record<Stage, string> = { emerging: "#00E676", rising: "#3B9EFF", peaking: "#FFB224", saturated: "#8A9099" };

export default function HeroProductMock() {
  return (
    <div className="mk-card overflow-hidden text-left shadow-[0_40px_120px_-40px_rgba(0,230,118,0.18)]">
      {/* Window bar */}
      <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "rgba(255,255,255,0.07)", background: "#0D0F12" }}>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        </div>
        <span className="mk-mono text-[11px] mk-muted">tikprofitpro.shop/products</span>
        <span className="rounded-md px-2 py-0.5 text-[10px] font-medium mk-muted" style={{ background: "rgba(255,255,255,0.04)" }}>Example data</span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex h-8 flex-1 min-w-[180px] items-center gap-2 rounded-md border px-2.5 text-[13px] mk-muted" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#0D0F12" }}>
          <Search className="h-3.5 w-3.5" /> Search products, categories…
        </div>
        {["Emerging", "Last 7 days", "Margin > 35%"].map((f, i) => (
          <span key={f} className="h-8 inline-flex items-center rounded-md border px-2.5 text-[12px]"
            style={{ borderColor: i === 0 ? "rgba(0,230,118,0.35)" : "rgba(255,255,255,0.08)", color: i === 0 ? "#5BF0A6" : "#9BA1AB", background: i === 0 ? "rgba(0,230,118,0.06)" : "transparent" }}>
            {f}
          </span>
        ))}
        <span className="h-8 inline-flex items-center gap-1.5 rounded-md border px-2.5 text-[12px] mk-muted" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-[13px]">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider mk-muted">
              <th className="px-4 py-2.5 text-left font-medium">Product</th>
              <th className="px-4 py-2.5 text-left font-medium">Stage</th>
              <th className="px-4 py-2.5 text-right font-medium">Momentum</th>
              <th className="px-4 py-2.5 text-right font-medium">GMV 7d</th>
              <th className="px-4 py-2.5 text-left font-medium">7-day trend</th>
              <th className="px-4 py-2.5 text-right font-medium">Est. margin</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className="border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#EDEEF0]">{r.name}</div>
                  <div className="text-[11px] mk-muted">{r.cat}</div>
                </td>
                <td className="px-4 py-3"><StageBadge stage={r.stage} /></td>
                <td className="px-4 py-3 text-right mk-mono text-[#EDEEF0]">{r.score}</td>
                <td className="px-4 py-3 text-right mk-mono">
                  <div className="text-[#EDEEF0]">{r.gmv}</div>
                  <div className="text-[11px]" style={{ color: r.growth.startsWith("−") ? "#FF6369" : "#5BF0A6" }}>{r.growth}</div>
                </td>
                <td className="px-4 py-3"><Sparkline points={r.trend} color={trendColor[r.stage]} /></td>
                <td className="px-4 py-3 text-right mk-mono text-[#EDEEF0]">{r.margin}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] text-[#EDEEF0]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <Factory className="h-3 w-3" /> Source
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
