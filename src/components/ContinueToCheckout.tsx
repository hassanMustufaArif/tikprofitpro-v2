import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {email ? <>You're signed in as <span className="font-medium text-foreground break-all">{email}</span>.</> : "You're signed in."}
      </p>
      <Button
        className="w-full"
        disabled={loading}
        onClick={() => { savePendingPlan(null); checkout(plan); }}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `Continue to checkout for ${label}`}
      </Button>
      <Link to="/dashboard" onClick={() => savePendingPlan(null)} className="block text-sm text-primary hover:underline">
        Go to dashboard instead
      </Link>
    </div>
  );
};

export default ContinueToCheckout;
