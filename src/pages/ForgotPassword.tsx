import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";
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
    <AuthShell title="Reset your password" subtitle="We'll email you a link to set a new password.">

        {state === "sent" ? (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm">
            <p>If an account exists for <span className="font-medium break-all">{email}</span>, a reset link is on its way. Check your inbox and spam folder.</p>
            <p className="text-muted-foreground">Signed up with Google? Use "Continue with Google" on the login page instead.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={state === "sending" || !email} className="w-full">
              {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">Back to log in</Link>
        </p>
      </AuthShell>
  );
};

export default ForgotPassword;
