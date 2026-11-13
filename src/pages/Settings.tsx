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
    <div className="mx-auto max-w-[760px] space-y-4 md:space-y-5 animate-slide-up pb-20 md:pb-6">
      <div>
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.03em]">Settings</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.12)] space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5F6]"><User className="h-3.5 w-3.5 text-foreground" /></span>
          <h2 className="text-[15px] font-semibold">Account</h2>
        </div>
        <div className="text-sm text-muted-foreground">Email</div>
        <div className="text-sm font-medium break-all">{user?.email ?? "—"}</div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.12)] space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F5F5F6]"><Crown className="h-3.5 w-3.5 text-foreground" /></span>
          <h2 className="text-[15px] font-semibold">Plan</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          {planLoading ? (
            <span className="h-4 w-24 rounded bg-muted animate-pulse" aria-hidden />
          ) : plan === "free" ? (
            <>
              <span className="inline-flex items-center rounded-full bg-[#F2F4F7] px-2.5 py-0.5 text-[12px] font-medium text-[#475467]">Free Plan</span>
              <Link to="/pricing" className="inline-flex h-8 items-center rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background hover:opacity-90">Upgrade →</Link>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-[12px] font-medium text-[#067647]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />{plan === "pro" ? "Pro plan" : "Ultimate plan"}
            </span>
          )}
        </div>
        {!planLoading && isPaid && (
          <div className="space-y-1.5 pt-1">
            <a href={portalUrl(creditsResp)} target="_blank" rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-white px-4 text-[13px] font-medium text-foreground hover:bg-[#FAFAFA]">
              <CreditCard className="h-4 w-4" /> Manage subscription
            </a>
            <p className="text-xs text-muted-foreground">
              Update your card, download invoices or cancel on Lemon Squeezy. Sign in there with {user?.email ? <span className="break-all">{user.email}</span> : "your account email"}.
              Need help? Email <a href="mailto:support@tikprofitpro.shop" className="underline">support@tikprofitpro.shop</a>.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#FECDCA] bg-[#FFFBFA] p-5 md:p-6 space-y-3">
        <h2 className="text-[15px] font-semibold text-[#B42318]">Account Actions</h2>
        <Button variant="destructive" size="sm" onClick={signOut} className="gap-1.5 w-full sm:w-auto min-h-[40px] rounded-full px-5">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
