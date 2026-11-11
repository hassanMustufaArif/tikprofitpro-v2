import { Search, SlidersHorizontal, LayoutDashboard, Package, Users, Store, Calculator } from "lucide-react";
import Sparkline from "./Sparkline";
import StageBadge, { Stage, STAGE_COLORS } from "./StageBadge";

// Illustrative rows for the marketing page, labelled "Example data" in the UI.
const ROWS: { name: string; cat: string; img: string; stage: Stage; score: number; gmv: string; growth: string; trend: number[]; creators: number }[] = [
  { name: "Magnetic phone tripod", cat: "Phones & Electronics", img: "tripod", stage: "emerging", score: 91, gmv: "$48.2K", growth: "+212%", trend: [3, 4, 4, 6, 8, 11, 17], creators: 38 },
  { name: "Heatless curling ribbon", cat: "Beauty & Personal Care", img: "ribbon", stage: "emerging", score: 87, gmv: "$31.9K", growth: "+168%", trend: [2, 2, 3, 5, 6, 9, 12], creators: 24 },
  { name: "Silicone stove gap cover", cat: "Home & Kitchen", img: "stove", stage: "rising", score: 78, gmv: "$112K", growth: "+64%", trend: [6, 8, 9, 11, 13, 14, 16], creators: 141 },
  { name: "Posture corrector vest", cat: "Health", img: "posture", stage: "peaking", score: 62, gmv: "$286K", growth: "+9%", trend: [8, 12, 15, 17, 18, 18, 17], creators: 612 },
  { name: "LED galaxy projector", cat: "Home Decor", img: "projector", stage: "saturated", score: 34, gmv: "$198K", growth: "−22%", trend: [18, 17, 15, 13, 12, 10, 9], creators: 1904 },
];

