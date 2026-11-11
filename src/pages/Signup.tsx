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
import {
  MIN_PASSWORD_LENGTH, isAlreadyRegistered, loginReturnUrl, readPendingPlan, savePendingPlan, signupErrorMessage,
} from "@/lib/authFlow";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
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

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setLoading(true);
    if (pendingPlan) savePendingPlan(pendingPlan);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        // Fixed, existing route on this origin; carries the chosen plan so the confirm link lands on "Continue to checkout".
        emailRedirectTo: loginReturnUrl(pendingPlan),
      },
    });

    setLoading(false);

    // Same "check your email" screen whether or not the address already has an account.
    if (error && !isAlreadyRegistered(error)) {
      setError(signupErrorMessage(error));
    } else {
      setSuccess(true);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setSocialLoading(provider);
    setError("");
    if (pendingPlan) savePendingPlan(pendingPlan);
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
    <AuthShell title="Create your account." subtitle="Free plan, no card required.">

        {success ? (
          <div className="rounded-xl border border-primary/30 bg-primary/10 p-6 text-center space-y-2">
            <p className="text-sm font-medium">Check your email to confirm your account</p>
            <p className="text-xs text-muted-foreground">If you already have an account, log in instead.</p>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Log In
            </Link>
          </div>
        ) : (
          <>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`}
                  minLength={MIN_PASSWORD_LENGTH}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </>
        )}

        {!success && (
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log In
            </Link>
          </p>
        )}
      </AuthShell>
  );
};

export default Signup;
