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
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
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
  return { plan, label, isFree: plan === "free", isPaid: plan !== "free", isLoading };
}
