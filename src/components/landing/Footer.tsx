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

export default function Footer({ variant = "dark" }: { variant?: "light" | "dark" }) {
  const light = variant === "light";
  const c = light
    ? { wrap: "border-[#ECECEE] bg-white text-[#0B0B0C]", head: "text-[#0B0B0C]", link: "text-[#6B6F76] hover:text-[#0B0B0C]", line: "border-[#ECECEE]", fine: "text-[#9A9EA5]" }
    : { wrap: "border-white/[0.07] bg-[#080808] text-[#EDEEF0]", head: "text-[#EDEEF0]", link: "text-[#8A9099] hover:text-white", line: "border-white/[0.07]", fine: "text-[#5E636B]" };
  return (
    <footer className={`border-t ${c.wrap}`}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-12 md:py-16 grid gap-10 md:grid-cols-[1.4fr,1fr,1fr,1fr]">
        <div>
          <img src="/tikprofitpro_logo.svg" alt="TikProfitPro" style={{ height: 26 }} />
          <p className={`mt-3 max-w-xs text-[14px] leading-relaxed ${light ? "text-[#6B6F76]" : "text-[#8A9099]"}`}>
            Product research for US TikTok Shop sellers: momentum, margins and suppliers in one place.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className={`text-[13px] font-medium ${c.head}`}>{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.external || l.to.startsWith("/#") ? (
                    <a href={l.to} className={`text-[14px] transition-colors ${c.link}`}>{l.label}</a>
                  ) : (
                    <Link to={l.to} className={`text-[14px] transition-colors ${c.link}`}>{l.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={`border-t ${c.line}`}>
        <div className={`max-w-[1200px] mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] ${c.fine}`}>
          <p>© {new Date().getFullYear()} TikProfitPro. All rights reserved.</p>
          <p>Not affiliated with TikTok or ByteDance.</p>
        </div>
      </div>
    </footer>
  );
}
