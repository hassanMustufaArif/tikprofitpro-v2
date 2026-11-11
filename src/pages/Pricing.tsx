import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Minus, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { api, isCheckoutPlan } from "@/lib/api";
import { savePendingPlan } from "@/lib/authFlow";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Pricing = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash === "#free") {
      const el = document.getElementById("free");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const handleCheckout = async (plan: string) => {
    // If not logged in, save plan and redirect to signup
    if (!session) {
      if (!isCheckoutPlan(plan)) return;
      savePendingPlan(plan);
      navigate(`/signup?plan=${encodeURIComponent(plan)}`);
      return;
    }

    setLoadingPlan(plan);
    try {
      await api.createCheckout(plan);
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err?.message || "Please try again later.", variant: "destructive" });
    } finally {
      setLoadingPlan(null);
    }
  };

  const freeCta = session ? "/dashboard" : "/signup";

  const card = "flex flex-col rounded-2xl border p-6 md:p-8";
  const Item = ({ children, off = false }: { children: React.ReactNode; off?: boolean }) => (
    <li className={`flex items-start gap-2.5 text-[14.5px] ${off ? "text-[#6B787D]" : "text-[#2B3A40]"}`}>
      {off ? <Minus className="mt-0.5 h-4 w-4 shrink-0 text-[#7A878C]" aria-label="Not included" /> : <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#214F5E]" aria-label="Included" />}
      <span>{children}</span>
    </li>
  );

  return (
    <div className="mk-page min-h-screen overflow-x-hidden">
      <Navbar variant="light" />

      <section className="px-2 pt-2 md:px-4 md:pt-4">
        <div className="mk-scene pb-16 md:pb-24">
          <img src="/images/open-sky.webp" alt="" aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] w-full object-cover"
            style={{ objectPosition: "50% 35%", maskImage: "linear-gradient(#000 55%, transparent 100%)", WebkitMaskImage: "linear-gradient(#000 55%, transparent 100%)" }} />
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-[1000px] px-5 pt-28 text-center md:pt-36">
            <p className="mk-eyebrow">Pricing</p>
            <h1 className="mk-h1 mt-4 !text-[44px] sm:!text-[56px] lg:!text-[68px]">Simple, honest pricing.<br /><span className="mk-soft-line">One product win pays for months.</span></h1>
            <p className="mk-lead mx-auto mt-5 max-w-[520px] !text-[#33454C]">Start free with the top 10 products and 5 sourcing credits. Upgrade when you're ready to source.</p>
          </motion.div>

          <div className="relative mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 px-4 md:mt-16 md:grid-cols-3 md:gap-5 md:px-6">
            {/* Free */}
            <motion.div id="free" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className={`${card} border-[#E6E1D7] bg-white`}>
              <p className="text-[15px] font-medium text-[#1A2A31]">Free</p>
              <div className="mt-4 flex items-baseline gap-1.5"><span className="font-display text-[56px] leading-none mk-num text-[#1A2A31]">$0</span><span className="text-[14px] mk-muted">forever</span></div>
              <ul className="mt-6 flex-1 space-y-3 border-t mk-divider pt-6">
                {["Top 10 trending products", "Virality scores", "5 sourcing credits a month", "Supplier search", "Dashboard overview", "Profit calculator"].map((f) => <Item key={f}>{f}</Item>)}
                {["Full product list", "Product search"].map((f) => <Item key={f} off>{f}</Item>)}
              </ul>
              <Link to={freeCta} className="mk-btn-secondary mt-8 w-full">Start for free</Link>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={`${card} border-[#214F5E] bg-white shadow-[0_0_0_1px_#214F5E,0_24px_60px_-24px_rgba(33,79,94,0.4)]`}>
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium text-[#1A2A31]">Pro</p>
                <span className="rounded-full bg-[#E7EFF2] px-2.5 py-1 text-[12px] font-medium text-[#173F4C]">Most popular</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1.5"><span className="font-display text-[56px] leading-none mk-num text-[#1A2A31]">$39</span><span className="text-[14px] mk-muted">per month</span></div>
              <ul className="mt-6 flex-1 space-y-3 border-t mk-divider pt-6">
                {["Full list of trending products", "50 sourcing credits/month", "Alibaba + AliExpress (Amazon in beta)", "Product search", "Profit calculator", "Rankings refreshed regularly"].map((f) => <Item key={f}>{f}</Item>)}
              </ul>
              <button onClick={() => handleCheckout("pro")} disabled={loadingPlan === "pro"} className="mk-btn-primary mt-8 w-full disabled:opacity-60">
                {loadingPlan === "pro" ? "Loading..." : <>Start for $39/mo <ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.div>

            {/* Ultimate */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className={`${card} border-[#E6E1D7] bg-white`}>
              <p className="text-[15px] font-medium text-[#1A2A31]">Ultimate</p>
              <div className="mt-4 flex items-baseline gap-1.5"><span className="font-display text-[56px] leading-none mk-num text-[#1A2A31]">$99</span><span className="text-[14px] mk-muted">per month</span></div>
              <ul className="mt-6 flex-1 space-y-3 border-t mk-divider pt-6">
                {["Full list of trending products", "120 sourcing credits/month", "All Pro features included", "Priority support", "Early access to new features"].map((f) => <Item key={f}>{f}</Item>)}
              </ul>
              <button onClick={() => handleCheckout("ultimate")} disabled={loadingPlan === "ultimate"} className="mk-btn-secondary mt-8 w-full disabled:opacity-60">
                {loadingPlan === "ultimate" ? "Loading..." : <>Start for $99/mo <ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.div>
          </div>

          <p className="relative mt-8 text-center text-[13px] mk-muted">No contracts · Cancel anytime · 7-day money back guarantee</p>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
};

export default Pricing;
