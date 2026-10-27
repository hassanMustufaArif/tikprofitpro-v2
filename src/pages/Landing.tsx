import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Factory, LineChart, Calculator, Users, ShieldCheck, Sparkles, PlayCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SectionWrapper from "@/components/landing/SectionWrapper";
import ProfitCalcEmbed from "@/components/landing/ProfitCalcEmbed";
import FAQSection from "@/components/landing/FAQSection";
import HeroProductMock from "@/components/landing/HeroProductMock";
import StageBadge from "@/components/landing/StageBadge";
import Sparkline from "@/components/landing/Sparkline";
import { useCheckout } from "@/hooks/useCheckout";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const SectionHead = ({ eyebrow, title, lead, center = false }: { eyebrow: string; title: string; lead?: string; center?: boolean }) => (
  <div className={`mb-10 md:mb-14 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
    <p className="mk-eyebrow mb-3">{eyebrow}</p>
    <h2 className="mk-h2">{title}</h2>
    {lead && <p className="mk-lead mt-4">{lead}</p>}
  </div>
);

const PLANS = [
  {
    name: "Free", price: "$0", period: "forever", cta: "Start free", to: "/pricing#free",
    features: ["Top 10 trending products", "Basic virality scores", "Dashboard overview", "Profit calculator"],
  },
  {
    name: "Pro", price: "$39", period: "per month", cta: "Start Pro", to: "/pricing", featured: true,
    features: ["All 700+ trending products", "Advanced virality scores", "50 sourcing credits a month", "Alibaba, AliExpress and Amazon matching", "Full product stats", "Weekly updated rankings"],
  },
  {
    name: "Ultimate", price: "$99", period: "per month", cta: "Start Ultimate", ultimate: true,
    features: ["Everything in Pro", "120 sourcing credits a month", "Priority support", "Early access to new features"],
  },
];

const GUIDES = [
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-product-research-tool/", title: "How to Research TikTok Shop Products", tag: "Research" },
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-for-beginners-usa-guide-a-practical-approach-to-success/", title: "TikTok Shop for Beginners: A Practical US Guide", tag: "Getting started" },
  { href: "https://blog.tikprofitpro.shop/best-products-to-sell-on-tiktok-shop/", title: "Best Products to Sell on TikTok Shop", tag: "Products" },
  { href: "https://blog.tikprofitpro.shop/tiktok-shop-vs-amazon-dropshipping-which-is-better-for-us-sellers-in-2026/", title: "TikTok Shop vs Amazon Dropshipping in 2026", tag: "Strategy" },
];

const Landing = () => {
  const { checkout, loading: checkoutLoading } = useCheckout();

  return (
    <div className="mk-page min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(0,230,118,0.10) 0%, rgba(10,11,13,0) 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(70% 60% at 50% 0%, #000 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, #000 30%, transparent 75%)" }} />

        <motion.div variants={stagger} initial="hidden" animate="show" className="mk-container relative text-center">
          <motion.div variants={fade}>
            <Link to="/tutorials" className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] mk-muted hover:text-white transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#00E676]" />
              Built for US TikTok Shop sellers
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.h1 variants={fade} className="mk-h1 mt-6 mx-auto max-w-4xl">
            <span className="sr-only">TikProfitPro: </span>
            Find TikTok Shop winners{" "}
            <span className="text-[#00E676]">while they're still emerging.</span>
          </motion.h1>

          <motion.p variants={fade} className="mk-lead mx-auto mt-6 max-w-2xl">
            See which products are gaining momentum, check the real margin after TikTok's fees, and match them to suppliers. All in one place, before the market gets crowded.
          </motion.p>

          <motion.div variants={fade} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/pricing#free" className="mk-btn-primary w-full sm:w-auto">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/calculator" className="mk-btn-secondary w-full sm:w-auto">
              <Calculator className="h-4 w-4" /> Try the profit calculator
            </Link>
          </motion.div>
          <motion.p variants={fade} className="mt-4 text-[13px] mk-muted">Free plan, no card required. Pro from $39 a month.</motion.p>

          <motion.div variants={fade} className="relative mx-auto mt-14 md:mt-20 max-w-5xl">
            <HeroProductMock />
          </motion.div>
        </motion.div>
      </section>

      {/* ───── FACT STRIP ───── */}
      <section className="border-y mk-divider">
        <div className="mk-container grid grid-cols-2 md:grid-cols-4">
          {[
            { k: "700+", v: "TikTok Shop products tracked" },
            { k: "Weekly", v: "Rankings refreshed" },
            { k: "6%", v: "Fee-accurate US profit math" },
            { k: "3", v: "Sourcing platforms matched" },
          ].map((s, i) => (
            <div key={s.v} className={`py-7 md:py-9 px-2 md:px-6 ${i > 0 ? "md:border-l mk-divider" : ""} ${i % 2 === 1 ? "border-l md:border-l mk-divider" : ""} ${i > 1 ? "border-t md:border-t-0 mk-divider" : ""}`}>
              <div className="mk-mono text-[26px] md:text-[32px] font-medium text-[#EDEEF0]">{s.k}</div>
              <div className="mt-1 text-[13px] mk-muted">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── FEATURES (BENTO) ───── */}
      <SectionWrapper id="features" className="py-20 md:py-32">
        <SectionHead eyebrow="The workflow" title="From viral video to your own product launch."
          lead="TikProfitPro follows the way sellers actually work: spot a product early, check the numbers, find who makes it, and line up creators to sell it." />

        <div className="grid gap-4 md:grid-cols-6">
          {/* Discover */}
          <div className="mk-card mk-card-hover p-6 md:p-8 md:col-span-4">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#EDEEF0]"><LineChart className="h-4 w-4 text-[#00E676]" /> Discover</div>
            <h3 className="mt-3 text-[22px] md:text-[26px] font-semibold tracking-tight">Know where every product is in its life cycle.</h3>
            <p className="mt-2 max-w-lg text-[15px] mk-muted">Products are scored on sales momentum and grouped into four stages, so you can move on the emerging ones and skip what's already saturated.</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {([
                ["emerging", [2, 3, 3, 5, 7, 10, 14], "#00E676", "Early, fast growth"],
                ["rising", [5, 7, 8, 10, 12, 13, 15], "#3B9EFF", "Proven, still climbing"],
                ["peaking", [8, 12, 15, 17, 18, 18, 17], "#FFB224", "Crowded, slowing"],
                ["saturated", [18, 17, 15, 13, 11, 10, 9], "#8A9099", "Declining, skip"],
              ] as const).map(([stage, pts, color, note]) => (
                <div key={stage} className="rounded-xl border p-3" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0D0F12" }}>
                  <StageBadge stage={stage} />
                  <div className="mt-3"><Sparkline points={[...pts]} color={color} width={120} height={36} /></div>
                  <p className="mt-2 text-[12px] mk-muted">{note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profit */}
          <div className="mk-card mk-card-hover p-6 md:p-8 md:col-span-2">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#EDEEF0]"><Calculator className="h-4 w-4 text-[#00E676]" /> Profit</div>
            <h3 className="mt-3 text-[22px] font-semibold tracking-tight">Real margins, not guesses.</h3>
            <p className="mt-2 text-[15px] mk-muted">TikTok's 6% referral fee, creator commission, shipping and ads, all included.</p>
            <div className="mt-6 space-y-2 mk-mono text-[13px]">
              {[["Sale price", "$24.99"], ["Product + shipping", "−$9.50"], ["TikTok fee (6%)", "−$1.50"], ["Creator (15%)", "−$3.75"]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="mk-muted font-sans">{k}</span><span>{v}</span></div>
              ))}
              <div className="flex justify-between border-t pt-2 mk-divider"><span className="font-sans font-medium text-[#EDEEF0]">Net profit</span><span className="text-[#5BF0A6]">$10.24 · 41%</span></div>
            </div>
          </div>

          {/* Source */}
          <div className="mk-card mk-card-hover p-6 md:p-8 md:col-span-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#EDEEF0]"><Factory className="h-4 w-4 text-[#00E676]" /> Source</div>
            <h3 className="mt-3 text-[22px] font-semibold tracking-tight">Match products to suppliers in one click.</h3>
            <p className="mt-2 text-[15px] mk-muted">Search Alibaba, AliExpress and Amazon for matching listings and compare unit cost, MOQ and shipping side by side.</p>
            <div className="mt-6 space-y-2">
              {[["Shenzhen factory listing", "$2.10", "MOQ 200", "High"], ["AliExpress store", "$3.45", "MOQ 1", "Medium"]].map(([n, c, m, conf]) => (
                <div key={n} className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-[13px]" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0D0F12" }}>
                  <span className="text-[#EDEEF0]">{n}</span>
                  <span className="flex items-center gap-3 mk-mono"><span>{c}</span><span className="mk-muted">{m}</span>
                    <span className="rounded px-1.5 py-0.5 font-sans text-[11px]" style={{ background: conf === "High" ? "rgba(0,230,118,0.1)" : "rgba(255,178,36,0.1)", color: conf === "High" ? "#5BF0A6" : "#FFC864" }}>{conf} match</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] mk-muted">Example results. Always order a sample before buying in bulk.</p>
          </div>

          {/* Creators */}
          <div className="mk-card mk-card-hover p-6 md:p-8 md:col-span-3">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#EDEEF0]"><Users className="h-4 w-4 text-[#00E676]" /> Creators</div>
            <h3 className="mt-3 text-[22px] font-semibold tracking-tight">See who's already selling it.</h3>
            <p className="mt-2 text-[15px] mk-muted">Browse UGC and AI-content creators by revenue, followers and engagement, plus the fastest-growing new shops in your niche.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["UGC creators", "AIGC creators", "Video GMV", "Live GMV", "New shops"].map((t) => (
                <span key={t} className="rounded-md border px-2.5 py-1 text-[12px] mk-muted" style={{ borderColor: "rgba(255,255,255,0.08)" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ───── HOW IT WORKS ───── */}
      <section id="how-it-works" className="border-t mk-divider py-20 md:py-32">
        <div className="mk-container">
          <SectionHead eyebrow="How it works" title="Four steps, about ten minutes." />
          <div className="grid gap-px overflow-hidden rounded-2xl border md:grid-cols-4" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.07)" }}>
            {[
              { n: "01", icon: LineChart, t: "Spot", d: "Filter for emerging products in your niche, sorted by momentum." },
              { n: "02", icon: Calculator, t: "Check", d: "Run the numbers with real TikTok fees and creator commission." },
              { n: "03", icon: Factory, t: "Source", d: "Find matching suppliers and compare cost, MOQ and shipping." },
              { n: "04", icon: Sparkles, t: "Launch", d: "Order a sample, list it, and get creators posting." },
            ].map((s) => (
              <div key={s.n} className="p-6 md:p-8" style={{ background: "#0A0B0D" }}>
                <div className="flex items-center justify-between">
                  <s.icon className="h-5 w-5 text-[#00E676]" />
                  <span className="mk-mono text-[12px] mk-muted">{s.n}</span>
                </div>
                <h3 className="mt-6 text-[18px] font-semibold">{s.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed mk-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── DEMO ───── */}
      <SectionWrapper className="pb-20 md:pb-32">
        <div className="grid items-center gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="mk-eyebrow mb-3">Product tour</p>
            <h2 className="mk-h2">See it in action.</h2>
            <p className="mk-lead mt-4">From spotting a trending product to finding a supplier, in under two minutes.</p>
            <Link to="/tutorials" className="mk-btn-secondary mt-8"><PlayCircle className="h-4 w-4" /> Watch tutorials</Link>
          </div>
          <div className="md:col-span-3 mk-card overflow-hidden">
            <video src="/screenshots/dashboard-demo.mp4" poster="/screenshots/dashboard-preview.png" className="block w-full" autoPlay loop muted playsInline preload="metadata">
              Your browser does not support embedded video.
            </video>
          </div>
        </div>
      </SectionWrapper>

      {/* ───── CALCULATOR ───── */}
      <section className="border-t mk-divider py-20 md:py-32">
        <div className="mk-container">
          <SectionHead eyebrow="Free tool" title="Know your profit before you commit."
            lead="Change any number and the results update instantly. No sign-up needed." />
          <div className="mk-card p-5 md:p-8">
            <ProfitCalcEmbed />
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <SectionWrapper id="pricing" className="pb-20 md:pb-32">
        <SectionHead center eyebrow="Pricing" title="Simple plans. Cancel anytime." lead="Start free. Upgrade when you're ready to source." />
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className="mk-card relative flex flex-col p-6 md:p-8"
              style={p.featured ? { borderColor: "rgba(0,230,118,0.35)", background: "linear-gradient(180deg, rgba(0,230,118,0.06) 0%, #111316 40%)" } : undefined}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-[#EDEEF0]">{p.name}</h3>
                {p.featured && <span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-[#5BF0A6]" style={{ background: "rgba(0,230,118,0.12)" }}>Most popular</span>}
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="text-[44px] font-semibold tracking-tight">{p.price}</span>
                <span className="text-[14px] mk-muted">{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#C9CDD3]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00E676]" /> {f}
                  </li>
                ))}
              </ul>
              {p.ultimate ? (
                <button onClick={() => checkout("ultimate")} disabled={checkoutLoading} className="mk-btn-secondary mt-8 w-full">
                  {checkoutLoading ? "Loading…" : p.cta}
                </button>
              ) : (
                <Link to={p.to!} className={`${p.featured ? "mk-btn-primary" : "mk-btn-secondary"} mt-8 w-full`}>{p.cta}</Link>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-[13px] mk-muted">
          <ShieldCheck className="h-4 w-4" /> No contracts. Cancel anytime. 7-day money-back guarantee.
        </p>
      </SectionWrapper>

      {/* ───── FOUNDER ───── */}
      <section id="about" className="border-t mk-divider py-20 md:py-28">
        <div className="mk-container">
          <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[auto,1fr]">
            <img src="/founder-arif.webp" alt="Muhammad Arif Suriwala, founder of TikProfitPro"
              className="h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover" style={{ objectPosition: "50% 15%" }} />
            <div>
              <p className="mk-eyebrow mb-3">Built by a founder, not a faceless team</p>
              <p className="text-[20px] md:text-[24px] leading-snug tracking-tight text-[#EDEEF0]">
                "I'm building TikProfitPro to give TikTok Shop sellers the research I wished existed: honest data, real margins and suppliers you can actually order from."
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px]">
                <span className="font-medium text-[#EDEEF0]">Muhammad Arif Suriwala</span>
                <span className="mk-muted">Founder & AI engineer · Karachi</span>
                <a href="https://www.linkedin.com/in/sodewala" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#5BF0A6] hover:underline">
                  LinkedIn <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── GUIDES ───── */}
      <SectionWrapper className="pb-20 md:pb-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mk-eyebrow mb-3">Guides</p>
            <h2 className="mk-h2">Learn the playbook.</h2>
          </div>
          <a href="https://blog.tikprofitpro.shop/" className="hidden sm:inline-flex items-center gap-1 text-[14px] mk-muted hover:text-white">All guides <ArrowRight className="h-4 w-4" /></a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <a key={g.href} href={g.href} className="mk-card mk-card-hover group flex flex-col justify-between p-5 min-h-[160px]">
              <span className="text-[12px] mk-muted">{g.tag}</span>
              <div>
                <h3 className="mt-6 text-[16px] font-medium leading-snug text-[#EDEEF0]">{g.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] text-[#5BF0A6]">Read <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
              </div>
            </a>
          ))}
        </div>
      </SectionWrapper>

      <FAQSection />

      {/* ───── FINAL CTA ───── */}
      <section className="pb-24 md:pb-32">
        <div className="mk-container">
          <div className="relative overflow-hidden rounded-3xl border px-6 py-16 md:py-20 text-center" style={{ borderColor: "rgba(255,255,255,0.08)", background: "radial-gradient(80% 100% at 50% 0%, rgba(0,230,118,0.12) 0%, #111316 60%)" }}>
            <h2 className="mk-h2 mx-auto max-w-2xl">Your next winner is emerging right now.</h2>
            <p className="mk-lead mx-auto mt-4 max-w-xl">Start free and see this week's emerging products in minutes.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/pricing#free" className="mk-btn-primary w-full sm:w-auto">Start free <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/pricing" className="mk-btn-secondary w-full sm:w-auto">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
