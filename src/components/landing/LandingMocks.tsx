import { ExternalLink, Mail } from "lucide-react";
import StageBadge from "./StageBadge";
import { GrowthPill, ScoreChip, Thumb } from "./HeroProductMock";

// Small product-UI mockups that float over the painted scenes. All illustrative, labelled "Example".

const Frame = ({ title, meta, children }: { title: string; meta?: string; children: React.ReactNode }) => (
  <div className="overflow-hidden rounded-xl border border-[#E1DCD1] bg-white text-left shadow-[0_0_0_1px_rgba(26,42,49,0.04),0_24px_60px_-20px_rgba(26,42,49,0.32)]">
    <div className="flex items-center justify-between gap-3 border-b border-[#ECE8E0] px-4 py-2.5">
      <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] mk-muted">{title}</span>
      {meta && <span className="text-[11px] mk-faint">{meta}</span>}
    </div>
    {children}
  </div>
);

const Initials = ({ s, tone }: { s: string; tone: string }) => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: tone, color: "#1A2A31" }}>{s}</span>
);

/** 01 · Products: one product, its momentum and stage. */
export function ProductDetailMock() {
  return (
    <Frame title="Product" meta="Example">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Thumb img="ribbon" alt="Heatless curling ribbon" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[14px] font-medium text-[#1A2A31]">Heatless curling ribbon</div>
            <div className="text-[11.5px] mk-faint">Beauty & Personal Care</div>
          </div>
          <ScoreChip n={87} />
        </div>
        <div className="mt-4 flex h-[64px] items-end gap-1.5" aria-hidden>
          {[18, 22, 26, 34, 45, 58, 78].map((h, i) => (
            <div key={i} className="flex-1 rounded-[3px]" style={{ height: `${h}%`, background: i === 6 ? "#214F5E" : "#D6E3E8" }} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <StageBadge stage="emerging" />
          <span className="flex items-center gap-2 text-[12px] mk-muted">Revenue, 7d <span className="font-medium text-[#1A2A31] mk-num">$31.9K</span> <GrowthPill v="+168%" /></span>
        </div>
      </div>
    </Frame>
  );
}

const CREATORS = [
  { i: "MR", n: "@maya.reviews", t: "UGC", f: "184K", g: "$62.4K", tone: "#E8F1F6" },
  { i: "JL", n: "@homewithjules", t: "UGC", f: "92K", g: "$38.1K", tone: "#FBF1DF" },
  { i: "TK", n: "@techkurt", t: "AIGC", f: "51K", g: "$21.7K", tone: "#E6F2EB" },
  { i: "SB", n: "@sam.beauty", t: "Live", f: "310K", g: "$19.9K", tone: "#EFEDFB" },
];

/** 02 · Creators: who is already selling in a niche. */
export function CreatorsMock() {
  return (
    <Frame title="Creators" meta="Example">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.1em] mk-muted">
            <th className="px-4 py-2 text-left font-medium">Creator</th>
            <th className="hidden px-3 py-2 text-right font-medium sm:table-cell">Followers</th>
            <th className="px-4 py-2 text-right font-medium">GMV</th>
          </tr>
        </thead>
        <tbody>
          {CREATORS.map((c) => (
            <tr key={c.n} className="border-t border-[#F0ECE4]">
              <td className="px-4 py-2">
                <div className="flex items-center gap-2.5">
                  <Initials s={c.i} tone={c.tone} />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[#1A2A31]">{c.n}</div>
                    <div className="flex items-center gap-1.5 text-[11px] mk-faint">{c.t} <Mail className="h-3 w-3" aria-label="Has contact email" /></div>
                  </div>
                </div>
              </td>
              <td className="hidden px-3 py-2 text-right mk-num text-[#2B3A40] sm:table-cell">{c.f}</td>
              <td className="px-4 py-2 text-right mk-num font-semibold text-[#1A2A31]">{c.g}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

const SHOPS = [
  { i: "NH", n: "Nook & Hearth", t: "Home", r: "$84.2K", g: "+41%", tone: "#FBF1DF" },
  { i: "GL", n: "Glowlab Studio", t: "Beauty", r: "$61.0K", g: "+29%", tone: "#EFEDFB" },
  { i: "PW", n: "Pawly Goods", t: "Pets", r: "$33.5K", g: "+57%", tone: "#E6F2EB" },
];

/** 03 · Shops: new US shops ranked by revenue. */
export function ShopsMock() {
  return (
    <Frame title="New shops" meta="Example">
      <div className="divide-y divide-[#F0ECE4]">
        {SHOPS.map((s, i) => (
          <div key={s.n} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-4 text-[11px] mk-faint mk-num">{i + 1}</span>
            <Initials s={s.i} tone={s.tone} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-[#1A2A31]">{s.n}</div>
              <div className="text-[11px] mk-faint">{s.t}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-semibold mk-num text-[#1A2A31]">{s.r}</div>
              <GrowthPill v={s.g} />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

const SUPPLIERS = [
  { n: "Satin heatless curler set", m: "Alibaba", c: "$0.86", q: "200" },
  { n: "Silk curling rod, 2 pack", m: "AliExpress", c: "$2.40", q: "1" },
  { n: "No-heat curl ribbon kit", m: "Alibaba", c: "$1.15", q: "100" },
];

/** 04 · Suppliers: the top 3 marketplace search results, in search order. */
export function SuppliersMock() {
  return (
    <Frame title="Top 3 search results" meta="Example">
      <table className="w-full text-[12.5px]">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.1em] mk-muted">
            <th className="px-4 py-2 text-left font-medium">Listing</th>
            <th className="px-3 py-2 text-right font-medium">Unit</th>
            <th className="px-4 py-2 text-right font-medium">MOQ</th>
          </tr>
        </thead>
        <tbody>
          {SUPPLIERS.map((s, i) => (
            <tr key={s.n} className="border-t border-[#F0ECE4]">
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] mk-faint mk-num">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-[#1A2A31]">{s.n}</div>
                    <div className="flex items-center gap-1 text-[11px] mk-faint">{s.m} <ExternalLink className="h-3 w-3" aria-hidden /></div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-right mk-num font-semibold text-[#1A2A31]">{s.c}</td>
              <td className="px-4 py-2.5 text-right mk-num text-[#2B3A40]">{s.q}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="border-t border-[#ECE8E0] bg-[#FAF8F4] px-4 py-2 text-[11px] mk-muted">In marketplace search order. Check each listing and order a sample first.</div>
    </Frame>
  );
}
