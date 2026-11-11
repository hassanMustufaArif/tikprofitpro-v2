import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ProfitCalcEmbed from "@/components/landing/ProfitCalcEmbed";
import FAQSection from "@/components/landing/FAQSection";
import HeroProductMock from "@/components/landing/HeroProductMock";
import { CreatorsMock, ProductDetailMock, ShopsMock, SuppliersMock } from "@/components/landing/LandingMocks";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { savePendingPlan } from "@/lib/authFlow";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

const PLANS = [
  { name: "Free", price: "$0", period: "forever", cta: "Start free", to: "/pricing#free",
    features: ["Top 10 trending products", "Virality scores", "5 sourcing credits a month", "Dashboard overview", "Profit calculator"] },
  { name: "Pro", price: "$39", period: "/month", cta: "Start Pro", to: "/pricing", featured: true,
    features: ["Full list of trending products", "Product search", "50 sourcing credits a month", "Alibaba and AliExpress supplier search (Amazon in beta)", "Full product stats", "Rankings refreshed regularly"] },
  { name: "Ultimate", price: "$99", period: "/month", cta: "Start Ultimate", ultimate: true,
    features: ["Everything in Pro", "120 sourcing credits a month", "Priority support", "Early access to new features"] },
];

const GUIDES = [
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-product-research-tool/", title: "How to research TikTok Shop products", tag: "Research" },
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-for-beginners-usa-guide-a-practical-approach-to-success/", title: "TikTok Shop for beginners: a practical US guide", tag: "Getting started" },
  { href: "https://blog.tikprofitpro.shop/best-products-to-sell-on-tiktok-shop/", title: "Best products to sell on TikTok Shop", tag: "Products" },
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-vs-amazon-dropshipping-which-is-better-for-us-sellers-in-2026/", title: "TikTok Shop vs Amazon dropshipping in 2026", tag: "Strategy" },
];

type Feature = {
  n: string; label: string; title: [string, string]; body: string; points: string[];
  img: string; pos: string; mock: React.ReactNode; link?: { to: string; label: string };
};

const FEATURES: Feature[] = [
  {
    n: "01", label: "Products", title: ["Spot products early.", "Skip the ones that peaked."],
    body: "Trending TikTok Shop products ranked by revenue, units sold and a virality score. Each one is tagged with its stage, so you know what to launch and what to leave alone.",
    points: ["Emerging, rising, peaking or saturated", "Revenue and units for the last 7 days", "Sort by score, revenue, views or creators"],
    img: "/images/rooftops-sky.webp", pos: "50% 60%", mock: <ProductDetailMock />, link: { to: "/products", label: "Browse products" },
  },
  {
    n: "02", label: "Creators", title: ["See who already sells", "in your niche."],
    body: "Browse UGC, AI-content and live creators making shoppable videos in the US, ranked by GMV, followers and engagement.",
    points: ["Video and live GMV side by side", "Engagement and average views", "Contact email where a creator lists one"],
    img: "/images/open-sky.webp", pos: "50% 40%", mock: <CreatorsMock />,
  },
  {
    n: "03", label: "Shops", title: ["Watch the new shops", "that are taking off."],
    body: "Recently launched US shops ranked by revenue, with the split between video, live, product card and affiliate sales.",
    points: ["Revenue and growth for each shop", "Average price and items sold", "Where the sales come from"],
    img: "/images/hero-dawn-market.webp", pos: "50% 75%", mock: <ShopsMock />,
  },
  {
    n: "04", label: "Suppliers", title: ["Find who makes it.", "Then check the margin."],
    body: "Click Suppliers on any product to see the top 3 Alibaba or AliExpress search results for it, with unit price and minimum order. Amazon is in beta.",
    points: ["Top 3 results, in marketplace search order", "Unit price and MOQ at a glance", "Always order a sample before buying in bulk"],
    img: "/images/parcels-street.webp", pos: "30% 70%", mock: <SuppliersMock />, link: { to: "/suppliers", label: "Where to source" },
  },
];

