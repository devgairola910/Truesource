"use client";

import { useState } from "react";
import { updatePassword, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/section-card";

export function SetPasswordForm() {
  const { user } = useFirebaseAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      // For a Google user to have a password login option, 
      // we usually link an email/password credential if they don't have one,
      // or just updatePassword if they already have the password provider.
      // Since they just signed up with Google, we'll try updatePassword first.
      // If it's a fresh account, Firebase allows setting a password.
      await updatePassword(user, password);
      setStatus("success");
      setMessage("Password set successfully! You can now use this password to log in with your email.");
    } catch (error: any) {
      console.error("Error setting password:", error);
      if (error.code === "auth/requires-recent-login") {
        setStatus("error");
        setMessage("Please sign in again to set your password (security requirement).");
      } else {
        setStatus("error");
        setMessage(error.message || "Failed to set password.");
      }
    }
  };

  if (status === "success") {
    return (
      <SectionCard title="Password Set" description="Security updated">
        <p className="text-sm text-[var(--text-muted)] mb-4">{message}</p>
        <div className="flex items-center gap-2 text-[var(--success)] text-sm font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Account secured
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Set Account Password" description="Create a password for your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="password">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="Min. 6 characters"
            required
            disabled={status === "loading"}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-muted)]" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-2.5 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)] transition-all"
            placeholder="Confirm your password"
            required
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <p className="text-xs text-[var(--danger)] bg-[var(--danger-surface)] p-3 rounded-lg border border-[var(--danger)]/20">
            {message}
          </p>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={status === "loading" || !password || !confirmPassword}
        >
          {status === "loading" ? "Updating..." : "Set Password"}
        </Button>
      </form>
    </SectionCard>
  );
}
