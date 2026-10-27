import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import Sparkline from "./Sparkline";
import StageBadge, { Stage, STAGE_COLORS } from "./StageBadge";

// Illustrative rows for the marketing page, labelled "Example data" in the UI.
const ROWS: { name: string; cat: string; stage: Stage; score: number; gmv: string; growth: string; trend: number[]; margin: string; creators: number }[] = [
  { name: "Magnetic phone tripod", cat: "Phones & Electronics", stage: "emerging", score: 91, gmv: "$48.2K", growth: "+212%", trend: [3, 4, 4, 6, 8, 11, 17], margin: "41%", creators: 38 },
  { name: "Heatless curling ribbon", cat: "Beauty & Personal Care", stage: "emerging", score: 87, gmv: "$31.9K", growth: "+168%", trend: [2, 2, 3, 5, 6, 9, 12], margin: "58%", creators: 24 },
  { name: "Silicone stove gap cover", cat: "Home & Kitchen", stage: "rising", score: 78, gmv: "$112K", growth: "+64%", trend: [6, 8, 9, 11, 13, 14, 16], margin: "47%", creators: 141 },
  { name: "Posture corrector vest", cat: "Health", stage: "peaking", score: 62, gmv: "$286K", growth: "+9%", trend: [8, 12, 15, 17, 18, 18, 17], margin: "33%", creators: 612 },
  { name: "LED galaxy projector", cat: "Home Decor", stage: "saturated", score: 34, gmv: "$198K", growth: "−22%", trend: [18, 17, 15, 13, 12, 10, 9], margin: "19%", creators: 1904 },
];

export default function HeroProductMock() {
  return (
    <div className="mk-card overflow-hidden text-left shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-24px_rgba(16,24,40,0.12)]">
      <div className="flex flex-wrap items-center gap-2 border-b mk-divider px-4 py-3">
        <div className="flex h-9 flex-1 min-w-[200px] items-center gap-2 rounded-lg border mk-divider px-3 text-[13px] mk-muted bg-[#FAFAFA]">
          <Search className="h-4 w-4" /> Search 700+ products
        </div>
        {["Emerging", "Last 7 days", "Margin > 35%"].map((f, i) => (
          <span key={f} className={`h-9 inline-flex items-center rounded-lg border px-3 text-[13px] ${i === 0 ? "border-[#0B0B0C] bg-[#0B0B0C] text-white" : "mk-divider text-[#2A2C30]"}`}>{f}</span>
        ))}
        <span className="h-9 inline-flex items-center gap-1.5 rounded-lg border mk-divider px-3 text-[13px] text-[#2A2C30]">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </span>
        <span className="ml-auto text-[12px] mk-muted">Example data</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-[14px]">
          <thead className="bg-[#FAFAFA]">
            <tr className="text-[12px] mk-muted">
              <th className="px-4 py-2.5 text-left font-medium">Product</th>
              <th className="px-4 py-2.5 text-left font-medium">Stage</th>
              <th className="px-4 py-2.5 text-right font-medium">Momentum</th>
              <th className="px-4 py-2.5 text-right font-medium">GMV, 7 days</th>
              <th className="px-4 py-2.5 text-left font-medium">Trend</th>
              <th className="px-4 py-2.5 text-right font-medium">Creators</th>
              <th className="px-4 py-2.5 text-right font-medium">Est. margin</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className="border-t mk-divider hover:bg-[#FAFAFA]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0B0B0C]">{r.name}</div>
                  <div className="text-[12px] mk-muted">{r.cat}</div>
                </td>
                <td className="px-4 py-3"><StageBadge stage={r.stage} /></td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-14 overflow-hidden rounded-full bg-[#F2F4F7]"><span className="block h-full rounded-full bg-[#0B0B0C]" style={{ width: `${r.score}%` }} /></span>
                    <span className="mk-num font-medium w-6 text-right">{r.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right mk-num">
                  <div className="font-medium">{r.gmv}</div>
                  <div className="text-[12px]" style={{ color: r.growth.startsWith("−") ? "#D92D20" : "#067647" }}>{r.growth}</div>
                </td>
                <td className="px-4 py-3"><Sparkline points={r.trend} color={STAGE_COLORS[r.stage]} /></td>
                <td className="px-4 py-3 text-right mk-num">{r.creators.toLocaleString()}</td>
                <td className="px-4 py-3 text-right mk-num font-medium">{r.margin}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0B0B0C]">Source <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
