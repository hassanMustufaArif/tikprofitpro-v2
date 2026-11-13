import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell, { AuthNote, authInput, authLabel, authLink, authPrimary } from "@/components/auth/AuthShell";
import { Loader2 } from "lucide-react";
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
    <AuthShell title="Set a new password" subtitle={status === "ready" ? `Use at least ${MIN_PASSWORD_LENGTH} characters.` : undefined}>
      {status === "checking" && (
        <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-[#9A9EA5]" /></div>
      )}

      {status === "invalid" && (
        <AuthNote>
          <p>This reset link has expired or was already used.</p>
          <Link to="/forgot" className={authLink}>Send a new link</Link>
        </AuthNote>
      )}

      {status === "done" && (
        <AuthNote>Your password is updated. Taking you to your dashboard…</AuthNote>
      )}

      {status === "ready" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className={authLabel}>New password</Label>
            <Input id="password" type="password" autoComplete="new-password" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} className={authInput} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm" className={authLabel}>Confirm new password</Label>
            <Input id="confirm" type="password" autoComplete="new-password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required minLength={MIN_PASSWORD_LENGTH} className={authInput} />
          </div>
          {error && <p className="rounded-xl border border-[#FECDCA] bg-[#FEF3F2] px-3.5 py-2.5 text-[13px] text-[#B42318]">{error}</p>}
          <button type="submit" disabled={saving} className={`${authPrimary} mt-2`}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
