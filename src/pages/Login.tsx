import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell, { AuthDivider, AuthNote, GoogleIcon, authInput, authLabel, authLink, authPrimary, authSecondary } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";
import ContinueToCheckout from "@/components/ContinueToCheckout";
import { isEmailNotConfirmed, loginErrorMessage, loginReturnUrl, readPendingPlan } from "@/lib/authFlow";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();

  // Only pro/ultimate are accepted; anything else is ignored.
  const pendingPlan = readPendingPlan(searchParams);

  useEffect(() => {
    if (!session) return;
    // With a pending plan we wait for an explicit "Continue to checkout" click instead of redirecting.
    if (!pendingPlan) navigate("/dashboard", { replace: true });
  }, [session, pendingPlan, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsConfirm(false);
    setResendState("idle");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setNeedsConfirm(isEmailNotConfirmed(error));
      setError(loginErrorMessage(error));
      setLoading(false);
    }
    // Successful login triggers session effect above
  };

  const handleResend = async () => {
    if (!email) return;
    setResendState("sending");
    await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: loginReturnUrl(pendingPlan) },
    });
    // Same message whatever happened, so this can't be used to probe for accounts.
    setResendState("sent");
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setSocialLoading(provider);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: pendingPlan ? loginReturnUrl(pendingPlan) : `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError("Couldn't start sign-in. Please try again.");
      setSocialLoading(null);
    }
  };

  if (session && pendingPlan) {
    return (
      <AuthShell title="You're almost there" subtitle="Pick up where you left off.">
        <ContinueToCheckout plan={pendingPlan} email={session.user?.email} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your TikProfitPro account."
      footer={<>Don't have an account?{" "}<Link to="/signup" className={authLink}>Sign up</Link></>}
    >
      <button type="button" className={authSecondary} onClick={() => handleSocialLogin("google")} disabled={!!socialLoading}>
        {socialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className={authLabel}>Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required className={authInput} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className={authLabel}>Password</Label>
            <Link to="/forgot" className="text-[13px] text-[#6B6F76] hover:text-[#0B0B0C]">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" value={password}
            onChange={(e) => setPassword(e.target.value)} required className={authInput} />
        </div>

        {error && <p className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-2.5 text-[13px] text-[#B42318]">{error}</p>}
        {needsConfirm && (
          resendState === "sent" ? (
            <p className="text-[13px] text-[#6B6F76]">If that address needs confirming, a new link is on its way. Check your inbox and spam folder.</p>
          ) : (
            <button type="button" className={authSecondary} disabled={resendState === "sending" || !email} onClick={handleResend}>
              {resendState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend confirmation email"}
            </button>
          )
        )}

        <button type="submit" disabled={loading} className={`${authPrimary} mt-2`}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
};

export default Login;
