import type { AuthError } from "@supabase/supabase-js";
import { isCheckoutPlan, type CheckoutPlan } from "@/lib/api";

export const MIN_PASSWORD_LENGTH = 8;

export const PLAN_LABELS: Record<CheckoutPlan, string> = { pro: "Pro", ultimate: "Ultimate" };

const PENDING_KEY = "pendingCheckoutPlan";

/** A plan the user picked: ?plan= or this tab's own Pricing click. Only pro/ultimate are accepted. */
export function readPendingPlan(searchParams: URLSearchParams): CheckoutPlan | null {
  const fromUrl = searchParams.get("plan");
  if (isCheckoutPlan(fromUrl)) return fromUrl;
  try {
    const stored = sessionStorage.getItem(PENDING_KEY);
    return isCheckoutPlan(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function savePendingPlan(plan: CheckoutPlan | null) {
  try {
    if (plan) sessionStorage.setItem(PENDING_KEY, plan);
    else sessionStorage.removeItem(PENDING_KEY);
  } catch { /* storage unavailable */ }
}

/** Where auth emails and OAuth send the user back to: always this origin + a fixed, existing route. */
export function loginReturnUrl(plan: CheckoutPlan | null): string {
  const path = plan ? `/login?plan=${encodeURIComponent(plan)}` : "/login";
  return `${window.location.origin}${path}`;
}

const isRateLimited = (e: AuthError) =>
  e.status === 429 || e.code === "over_request_rate_limit" || e.code === "over_email_send_rate_limit";

export const isEmailNotConfirmed = (e: AuthError) =>
  e.code === "email_not_confirmed" || /email not confirmed/i.test(e.message ?? "");

/** Login errors never say whether an account exists. */
export function loginErrorMessage(e: AuthError): string {
  if (isRateLimited(e)) return "Too many attempts, try again in a minute.";
  if (isEmailNotConfirmed(e)) return "Please confirm your email first. Check your inbox for the link, or send a new one below.";
  if ((e.status ?? 0) >= 500) return "Something went wrong, please try again.";
  return "Email or password is incorrect.";
}

/**
 * Signup errors. "Already registered" is deliberately treated as success by the caller,
 * so this only covers errors that say nothing about whether the address has an account.
 */
export function signupErrorMessage(e: AuthError): string {
  if (isRateLimited(e)) return "Too many attempts, try again in a minute.";
  if (e.code === "weak_password") return `Choose a stronger password: at least ${MIN_PASSWORD_LENGTH} characters, and avoid common or leaked passwords.`;
  if ((e.status ?? 0) >= 500) return "Something went wrong, please try again.";
  return "We couldn't create your account. Check your email address and try again.";
}

export const isAlreadyRegistered = (e: AuthError) =>
  e.code === "user_already_exists" || e.code === "email_exists" || /already (been )?registered/i.test(e.message ?? "");
