import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { MIN_PASSWORD_LENGTH } from "@/lib/authFlow";

/** Reads an auth error Supabase puts in the URL (e.g. an expired link): ?error_description= or #error_description=. */
function linkError(): string | null {
  const read = (s: string) => new URLSearchParams(s.replace(/^[#?]/, "")).get("error_description");
  return read(window.location.hash) ?? read(window.location.search);
}

/**
 * Landing page for the password-reset email. The Supabase client picks the recovery
 * session out of the URL (hash tokens or ?code=) and fires PASSWORD_RECOVERY; once a
 * session exists the user can set a new password with updateUser.
 */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (linkError()) { setStatus("invalid"); return; }
    let settled = false;
    const ready = () => { settled = true; setStatus((s) => (s === "done" ? s : "ready")); };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event !== "SIGNED_OUT")) ready();
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) ready(); });
    // The URL exchange is quick; if nothing shows up the link is expired or already used.
    const t = setTimeout(() => { if (!settled) setStatus("invalid"); }, 6000);
    return () => { clearTimeout(t); subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) { setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`); return; }
    if (password !== confirm) { setError("The passwords don't match."); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      setError(/same|different/i.test(error.message) ? "Choose a password you haven't used here before." : "Couldn't update your password. Request a new reset link and try again.");
      return;
    }
    setStatus("done");
    setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
  };

  return (
    <AuthShell title="Set a new password">

        {status === "checking" && (
          <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        )}

        {status === "invalid" && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm">
            <p>This reset link has expired or was already used.</p>
            <Link to="/forgot" className="inline-flex text-primary hover:underline">Send a new link</Link>
          </div>
        )}

        {status === "done" && (
          <div className="rounded-xl border border-border bg-card p-6 text-sm">Your password is updated. Taking you to your dashboard…</div>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input id="confirm" type="password" autoComplete="new-password" value={confirm}
                onChange={(e) => setConfirm(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        )}
      </AuthShell>
  );
};

export default ResetPassword;
