import { Settings as SettingsIcon, LogOut, Crown, CreditCard, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { safeUrl } from "@/lib/safeUrl";
import { usePlan } from "@/hooks/usePlan";

// Lemon Squeezy's buyer portal: lists the customer's orders and subscriptions and lets them cancel.
const LS_MY_ORDERS = "https://app.lemonsqueezy.com/my-orders";

/** The store's customer-portal link when the API sends one; otherwise Lemon Squeezy's My Orders page. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped API response
function portalUrl(resp: any): string {
  const c = resp?.credits ?? {};
  const raw = resp?.customer_portal_url ?? resp?.portal_url ?? c?.customer_portal_url ?? c?.portal_url ?? resp?.urls?.customer_portal;
  const u = safeUrl(raw);
  try { if (u && new URL(u).protocol === "https:" && /(^|\.)lemonsqueezy\.com$/.test(new URL(u).hostname)) return u; } catch { /* fall through */ }
  return LS_MY_ORDERS;
}

const SettingsPage = () => {
  const { user, signOut } = useAuth();

  const { plan, isLoading: planLoading } = usePlan();
  const isPaid = plan === "pro" || plan === "ultimate";
  const { data: creditsResp } = useQuery({ queryKey: ["credits"], queryFn: () => api.getCredits(), enabled: !!user, retry: false });

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-up pb-20 md:pb-6">
      <div>
        <h1 className="app-h1">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </div>

      <div className="app-panel p-4 md:p-6 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-display text-[22px] leading-tight">Account</h2>
        </div>
        <div className="text-sm text-muted-foreground">Email</div>
        <div className="text-sm font-medium break-all">{user?.email ?? "—"}</div>
      </div>

      <div className="app-panel p-4 md:p-6 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="h-5 w-5 text-primary" />
          <h2 className="font-display text-[22px] leading-tight">Plan</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {planLoading ? (
            <span className="h-4 w-24 rounded bg-muted animate-pulse" aria-hidden />
          ) : plan === "free" ? (
            <>
              <span className="text-sm font-medium">Free Plan</span>
              <Link to="/pricing" className="text-xs text-primary hover:underline font-medium">Upgrade →</Link>
            </>
          ) : (
            <span className="text-sm font-medium">
              {plan === "pro" ? "Pro plan" : "Ultimate plan"}
            </span>
          )}
        </div>
        {!planLoading && isPaid && (
          <div className="space-y-1.5 pt-1">
            <a href={portalUrl(creditsResp)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <CreditCard className="h-4 w-4" /> Manage subscription
            </a>
            <p className="text-xs text-muted-foreground">
              Update your card, download invoices or cancel on Lemon Squeezy. Sign in there with {user?.email ? <span className="break-all">{user.email}</span> : "your account email"}.
              Need help? Email <a href="mailto:support@tikprofitpro.shop" className="underline">support@tikprofitpro.shop</a>.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 md:p-6 space-y-3">
        <h2 className="font-semibold text-base md:text-lg text-destructive">Account Actions</h2>
        <Button variant="destructive" size="sm" onClick={signOut} className="gap-1.5 w-full sm:w-auto min-h-[44px]">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