export const GrowthPill = ({ v }: { v: string }) => {
  const down = v.startsWith("−") || v.startsWith("-");
  return (
    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-medium mk-num ${down ? "bg-[#FBECEA] text-[#9E3427]" : "bg-[#E6F2EB] text-[#1C6B47]"}`}>{v}</span>
  );
};

export const ScoreChip = ({ n }: { n: number }) => (
  <span className={`inline-flex h-7 min-w-[2.25rem] items-center justify-center rounded-md px-1.5 text-[13px] font-semibold mk-num ${
    n >= 80 ? "bg-[#214F5E] text-[#FAF8F4]" : n >= 60 ? "bg-[#E7EFF2] text-[#173F4C]" : "bg-[#F0EDE6] text-[#546166]"}`}>{n}</span>
);

export const Thumb = ({ img, alt }: { img: string; alt: string }) => (
  <img src={`/images/thumbs/${img}.webp`} alt={alt} width={36} height={36} loading="lazy"
    className="h-9 w-9 shrink-0 rounded-lg border border-[#E6E1D7] object-cover" />
);

const NAV = [
  { l: "Overview", i: LayoutDashboard },
  { l: "Products", i: Package, on: true },
  { l: "Creators", i: Users },
  { l: "Shops", i: Store },
  { l: "Calculator", i: Calculator },
];

/** App-window mockup built in JSX: sidebar, KPI strip and the Products table. */
export default function HeroProductMock({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E1DCD1] bg-white text-left shadow-[0_0_0_1px_rgba(26,42,49,0.04),0_4px_10px_rgba(26,42,49,0.04),0_32px_80px_-24px_rgba(26,42,49,0.28)]">
      {/* window bar */}
      <div className="flex items-center gap-3 border-b border-[#ECE8E0] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#E6E1D7]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E6E1D7]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E6E1D7]" />
        </div>
        <div className="flex items-center gap-2 text-[12px] mk-muted">
          <img src="/tikprofitpro_icon.svg" alt="" className="h-4 w-4" />
          <span className="font-medium text-[#1A2A31]">TikProfitPro</span><span aria-hidden>/</span><span>Products</span>
        </div>
        <span className="ml-auto whitespace-nowrap rounded-full bg-[#F3F0E9] px-2 py-0.5 text-[11px] mk-muted">Example data</span>
      </div>

      <div className="flex">
        {!compact && (
          <aside className="hidden w-[176px] shrink-0 border-r border-[#ECE8E0] bg-[#FAF8F4] p-3 lg:block">
            <div className="mb-3 rounded-xl border border-[#E6E1D7] bg-white p-3">
              <div className="text-[11px] mk-muted">Sourcing credits</div>
              <div className="mt-0.5 text-[18px] font-semibold mk-num text-[#1A2A31]">42 <span className="text-[12px] font-normal mk-muted">/ 50</span></div>
              <div className="mt-2 h-1 rounded-full bg-[#F0EDE6]"><div className="h-full w-[84%] rounded-full bg-[#214F5E]" /></div>
            </div>
            <div className="px-1 pb-1.5 pt-2 text-[10px] font-medium uppercase tracking-[0.12em] mk-muted">Research</div>
            {NAV.map((n) => (
              <div key={n.l} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px] ${n.on ? "bg-white font-medium text-[#1A2A31] shadow-[0_0_0_1px_#E6E1D7]" : "text-[#4A5A61]"}`}>
                <n.i className="h-3.5 w-3.5" strokeWidth={1.75} /> {n.l}
              </div>
            ))}
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {/* KPI strip */}
          <div className="grid grid-cols-2 border-b border-[#ECE8E0] sm:grid-cols-4">
            {[
              ["Emerging", "2", "early and growing"],
              ["Rising", "1", "still climbing"],
              ["Revenue, 7d", "$676K", "these 5 products"],
              ["Credits", "42", "left this month"],
            ].map(([k, v, s], i) => (
              <div key={k} className={`px-4 py-3 ${i % 2 ? "border-l" : ""} ${i > 1 ? "hidden sm:block sm:border-l" : ""} border-[#ECE8E0]`}>
                <div className="text-[10px] font-medium uppercase tracking-[0.12em] mk-muted">{k}</div>
                <div className="mt-1 text-[22px] leading-none mk-num text-[#1A2A31]">{v}</div>
                <div className="mt-1 text-[11px] mk-faint">{s}</div>
              </div>
            ))}
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#ECE8E0] px-4 py-2.5">
            <div className="flex h-8 min-w-[160px] flex-1 items-center gap-2 rounded-lg border border-[#E6E1D7] bg-[#FAF8F4] px-2.5 text-[12px] mk-muted">
              <Search className="h-3.5 w-3.5" /> Search trending products
            </div>
            {["Emerging", "Last 7 days"].map((f, i) => (
              <span key={f} className={`hidden h-8 items-center rounded-lg border px-2.5 text-[12px] sm:inline-flex ${i === 0 ? "border-[#214F5E] bg-[#214F5E] text-[#FAF8F4]" : "border-[#E6E1D7] text-[#2B3A40]"}`}>{f}</span>
            ))}
            <span className="hidden h-8 items-center gap-1.5 rounded-lg border border-[#E6E1D7] px-2.5 text-[12px] text-[#2B3A40] md:inline-flex">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] sm:min-w-[560px]">
              <thead>
                <tr className="text-[10.5px] uppercase tracking-[0.1em] mk-muted">
                  <th className="px-4 py-2.5 text-left font-medium">Product</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">Revenue, 7d</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Trend</th>
                  <th className="hidden px-3 py-2.5 text-right font-medium xl:table-cell">Creators</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">Stage</th>
                  <th className="px-4 py-2.5 text-right font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr key={r.name} className={`border-t border-[#F0ECE4] ${i === 0 ? "bg-[#F5F8F9]" : ""}`}>
                    <td className="px-3 py-2.5 sm:px-4">
                      <div className="flex items-center gap-3">
                        <Thumb img={r.img} alt={r.name} />
                        <div className="min-w-0">
                          <div className="font-medium leading-snug text-[#1A2A31] sm:truncate">{r.name}</div>
                          <div className="truncate text-[11.5px] mk-faint">{r.cat}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-right mk-num">
                      <div className="font-medium text-[#1A2A31]">{r.gmv}</div>
                      <div className="mt-0.5"><GrowthPill v={r.growth} /></div>
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell"><Sparkline points={r.trend} color={STAGE_COLORS[r.stage]} width={80} height={24} /></td>
                    <td className="hidden px-3 py-2.5 text-right mk-num text-[#2B3A40] xl:table-cell">{r.creators.toLocaleString()}</td>
                    <td className="hidden px-3 py-2.5 sm:table-cell"><StageBadge stage={r.stage} /></td>
                    <td className="px-4 py-2.5 text-right"><ScoreChip n={r.score} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
