import { Link } from "react-router-dom";
import Wordmark from "@/components/Wordmark";

/** Calm split layout for the auth pages: form on warm paper, painted market scene alongside on large screens. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mk-page grid min-h-screen lg:grid-cols-[1fr,1.05fr]">
      <div className="flex flex-col px-5 py-6 md:px-10">
        <Link to="/" className="self-start" aria-label="TikProfitPro home"><Wordmark size={26} /></Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="font-display text-[40px] leading-[1.05] text-[#1A2A31]">{title}</h1>
              {subtitle && <p className="text-[15px] text-muted-foreground">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
        <p className="text-[12px] text-muted-foreground">© {new Date().getFullYear()} TikProfitPro · <Link to="/terms" className="hover:text-foreground">Terms</Link> · <Link to="/refund" className="hover:text-foreground">Refunds</Link></p>
      </div>
      <div className="hidden p-3 lg:block">
        <div className="mk-scene sticky top-3 h-[calc(100vh-1.5rem)]">
          <img src="/images/parcels-street.webp" alt="" aria-hidden className="mk-scene-img" style={{ objectPosition: "35% 60%" }} />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#FAF8F4]/70 to-transparent" aria-hidden />
          <div className="relative p-12">
            <p className="font-display text-[44px] leading-[1.05] text-[#1A2A31]">Find what's selling.<br /><span className="italic text-[#4F6772]">Source it. Check the margin.</span></p>
            <p className="mt-4 max-w-sm text-[15px] text-[#33454C]">Product research for US TikTok Shop sellers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
