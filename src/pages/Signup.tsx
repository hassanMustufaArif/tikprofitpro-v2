import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell, { AuthDivider, AuthNote, GoogleIcon, authInput, authLabel, authLink, authPrimary, authSecondary } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";
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
      <AuthShell title="You're almost there" subtitle="Your account is ready.">
        <ContinueToCheckout plan={pendingPlan} email={session.user?.email} />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={success ? "Check your email" : "Create your account"}
      subtitle={success ? undefined : "Start free. No card required."}
      footer={!success ? <>Already have an account?{" "}<Link to="/login" className={authLink}>Log in</Link></> : undefined}
    >
      {success ? (
        <AuthNote>
          <p className="font-medium text-[#0B0B0C]">Check your email to confirm your account</p>
          <p className="text-[#6B6F76]">If you already have an account, log in instead.</p>
          <Link to="/login" className={authLink}>Back to log in</Link>
        </AuthNote>
      ) : (
        <>
          <button type="button" className={authSecondary} onClick={() => handleSocialLogin("google")} disabled={!!socialLoading}>
            {socialLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <AuthDivider />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className={authLabel}>Full name</Label>
              <Input id="name" placeholder="John Doe" value={fullName}
                onChange={(e) => setFullName(e.target.value)} required className={authInput} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className={authLabel}>Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required className={authInput} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className={authLabel}>Password</Label>
              <Input id="password" type="password" placeholder={`Min ${MIN_PASSWORD_LENGTH} characters`} minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required className={authInput} />
            </div>

            {error && <p className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-2.5 text-[13px] text-[#B42318]">{error}</p>}

            <button type="submit" disabled={loading} className={`${authPrimary} mt-2`}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
            </button>
            <p className="text-center text-[12px] text-[#9A9EA5]">
              By signing up you agree to the <Link to="/terms" className="underline underline-offset-2 hover:text-[#0B0B0C]">Terms</Link>.
            </p>
          </form>
        </>
      )}
    </AuthShell>
  );
};

export default Signup;
