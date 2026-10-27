import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Product", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Calculator", href: "/calculator" },
  { label: "Suppliers", href: "/suppliers" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Blog", href: "https://blog.tikprofitpro.shop/", external: true },
];

type Variant = "light" | "dark";

const THEME: Record<Variant, { bar: string; link: string; login: string; cta: string; menu: string }> = {
  light: {
    bar: "bg-white/85 backdrop-blur-xl border-b border-[#ECECEE]",
    link: "text-[#55595F] hover:text-[#0B0B0C]",
    login: "bg-[#F1F1F3] text-[#0B0B0C] hover:bg-[#E6E6E9]",
    cta: "bg-[#0B0B0C] text-white hover:bg-[#2A2C30]",
    menu: "bg-white border-b border-[#ECECEE]",
  },
  dark: {
    bar: "bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.07]",
    link: "text-[#8A9099] hover:text-white",
    login: "bg-white/[0.06] text-white hover:bg-white/10",
    cta: "bg-white text-[#0B0B0C] hover:bg-white/90",
    menu: "bg-[#080808] border-b border-white/[0.07]",
  },
};

export default function Navbar({ variant = "dark" }: { variant?: Variant }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { session } = useAuth();
  const t = THEME[variant];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (window.location.pathname !== "/") return; // let the browser navigate to /#id
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(href.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  const renderLink = (link: (typeof navLinks)[number], cls: string, onClick?: () => void) =>
    link.href.startsWith("/#") ? (
      <a key={link.label} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)} className={cls}>{link.label}</a>
    ) : link.external ? (
      <a key={link.label} href={link.href} onClick={onClick} className={cls}>{link.label}</a>
    ) : (
      <Link key={link.label} to={link.href} onClick={onClick} className={cls}>{link.label}</Link>
    );

  const pill = "inline-flex h-10 items-center rounded-full px-5 text-[14px] font-medium transition-colors";

  return (
    <motion.nav initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || mobileOpen ? t.bar : "border-b border-transparent"}`}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link to={session ? "/dashboard" : "/"} className="shrink-0">
          <img src="/tikprofitpro_logo.svg" alt="TikProfitPro" height="28" style={{ height: 28 }} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => renderLink(l, `text-[14px] transition-colors ${t.link}`))}
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <Link to="/dashboard" className={`hidden md:inline-flex ${pill} ${t.cta}`}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className={`hidden md:inline-flex ${pill} ${t.login}`}>Sign in</Link>
              <Link to="/pricing#free" className={`hidden md:inline-flex ${pill} ${t.cta}`}>Try it free</Link>
            </>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu"
            className={`md:hidden h-11 w-11 flex items-center justify-center ${variant === "light" ? "text-[#0B0B0C]" : "text-white"}`}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className={`md:hidden overflow-hidden ${t.menu}`}>
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((l) => renderLink(l, `block py-3 text-[16px] ${t.link}`, () => setMobileOpen(false)))}
              <div className="pt-4 grid gap-2">
                {session ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={`${pill} justify-center h-12 ${t.cta}`}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className={`${pill} justify-center h-12 ${t.login}`}>Sign in</Link>
                    <Link to="/pricing#free" onClick={() => setMobileOpen(false)} className={`${pill} justify-center h-12 ${t.cta}`}>Try it free</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