const Landing = () => {
  const { checkout, loading: checkoutLoading } = useCheckout();
  const { session } = useAuth();
  const navigate = useNavigate();
  // Same as Pricing: signed-out visitors sign up first, then continue to checkout.
  const startUltimate = () => {
    if (!session) {
      savePendingPlan("ultimate");
      navigate("/signup?plan=ultimate");
      return;
    }
    checkout("ultimate");
  };

  return (
    <div className="mk-page min-h-screen overflow-x-hidden">
      <Navbar variant="light" />

      {/* ───── HERO: painted dawn backdrop, centred two-line headline, product window floating over it ───── */}
      <section className="px-2 pt-2 md:px-4 md:pt-4">
        <div className="mk-scene pb-6 md:pb-12">
          <img src="/images/hero-dawn-market.webp" alt="" aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[980px] w-full object-cover md:h-[980px]"
            style={{ objectPosition: "50% 30%", maskImage: "linear-gradient(#000 62%, transparent 100%)", WebkitMaskImage: "linear-gradient(#000 62%, transparent 100%)" }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FAF8F4]/55 via-[#FAF8F4]/10 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px]" aria-hidden style={{ background: "radial-gradient(ellipse 55% 50% at 50% 38%, rgba(250,248,244,0.78), rgba(250,248,244,0) 72%)" }} />

          <motion.div variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-[1100px] px-5 pt-28 text-center md:pt-40">
            <motion.div variants={fade} className="mk-pill">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2F8F62]" aria-hidden /> Product research for US TikTok Shop sellers
            </motion.div>
            <motion.h1 variants={fade} className="mk-h1 mt-7">
              <span className="sr-only">TikProfitPro: </span>
              <span className="inline-block">Find what's selling on TikTok Shop.</span><br />
              <span className="mk-soft-line">Before everyone else does.</span>
            </motion.h1>
            <motion.p variants={fade} className="mk-lead mx-auto mt-6 max-w-[620px] rounded-2xl bg-[#FAF8F4]/70 px-3 py-2 !text-[#33454C] backdrop-blur-[2px] md:bg-transparent md:p-0 md:backdrop-blur-none">
              Spot products while they're still emerging, see the creators and shops behind them, find suppliers and check the real margin after TikTok's fees.
            </motion.p>
            <motion.div variants={fade} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/pricing#free" className="mk-btn-primary">Try it free <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/calculator" className="mk-btn-secondary">Profit calculator</Link>
            </motion.div>
            <motion.p variants={fade} className="mt-4"><span className="inline-block rounded-full bg-[#FAF8F4]/80 px-3 py-1 text-[13px] text-[#33454C] backdrop-blur">Free plan, no card required.</span></motion.p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-12 max-w-[1120px] px-3 md:mt-16 md:px-8">
            <HeroProductMock />
          </motion.div>
        </div>
      </section>

      {/* ───── SOURCES STRIP ───── */}
      <section>
        <div className="mk-container flex flex-col items-center gap-3 py-10 text-center md:flex-row md:justify-center md:gap-10">
          <p className="mk-eyebrow">Built for</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["TikTok Shop sellers", "Alibaba", "AliExpress", "Amazon (beta)"].map((n) => (
              <span key={n} className="font-display text-[22px] md:text-[26px] text-[#5B6A70]">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── 01–04 FEATURES ───── */}
      <section id="features" className="py-16 md:py-24">
        <div className="mk-container">
          <Reveal className="max-w-[720px]">
            <p className="mk-eyebrow">How it works</p>
            <h2 className="mk-h2 mt-4">Four views of one market.<br /><span className="mk-soft-line">Each a step closer to a sale.</span></h2>
          </Reveal>

          <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
            {FEATURES.map((f, i) => (
              <Reveal key={f.n} className="grid items-center gap-8 lg:grid-cols-[0.85fr,1.15fr] lg:gap-14">
                <div className={i % 2 ? "lg:order-2" : ""}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-[44px] leading-none text-[#214F5E] mk-num">{f.n}</span>
                    <span className="mk-eyebrow">{f.label}</span>
                  </div>
                  <h3 className="mk-h3 mt-5 !text-[30px] md:!text-[38px] !leading-[1.08]">{f.title[0]}<br /><span className="mk-soft-line">{f.title[1]}</span></h3>
                  <p className="mk-lead mt-5 max-w-[460px]">{f.body}</p>
                  <ul className="mt-6 space-y-2.5 border-t mk-divider pt-5">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-[#2B3A40]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#214F5E]" /> {p}
                      </li>
                    ))}
                  </ul>
                  {f.link && (
                    <Link to={f.link.to} className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#214F5E] hover:underline underline-offset-4">
                      {f.link.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <div className={`mk-scene flex min-h-[340px] items-center justify-center p-3 sm:p-8 md:min-h-[440px] md:p-12 ${i % 2 ? "lg:order-1" : ""}`}>
                  <img src={f.img} alt="" aria-hidden loading="lazy" className="mk-scene-img" style={{ objectPosition: f.pos }} />
                  <div className="relative w-full max-w-[440px]">{f.mock}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MARGIN / CALCULATOR ───── */}
      <section className="mk-soft py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mb-10 grid gap-6 md:grid-cols-[1fr,1fr] md:items-end">
            <h2 className="mk-h2">Check the real margin.<br /><span className="mk-soft-line">Before you spend a dollar.</span></h2>
            <p className="mk-lead max-w-[460px]">Free, no sign-up. Every result includes TikTok's 6% US referral fee, creator commission and ad cost. Change any number and it updates instantly.</p>
          </Reveal>
          <Reveal className="mk-card p-5 md:p-8">
            <ProfitCalcEmbed />
          </Reveal>
        </div>
      </section>

      {/* ───── DEMO ───── */}
      <section className="py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="mk-h2 max-w-xl">From trending video<br /><span className="mk-soft-line">to supplier in two minutes.</span></h2>
            <Link to="/tutorials" className="mk-btn-secondary self-start md:self-auto"><PlayCircle className="h-4 w-4" /> Watch tutorials</Link>
          </Reveal>
          <Reveal className="overflow-hidden rounded-[22px] border mk-divider bg-white p-2 shadow-soft md:p-3">
            <video src="/screenshots/dashboard-demo.mp4" poster="/screenshots/dashboard-preview.png" className="block w-full rounded-[16px]" autoPlay loop muted playsInline preload="metadata">
              Your browser does not support embedded video.
            </video>
          </Reveal>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="border-t mk-divider py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mb-12 grid gap-6 md:grid-cols-[1fr,auto] md:items-end">
            <h2 className="mk-h2">Simple pricing.<br /><span className="mk-soft-line">Start free, upgrade to source.</span></h2>
            <Link to="/pricing" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#214F5E] hover:underline underline-offset-4">Compare plans <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <Reveal key={p.name} className={`flex flex-col rounded-2xl border p-7 md:p-8 ${p.featured ? "border-[#214F5E] bg-white shadow-[0_0_0_1px_#214F5E,0_24px_60px_-24px_rgba(33,79,94,0.35)]" : "mk-flat"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-medium text-[#1A2A31]">{p.name}</h3>
                  {p.featured && <span className="rounded-full bg-[#E7EFF2] px-2.5 py-1 text-[12px] font-medium text-[#173F4C]">Most popular</span>}
                </div>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-[56px] leading-none mk-num text-[#1A2A31]">{p.price}</span>
                  <span className="text-[15px] mk-muted">{p.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3 border-t mk-divider pt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-[#2B3A40]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#214F5E]" /> {f}
                    </li>
                  ))}
                </ul>
                {p.ultimate ? (
                  <button onClick={startUltimate} disabled={checkoutLoading} className="mk-btn-secondary mt-8 w-full">
                    {checkoutLoading ? "Loading…" : p.cta}
                  </button>
                ) : p.featured ? (
                  <Link to={p.to!} className="mk-btn-primary mt-8 w-full">{p.cta}</Link>
                ) : (
                  <Link to={p.to!} className="mk-btn-secondary mt-8 w-full">{p.cta}</Link>
                )}
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-center text-[14px] mk-muted">No contracts. Cancel anytime. 7-day money-back guarantee.</p>
        </div>
      </section>

      {/* ───── FOUNDER ───── */}
      <section id="about" className="border-t mk-divider py-20 md:py-24">
        <div className="mk-container">
          <Reveal className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[auto,1fr]">
            <img src="/founder-arif.webp" alt="Muhammad Arif Suriwala, founder of TikProfitPro"
              className="h-32 w-32 rounded-2xl object-cover md:h-40 md:w-40" style={{ objectPosition: "50% 15%" }} />
            <div>
              <p className="font-display text-[26px] leading-snug text-[#1A2A31] md:text-[34px]">
                "I'm building TikProfitPro to give TikTok Shop sellers the research I wished existed: honest data, real margins and suppliers you can actually order from."
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
                <span className="font-medium text-[#1A2A31]">Muhammad Arif Suriwala</span>
                <span className="mk-muted">Founder & AI engineer</span>
                <a href="https://www.linkedin.com/in/sodewala" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[#214F5E] hover:underline">LinkedIn <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── GUIDES ───── */}
      <section className="pb-20 md:pb-28">
        <div className="mk-container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="mk-h2">Learn the playbook.</h2>
            <a href="https://blog.tikprofitpro.shop/" className="hidden items-center gap-1 text-[15px] font-medium text-[#214F5E] hover:underline sm:inline-flex">All guides <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <a key={g.href} href={g.href} className="group mk-flat flex min-h-[200px] flex-col justify-between p-6 transition-shadow hover:shadow-soft">
                <span className="mk-eyebrow">{g.tag}</span>
                <div>
                  <h3 className="font-display text-[22px] leading-snug text-[#1A2A31]">{g.title}</h3>
                  <ArrowUpRight className="mt-4 h-5 w-5 text-[#214F5E] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* ───── FINAL CTA over the open sky ───── */}
      <section className="px-2 pb-2 md:px-4 md:pb-4">
        <div className="mk-scene px-6 py-20 text-center md:py-32">
          <img src="/images/open-sky.webp" alt="" aria-hidden loading="lazy" className="mk-scene-img" style={{ objectPosition: "50% 85%" }} />
          <div className="pointer-events-none absolute inset-0 bg-[#FAF8F4]/25" aria-hidden />
          <div className="relative mx-auto max-w-[760px]">
            <h2 className="mk-h2">Your next winner is emerging.<br /><span className="mk-soft-line">Find it this week.</span></h2>
            <p className="mk-lead mx-auto mt-5 max-w-[480px] !text-[#33454C]">Start free and see this week's emerging products in minutes.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/pricing#free" className="mk-btn-primary">Try it free <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/pricing" className="mk-btn-secondary">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
};

export default Landing;
