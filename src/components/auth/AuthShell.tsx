import { Link } from "react-router-dom";
import { Factory, Search } from "lucide-react";
import StageBadge, { STAGE_COLORS, type Stage } from "@/components/landing/StageBadge";
import Sparkline from "@/components/landing/Sparkline";

/* Shared look for Login, Signup, ForgotPassword and ResetPassword: the landing page's language
   (white, near-black ink, black pill buttons, hairlines, soft floating cards). Visual only. */

export const authInput =
  "h-11 rounded-xl border-[#E4E4E7] bg-white px-3.5 text-[15px] text-[#0B0B0C] shadow-[0_1px_2px_rgba(16,24,40,0.04)] placeholder:text-[#A1A1AA] focus-visible:ring-2 focus-visible:ring-[#0B0B0C]/10 focus-visible:ring-offset-0 focus-visible:border-[#0B0B0C]";
export const authLabel = "text-[13px] font-medium text-[#2A2C30]";
export const authPrimary =
  "inline-flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#0B0B0C] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#2A2C30] disabled:opacity-50 disabled:pointer-events-none";
export const authSecondary =
  "inline-flex w-full h-11 items-center justify-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-6 text-[15px] font-medium text-[#0B0B0C] shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-colors hover:bg-[#FAFAFA] disabled:opacity-50 disabled:pointer-events-none";
export const authLink = "font-medium text-[#0B0B0C] underline-offset-4 hover:underline";

export const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const AuthDivider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#ECECEE]" /></div>
    <div className="relative flex justify-center"><span className="bg-white px-3 text-[12px] text-[#9A9EA5]">or continue with email</span></div>
  </div>
);

/** A quiet bordered note (success / info) in the landing's card style. */
export const AuthNote = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#E9E9EC] bg-[#FAFAFA] p-5 text-[14px] leading-relaxed text-[#2A2C30] space-y-3">{children}</div>
);

const ROWS: { name: string; cat: string; stage: Stage; gmv: string; growth: string; trend: number[] }[] = [
  { name: "Magnetic phone tripod", cat: "Phones & Electronics", stage: "emerging", gmv: "$48.2K", growth: "+212%", trend: [3, 4, 4, 6, 8, 11, 17] },
  { name: "Heatless curling ribbon", cat: "Beauty & Personal Care", stage: "emerging", gmv: "$31.9K", growth: "+168%", trend: [2, 2, 3, 5, 6, 9, 12] },
  { name: "Silicone stove gap cover", cat: "Home & Kitchen", stage: "rising", gmv: "$112K", growth: "+64%", trend: [6, 8, 9, 11, 13, 14, 16] },
  { name: "Posture corrector vest", cat: "Health", stage: "peaking", gmv: "$286K", growth: "+9%", trend: [8, 12, 15, 17, 18, 18, 17] },
];

const shadow = "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-24px_rgba(16,24,40,0.18)]";

