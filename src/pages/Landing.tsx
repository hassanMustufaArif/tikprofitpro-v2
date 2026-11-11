import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Star, TrendingUp, Factory, PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ProfitCalcEmbed from "@/components/landing/ProfitCalcEmbed";
import FAQSection from "@/components/landing/FAQSection";
import HeroProductMock from "@/components/landing/HeroProductMock";
import StageBadge, { STAGE_COLORS } from "@/components/landing/StageBadge";
import Sparkline from "@/components/landing/Sparkline";
import { useCheckout } from "@/hooks/useCheckout";
import { useAuth } from "@/contexts/AuthContext";
import { savePendingPlan } from "@/lib/authFlow";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5, ease: "easeOut" }} className={className}>
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

      {/* ───── HERO: split, text left, photo card right ───── */}
      <section className="pt-24 md:pt-28 pb-10">
        <div className="mk-container">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.05fr] lg:min-h-[640px]">
            <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col justify-between py-4 lg:py-8">
              <div>
                <motion.div variants={fade} className="mk-pill">
                  <Star className="h-3.5 w-3.5 fill-[#0B0B0C]" /> Product research for US TikTok Shop sellers
                </motion.div>
                <motion.h1 variants={fade} className="mk-h1 mt-7">
                  <span className="sr-only">TikProfitPro: </span>
                  Find TikTok Shop products before they peak
                </motion.h1>
              </div>
              <div className="mt-10 lg:mt-0">
                <motion.p variants={fade} className="mk-lead max-w-[460px]">
                  Spot products while they're still emerging, check the real margin after TikTok's fees, and find who makes them. One tool, ten minutes.
                </motion.p>
                <motion.div variants={fade} className="mt-7 flex flex-wrap items-center gap-3">
                  <Link to="/pricing#free" className="mk-btn-primary">Try it free</Link>
                  <Link to="/calculator" className="mk-btn-secondary">Profit calculator</Link>
                </motion.div>
                <motion.p variants={fade} className="mt-4 text-[13px] mk-muted">Free plan, no card required.</motion.p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-[520px] overflow-hidden rounded-[28px] bg-[#E9EEF3]">
              <img src="/landing/hero-creator.webp" alt="A seller filming a beauty product demo on a phone"
                className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: "50% 40%" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

              {/* Floating: momentum card */}
              <div className="absolute right-4 top-4 md:right-6 md:top-6 w-[230px] rounded-2xl bg-white p-4 shadow-[0_12px_32px_-12px_rgba(16,24,40,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#0B0B0C]">Momentum, 7 days</span>
                  <StageBadge stage="emerging" />
                </div>
                <div className="mt-3 flex items-end gap-1.5 h-[72px]">
                  {[18, 22, 26, 34, 45, 58, 78].map((h, i) => (
                    <div key={i} className="flex-1 rounded-[4px]" style={{ height: `${h}%`, background: i === 6 ? "#12B76A" : "#D1FADF" }} />
                  ))}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[22px] font-semibold tracking-tight mk-num">+212%</span>
                  <span className="text-[11px] mk-muted">GMV vs last week</span>
                </div>
              </div>

              {/* Floating: supplier chip */}
              <div className="absolute left-4 bottom-20 md:left-6 md:bottom-24 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_12px_32px_-12px_rgba(16,24,40,0.35)] backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B0B0C]"><Factory className="h-4 w-4 text-white" /></span>
                <div className="text-[13px] leading-tight">
                  <div className="font-medium text-[#0B0B0C]">Supplier results found</div>
                  <div className="mk-muted mk-num">from $2.10 a unit · MOQ 200</div>
                </div>
              </div>

              {/* Bottom caption */}
              <div className="absolute inset-x-4 bottom-4 md:inset-x-6 md:bottom-6 flex items-center justify-between text-white">
                <span className="flex items-center gap-2 text-[14px] font-medium"><TrendingUp className="h-4 w-4" /> Est. margin 58% after fees</span>
                <span className="text-[12px] text-white/70">Example</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── SOURCES STRIP ───── */}
      <section className="border-y mk-divider">
        <div className="mk-container flex flex-col md:flex-row md:items-center gap-4 md:gap-10 py-7">
          <p className="text-[13px] mk-muted shrink-0">Data and matching across</p>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-x-10 gap-y-3">
            {["TikTok Shop", "Alibaba", "AliExpress", "Amazon"].map((n) => (
              <span key={n} className="text-[18px] md:text-[20px] font-semibold tracking-[-0.02em] text-[#9A9EA5]">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PRODUCT TABLE (Ahrefs-style, product first) ───── */}
      <section id="features" className="py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="mk-h2">Every trending product, scored and staged</h2>
            <p className="mk-lead mt-5">Sort trending TikTok Shop products by momentum, sales and margin. Each one is tagged with where it is in its life cycle, so you know what to launch and what to skip.</p>
          </Reveal>
          <Reveal className="mt-12 md:mt-16">
            <HeroProductMock />
          </Reveal>
          <Reveal className="mt-10 grid gap-px overflow-hidden rounded-2xl border mk-divider bg-[#ECECEE] sm:grid-cols-2 lg:grid-cols-4">
            {([
              ["emerging", [2, 3, 3, 5, 7, 10, 14], "Early and growing fast. The best time to launch."],
              ["rising", [5, 7, 8, 10, 12, 13, 15], "Proven demand, still climbing. Launch with a twist."],
              ["peaking", [8, 12, 15, 17, 18, 18, 17], "Crowded and slowing. Only with a real edge."],
              ["saturated", [18, 17, 15, 13, 11, 10, 9], "Declining. Skip it."],
            ] as const).map(([stage, pts, note]) => (
              <div key={stage} className="bg-white p-6">
                <StageBadge stage={stage} />
                <div className="mt-4"><Sparkline points={[...pts]} color={STAGE_COLORS[stage]} width={160} height={40} /></div>
                <p className="mt-3 text-[14px] leading-relaxed mk-muted">{note}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ───── BIG NUMBERS ───── */}
      <section className="mk-soft py-16 md:py-20">
        <div className="mk-container grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {[
            ["Fresh", "trending products updated regularly"],
            ["Top 3", "supplier results per search"],
            ["6%", "TikTok US referral fee, built in"],
            ["2+", "sourcing marketplaces (Amazon in beta)"],
          ].map(([k, v]) => (
            <div key={v} className="px-2">
              <div className="text-[44px] md:text-[64px] font-semibold leading-none tracking-[-0.045em] mk-num">{k}</div>
              <div className="mt-3 text-[15px] mk-muted">{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURE ROWS ───── */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="mk-container space-y-20 md:space-y-28">
          {/* Profit */}
          <Reveal className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[14px] font-medium text-[#0B0B0C]">01 · Check the numbers</p>
              <h3 className="mk-h2 mt-4">Know your real margin before you spend a dollar</h3>
              <p className="mk-lead mt-5 max-w-[480px]">Most "winning products" stop winning once you add the fees. Every margin includes TikTok's 6% referral fee, creator commission, shipping and ad cost.</p>
              <Link to="/calculator" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#0B0B0C] hover:underline">Open the calculator <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mk-soft rounded-[28px] p-6 md:p-10">
              <div className="mk-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium">Heatless curling ribbon</span>
                  <StageBadge stage="emerging" />
                </div>
                <div className="mt-5 space-y-3 text-[15px] mk-num">
                  {[["Sale price", "$24.99"], ["Product cost + shipping", "−$6.40"], ["TikTok referral fee (6%)", "−$1.50"], ["Creator commission (15%)", "−$3.75"], ["Ad cost per sale", "−$2.00"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between"><span className="mk-muted">{k}</span><span>{v}</span></div>
                  ))}
                  <div className="flex justify-between border-t mk-divider pt-3 text-[17px] font-semibold"><span>Net profit per sale</span><span className="text-[#067647]">$11.34</span></div>
                  <div className="flex justify-between text-[13px] mk-muted"><span>Margin 45% · Break-even at $10.63</span><span>Example</span></div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Source */}
          <Reveal className="grid items-center gap-10 lg:grid-cols-2">
            <div className="lg:order-2">
              <p className="text-[14px] font-medium text-[#0B0B0C]">02 · Find who makes it</p>
              <h3 className="mk-h2 mt-4">Match any product to suppliers in one click</h3>
              <p className="mk-lead mt-5 max-w-[480px]">Search Alibaba and AliExpress (Amazon in beta) for similar listings, then compare unit cost, minimum order and shipping side by side.</p>
              <Link to="/suppliers" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-[#0B0B0C] hover:underline">Where to source <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mk-soft rounded-[28px] p-6 md:p-10 lg:order-1">
              <div className="mk-card overflow-hidden">
                <div className="grid grid-cols-[1fr,auto,auto,auto] gap-x-5 px-5 py-3 text-[12px] mk-muted bg-[#FAFAFA] border-b mk-divider">
                  <span>Listing</span><span className="text-right">Unit</span><span className="text-right">MOQ</span><span className="text-right">Match</span>
                </div>
                {[
                  ["Factory listing · Alibaba", "$2.10", "200", "High", "#067647", "#ECFDF3"],
                  ["Store listing · AliExpress", "$3.45", "1", "High", "#067647", "#ECFDF3"],
                  ["Similar item · Amazon", "$7.99", "1", "Partial", "#B54708", "#FFFAEB"],
                ].map(([n, c, m, conf, fg, bg]) => (
                  <div key={n} className="grid grid-cols-[1fr,auto,auto,auto] items-center gap-x-5 px-5 py-3.5 text-[14px] border-b mk-divider last:border-0">
                    <span className="font-medium">{n}</span>
                    <span className="text-right mk-num">{c}</span>
                    <span className="text-right mk-num mk-muted">{m}</span>
                    <span className="rounded-full px-2 py-0.5 text-[12px] font-medium" style={{ color: fg, background: bg }}>{conf}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[13px] mk-muted">Example results. Always order a sample before buying in bulk.</p>
            </div>
          </Reveal>

          {/* Creators */}
          <Reveal className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[14px] font-medium text-[#0B0B0C]">03 · Get it in front of buyers</p>
              <h3 className="mk-h2 mt-4">See which creators and shops are already selling</h3>
              <p className="mk-lead mt-5 max-w-[480px]">Browse UGC and AI-content creators by revenue, followers and engagement, plus the fastest-growing new shops in your niche.</p>
            </div>
            <div className="mk-soft rounded-[28px] p-6 md:p-10">
              <div className="grid grid-cols-2 gap-3">
                {[["UGC creators", "Video GMV"], ["AIGC creators", "Engagement"], ["New shops", "Growth rate"], ["Live sellers", "Live GMV"]].map(([t, m]) => (
                  <div key={t} className="mk-card p-5">
                    <div className="text-[15px] font-medium">{t}</div>
                    <div className="mt-1 text-[13px] mk-muted">Sort by {m.toLowerCase()}</div>
                    <ArrowUpRight className="mt-6 h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── DEMO ───── */}
      <section className="pb-20 md:pb-28">
        <div className="mk-container">
          <Reveal className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="mk-h2 max-w-xl">From trending video to supplier in two minutes</h2>
            <Link to="/tutorials" className="mk-btn-secondary self-start md:self-auto"><PlayCircle className="h-4 w-4" /> Watch tutorials</Link>
          </Reveal>
          <Reveal className="overflow-hidden rounded-[28px] bg-[#0B0B0C] p-2 md:p-3">
            <video src="/screenshots/dashboard-demo.mp4" poster="/screenshots/dashboard-preview.png" className="block w-full rounded-[20px]" autoPlay loop muted playsInline preload="metadata">
              Your browser does not support embedded video.
            </video>
          </Reveal>
        </div>
      </section>

      {/* ───── CALCULATOR ───── */}
      <section className="mk-soft py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="mk-h2">Try the profit calculator</h2>
            <p className="mk-lead mt-4">Free, no sign-up. Change any number and the result updates instantly.</p>
          </Reveal>
          <Reveal className="mk-card p-5 md:p-8">
            <ProfitCalcEmbed />
          </Reveal>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="mk-container">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mk-h2">Simple pricing</h2>
            <p className="mk-lead mt-4">Start free. Upgrade when you're ready to source.</p>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <Reveal key={p.name} className={`flex flex-col rounded-[24px] p-7 md:p-8 ${p.featured ? "bg-[#0B0B0C] text-white" : "mk-card"}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-medium">{p.name}</h3>
                  {p.featured && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium">Most popular</span>}
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-[52px] font-semibold leading-none tracking-[-0.04em] mk-num">{p.price}</span>
                  <span className={`text-[15px] ${p.featured ? "text-white/60" : "mk-muted"}`}>{p.period}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-[15px] ${p.featured ? "text-white/85" : "text-[#2A2C30]"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-[#32D583]" : "text-[#12B76A]"}`} /> {f}
                    </li>
                  ))}
                </ul>
                {p.ultimate ? (
                  <button onClick={startUltimate} disabled={checkoutLoading} className="mk-btn-secondary mt-8 w-full">
                    {checkoutLoading ? "Loading…" : p.cta}
                  </button>
                ) : p.featured ? (
                  <Link to={p.to!} className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-white text-[15px] font-medium text-[#0B0B0C] hover:bg-white/90">{p.cta}</Link>
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
              className="h-32 w-32 md:h-40 md:w-40 rounded-[24px] object-cover" style={{ objectPosition: "50% 15%" }} />
            <div>
              <p className="text-[22px] md:text-[28px] font-medium leading-snug tracking-[-0.02em]">
                "I'm building TikProfitPro to give TikTok Shop sellers the research I wished existed: honest data, real margins and suppliers you can actually order from."
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
                <span className="font-medium">Muhammad Arif Suriwala</span>
                <span className="mk-muted">Founder & AI engineer</span>
                <a href="https://www.linkedin.com/in/sodewala" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium hover:underline">LinkedIn <ArrowUpRight className="h-4 w-4" /></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── GUIDES ───── */}
      <section className="pb-20 md:pb-28">
        <div className="mk-container">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="mk-h2">Learn the playbook</h2>
            <a href="https://blog.tikprofitpro.shop/" className="hidden sm:inline-flex items-center gap-1 text-[15px] font-medium hover:underline">All guides <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <a key={g.href} href={g.href} className="group mk-soft flex min-h-[200px] flex-col justify-between rounded-[24px] p-6 transition-colors hover:bg-[#EDEDEF]">
                <span className="text-[13px] mk-muted">{g.tag}</span>
                <div>
                  <h3 className="text-[18px] font-medium leading-snug tracking-[-0.01em]">{g.title}</h3>
                  <ArrowUpRight className="mt-4 h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* ───── FINAL CTA ───── */}
      <section className="pb-16 md:pb-24">
        <div className="mk-container">
          <div className="rounded-[32px] bg-[#0B0B0C] px-6 py-16 md:px-16 md:py-24 text-white">
            <div className="grid items-end gap-10 md:grid-cols-[1.4fr,1fr]">
              <h2 className="text-[38px] md:text-[60px] font-semibold leading-[1.02] tracking-[-0.045em]">Your next winner is emerging right now</h2>
              <div>
                <p className="text-[17px] text-white/65">Start free and see this week's emerging products in minutes.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/pricing#free" className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#0B0B0C] hover:bg-white/90">Try it free</Link>
                  <Link to="/pricing" className="inline-flex h-12 items-center rounded-full bg-white/10 px-6 text-[15px] font-medium hover:bg-white/15">See pricing</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
};

export default Landing;
