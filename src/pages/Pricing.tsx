import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { api, isCheckoutPlan } from "@/lib/api";
import { savePendingPlan } from "@/lib/authFlow";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Minus, Star, ShieldCheck, CalendarX, CreditCard } from "lucide-react";

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

  const check = <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0B0B0C]" strokeWidth={2.25} />;

  return (
    <div className="mk-page min-h-screen overflow-x-hidden">
      <Navbar variant="light" />

      <section className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="mk-container">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <div className="mk-pill">Pricing</div>
            <h1 className="mk-h2 mt-6">Simple, transparent pricing</h1>
            <p className="mk-lead mt-5">One product win pays for months of TikProfitPro.</p>
          </motion.div>

          <div className="mt-14 md:mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 items-stretch">
            {/* Free */}
            <motion.div id="free" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="mk-card flex flex-col p-7 md:p-8 scroll-mt-28">
              <p className="text-[15px] font-medium text-[#0B0B0C]">Free</p>
              <p className="mt-1 text-[14px] mk-muted">For trying the research tools.</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[48px] font-semibold leading-none tracking-[-0.045em] mk-num">$0</span>
                <span className="text-[14px] mk-muted">forever</span>
              </div>
              <Link to={freeCta} className="mk-btn-secondary mt-7 w-full">Start for Free</Link>
              <ul className="mt-8 space-y-3 border-t mk-divider pt-6 text-[14px] text-[#2A2C30]">
                {["Top 10 trending products", "Virality scores", "5 sourcing credits a month", "Supplier search", "Dashboard overview", "Profit calculator"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">{check}{f}</li>
                ))}
                {["Full product list", "Product search"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[#9A9EA5]"><Minus className="mt-0.5 h-4 w-4 shrink-0" /> <span className="line-through decoration-[#D4D4D8]">{f}</span></li>
                ))}
              </ul>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="relative flex flex-col rounded-2xl border border-[#0B0B0C] ring-1 ring-[#0B0B0C] bg-white p-7 md:p-8 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_32px_64px_-32px_rgba(16,24,40,0.28)]">
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-medium text-[#0B0B0C]">Pro</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0C] px-3 py-1 text-[12px] font-medium text-white">
                  <Star className="h-3 w-3 fill-white" /> Most Popular
                </span>
              </div>
              <p className="mt-1 text-[14px] mk-muted">For sellers launching products every month.</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[48px] font-semibold leading-none tracking-[-0.045em] mk-num">$39</span>
                <span className="text-[14px] mk-muted">per month</span>
              </div>
              <button onClick={() => handleCheckout("pro")} disabled={loadingPlan === "pro"}
                className="mk-btn-primary mt-7 w-full disabled:opacity-50">
                {loadingPlan === "pro" ? "Loading..." : "Start for $39/mo →"}
              </button>
              <ul className="mt-8 space-y-3 border-t mk-divider pt-6 text-[14px] text-[#2A2C30]">
                {["Full list of trending products", "50 sourcing credits/month", "Alibaba + AliExpress (Amazon in beta)", "Product search", "Profit calculator", "Rankings refreshed regularly"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">{check}{f}</li>
                ))}
              </ul>
            </motion.div>

            {/* Ultimate */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mk-card flex flex-col p-7 md:p-8">
              <p className="text-[15px] font-medium text-[#0B0B0C]">Ultimate</p>
              <p className="mt-1 text-[14px] mk-muted">For teams sourcing at volume.</p>
              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[48px] font-semibold leading-none tracking-[-0.045em] mk-num">$99</span>
                <span className="text-[14px] mk-muted">per month</span>
              </div>
              <button onClick={() => handleCheckout("ultimate")} disabled={loadingPlan === "ultimate"}
                className="mk-btn-secondary mt-7 w-full disabled:opacity-50">
                {loadingPlan === "ultimate" ? "Loading..." : "Start for $99/mo →"}
              </button>
              <ul className="mt-8 space-y-3 border-t mk-divider pt-6 text-[14px] text-[#2A2C30]">
                {["Full list of trending products", "120 sourcing credits/month", "All Pro features included", "Priority support", "Early access to new features"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">{check}{f}</li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border mk-divider bg-[#ECECEE] sm:grid-cols-3">
            {[
              [ShieldCheck, "7-day money back guarantee", "Full refund within 7 days of your first payment."],
              [CalendarX, "Cancel anytime", "No contracts. Keep access to the end of your billing period."],
              [CreditCard, "Secure checkout", "Payments handled by Lemon Squeezy."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div key={t as string} className="bg-white p-6">
                  <I className="h-5 w-5 text-[#0B0B0C]" strokeWidth={1.75} />
                  <div className="mt-3 text-[15px] font-medium text-[#0B0B0C]">{t as string}</div>
                  <div className="mt-1 text-[14px] mk-muted">{d as string}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-[13px] mk-muted">No contracts · Cancel anytime · 7-day money back guarantee</p>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
};

export default Pricing;
