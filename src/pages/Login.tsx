import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";
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
      <AuthShell title="Almost there." subtitle="Finish checkout to start your plan.">
          <ContinueToCheckout plan={pendingPlan} email={session.user?.email} />
        </AuthShell>
    );
  }

  return (
    <AuthShell title="Welcome back." subtitle="Log in to your TikProfitPro account.">

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => handleSocialLogin("google")}
            disabled={!!socialLoading}
          >
            {socialLoading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {needsConfirm && (
            resendState === "sent" ? (
              <p className="text-sm text-muted-foreground">If that address needs confirming, a new link is on its way. Check your inbox and spam folder.</p>
            ) : (
              <Button type="button" variant="outline" className="w-full" disabled={resendState === "sending" || !email} onClick={handleResend}>
                {resendState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend confirmation email"}
              </Button>
            )
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </AuthShell>
  );
};

export default Login;