/** Right-hand showcase: a light panel with small floating product cards, no photography. */
function Showcase() {
  return (
    <div className="relative h-full overflow-hidden rounded-[28px] border border-[#ECECEE]"
      style={{ background: "radial-gradient(120% 80% at 100% 0%, #EEF4FF 0%, rgba(238,244,255,0) 55%), radial-gradient(90% 70% at 0% 100%, #EDFCF3 0%, rgba(237,252,243,0) 60%), #F7F7F8" }}>
      {/* faint grid */}
      <div className="absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: "linear-gradient(#ECECEE 1px, transparent 1px), linear-gradient(90deg, #ECECEE 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(70% 60% at 50% 45%, #000 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 45%, #000 30%, transparent 80%)" }} />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
        <div className="mk-pill self-start bg-white/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: STAGE_COLORS.emerging }} /> Product research for US TikTok Shop sellers
        </div>

        {/* Product table card */}
        <div className="relative mx-auto w-full max-w-[460px] pt-[128px] pb-14">
          <div className={`rounded-2xl border border-[#E9E9EC] bg-white ${shadow}`}>
            <div className="flex items-center gap-2 border-b border-[#ECECEE] px-4 py-3">
              <span className="inline-flex h-8 items-center rounded-lg bg-[#0B0B0C] px-3 text-[12px] text-white">Emerging</span>
              <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-[#ECECEE] bg-[#FAFAFA] px-3 text-[12px] text-[#6B6F76]">
                <Search className="h-3.5 w-3.5" /> Search trending products
              </div>
            </div>
            <div>
              {ROWS.map((r, i) => (
                <div key={r.name} className={`grid grid-cols-[1fr,auto,auto] items-center gap-4 px-4 py-3 ${i ? "border-t border-[#ECECEE]" : ""}`}>
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-medium text-[#0B0B0C]">{r.name}</div>
                    <div className="mt-1"><StageBadge stage={r.stage} /></div>
                  </div>
                  <Sparkline points={r.trend} color={STAGE_COLORS[r.stage]} />
                  <div className="w-[72px] text-right mk-num">
                    <div className="text-[13px] font-medium text-[#0B0B0C]">{r.gmv}</div>
                    <div className="text-[11px]" style={{ color: "#067647" }}>{r.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating: momentum card */}
          <div className={`absolute -right-6 top-0 xl:-right-12 w-[244px] rounded-2xl bg-white p-4 ${shadow}`}>
            <div className="flex items-center justify-between">
              <span className="whitespace-nowrap text-[12px] font-medium text-[#0B0B0C]">Momentum, 7 days</span>
              <StageBadge stage="emerging" />
            </div>
            <div className="mt-3 flex h-[44px] items-end gap-1.5">
              {[18, 22, 26, 34, 45, 58, 78].map((h, i) => (
                <div key={i} className="flex-1 rounded-[4px]" style={{ height: `${h}%`, background: i === 6 ? "#12B76A" : "#D1FADF" }} />
              ))}
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-[20px] font-semibold tracking-tight mk-num text-[#0B0B0C]">+212%</span>
              <span className="text-[11px] text-[#6B6F76]">GMV vs last week</span>
            </div>
          </div>

          {/* Floating: supplier chip */}
          <div className={`absolute bottom-0 -left-6 xl:-left-12 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ${shadow}`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B0B0C]"><Factory className="h-4 w-4 text-white" /></span>
            <div className="text-[13px] leading-tight">
              <div className="font-medium text-[#0B0B0C]">Supplier results found</div>
              <div className="text-[#6B6F76] mk-num">from $2.10 a unit · MOQ 200</div>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="max-w-[380px] text-[26px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#0B0B0C]">
            Find TikTok Shop products before they peak.
          </p>
          <span className="shrink-0 text-[12px] text-[#9A9EA5]">Example data</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthShell({ title, subtitle, children, footer }: {
  title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="mk-page min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr),minmax(0,1.08fr)]">
        <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-14">
          <div className="flex h-10 items-center justify-between">
            <Link to="/" className="shrink-0" aria-label="TikProfitPro home">
              <img src="/tikprofitpro_logo.svg" alt="TikProfitPro" height="28" style={{ height: 28 }} />
            </Link>
            <Link to="/" className="text-[14px] text-[#55595F] hover:text-[#0B0B0C]">Back to site</Link>
          </div>

          <div className="flex flex-1 items-center justify-center py-12">
            <div className="w-full max-w-[380px]">
              <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.035em] text-[#0B0B0C]">{title}</h1>
              {subtitle && <p className="mt-3 text-[15px] leading-relaxed text-[#6B6F76]">{subtitle}</p>}
              <div className="mt-8">{children}</div>
              {footer && <div className="mt-8 text-[14px] text-[#6B6F76]">{footer}</div>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#9A9EA5]">
            <span>© {new Date().getFullYear()} TikProfitPro</span>
            <Link to="/terms" className="hover:text-[#0B0B0C]">Terms</Link>
            <Link to="/refund" className="hover:text-[#0B0B0C]">Refund policy</Link>
            <a href="mailto:support@tikprofitpro.shop" className="hover:text-[#0B0B0C]">Support</a>
          </div>
        </div>

        <div className="hidden lg:block p-3 pl-0">
          <Showcase />
        </div>
      </div>
    </div>
  );
}
