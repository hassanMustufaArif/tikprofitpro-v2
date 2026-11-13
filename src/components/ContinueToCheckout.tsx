import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCheckout } from "@/hooks/useCheckout";
import { PLAN_LABELS, savePendingPlan } from "@/lib/authFlow";
import type { CheckoutPlan } from "@/lib/api";

/**
 * Shown to a signed-in user who arrives with a pending plan (?plan= or a Pricing click).
 * Checkout only starts on an explicit click, so a crafted link can't push anyone into it.
 */
const ContinueToCheckout = ({ plan, email }: { plan: CheckoutPlan; email?: string | null }) => {
  const { checkout, loading } = useCheckout();
  const label = PLAN_LABELS[plan];

  return (
    <div className="space-y-4 rounded-2xl border border-[#E9E9EC] bg-white p-6 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_48px_-24px_rgba(16,24,40,0.12)]">
      <p className="text-[14px] text-[#6B6F76]">
        {email ? <>You're signed in as <span className="font-medium text-[#0B0B0C] break-all">{email}</span>.</> : "You're signed in."}
      </p>
      <button
        className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-full bg-[#0B0B0C] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#2A2C30] disabled:opacity-50"
        disabled={loading}
        onClick={() => { savePendingPlan(null); checkout(plan); }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Continue to checkout for ${label}`}
      </button>
      <Link to="/dashboard" onClick={() => savePendingPlan(null)} className="block text-[14px] font-medium text-[#0B0B0C] underline-offset-4 hover:underline">
        Go to dashboard instead
      </Link>
    </div>
  );
};

export default ContinueToCheckout;
