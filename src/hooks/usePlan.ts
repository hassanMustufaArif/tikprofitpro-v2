import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type Plan = "free" | "pro" | "ultimate";

/**
 * Single source of truth for the user's plan in the UI.
 * Reads users.plan from Supabase. Every page uses this hook so the
 * dashboard, sidebar, products and settings never disagree.
 * NOTE: this is display only. Real access control must be enforced server-side.
 */
export function usePlan() {
  const { user, loading: authLoading } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["user-plan", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await supabase
        .from("users")
        .select("plan")
        .eq("user_email", user.email)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.email,
  });
  const raw = (data?.plan ?? "free").toString().toLowerCase();
  const plan: Plan = raw === "pro" || raw === "ultimate" ? (raw as Plan) : "free";
  const label = plan === "free" ? "Free" : plan === "pro" ? "Pro" : "Ultimate";
  // Loading until the session is known and, when signed in, the plan has arrived, so callers
  // can show a skeleton instead of flashing the Free plan before Pro.
  const isLoading = authLoading || (!!user?.email && isPending);
  return { plan, label, isFree: plan === "free", isPaid: plan !== "free", isLoading };
}
