import { Link } from "react-router-dom";

const COLS: { title: string; links: { label: string; to: string; external?: boolean }[] }[] = [
  { title: "Product", links: [
    { label: "Features", to: "/#features" },
    { label: "Pricing", to: "/pricing" },
    { label: "Profit calculator", to: "/calculator" },
    { label: "Where to source", to: "/suppliers" },
  ]},
  { title: "Learn", links: [
    { label: "Tutorials", to: "/tutorials" },
    { label: "Blog", to: "https://blog.tikprofitpro.shop/", external: true },
  ]},
  { title: "Company", links: [
    { label: "Sign up", to: "/signup" },
    { label: "Log in", to: "/login" },
    { label: "Terms", to: "/terms" },
    { label: "Refund policy", to: "/refund" },
  ]},
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#0A0B0D] text-[#EDEEF0]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12 md:py-16 grid gap-10 md:grid-cols-[1.4fr,1fr,1fr,1fr]">
        <div>
          <img src="/tikprofitpro_logo.svg" alt="TikProfitPro" style={{ height: 26 }} />
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[#8A9099]">
            Product research for US TikTok Shop sellers: momentum, margins and suppliers in one place.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="text-[13px] font-medium text-[#EDEEF0]">{c.title}</h4>
            <ul className="mt-4 space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.external || l.to.startsWith("/#") ? (
                    <a href={l.to} className="text-[14px] text-[#8A9099] hover:text-white transition-colors">{l.label}</a>
                  ) : (
                    <Link to={l.to} className="text-[14px] text-[#8A9099] hover:text-white transition-colors">{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#5E636B]">
          <p>© {new Date().getFullYear()} TikProfitPro. All rights reserved.</p>
          <p>Not affiliated with TikTok or ByteDance.</p>
        </div>
      </div>
    </footer>
  );
}
