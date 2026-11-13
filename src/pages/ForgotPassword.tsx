import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell, { AuthNote, authInput, authLabel, authLink, authPrimary } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";
import { RESET_REDIRECT_URL } from "@/lib/authFlow";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setState("sending");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: RESET_REDIRECT_URL });
    // Rate limits are the only error worth showing; otherwise the same message either way,
    // so this form can't be used to find out which emails have accounts.
    if (error && error.status === 429) {
      setError("Too many requests. Wait a minute and try again.");
      setState("idle");
      return;
    }
    setState("sent");
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new password."
      footer={<Link to="/login" className={authLink}>Back to log in</Link>}
    >
      {state === "sent" ? (
        <AuthNote>
          <p>If an account exists for <span className="font-medium break-all text-[#0B0B0C]">{email}</span>, a reset link is on its way. Check your inbox and spam folder.</p>
          <p className="text-[#6B6F76]">Signed up with Google? Use "Continue with Google" on the login page instead.</p>
        </AuthNote>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className={authLabel}>Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={authInput} />
          </div>
          {error && <p className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-2.5 text-[13px] text-[#B42318]">{error}</p>}
          <button type="submit" disabled={state === "sending" || !email} className={`${authPrimary} mt-2`}>
            {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
