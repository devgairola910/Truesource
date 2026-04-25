"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLastVisitedPath, getSession, setSession } from "@/lib/auth-client";

type LoginResponse = {
  message?: string;
  sessionToken?: string;
  user?: {
    name: string;
    email: string;
    company: string;
  };
};

type LoginFormProps = {
  requestedRedirect: string | null;
};

export function LoginForm({ requestedRedirect }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (getSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as LoginResponse;

      if (!response.ok || !payload.user || !payload.sessionToken) {
        setStatus("error");
        setFeedback(payload.message ?? "Unable to log in with these credentials.");
        return;
      }

      setSession({
        name: payload.user.name,
        email: payload.user.email,
        company: payload.user.company,
        createdAt: new Date().toISOString(),
        sessionToken: payload.sessionToken,
      });

      const destination = requestedRedirect || getLastVisitedPath() || "/dashboard";
      router.push(destination);
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Login form">
      <div className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
          Email Address
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input-focus-ring w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-strong)] transition-all placeholder:text-[var(--text-soft)]"
            placeholder="name@company.com"
          />
        </label>

        <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-focus-ring w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-strong)] transition-all placeholder:text-[var(--text-soft)]"
            placeholder="Enter your password"
          />
        </label>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--brand-ink)] shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === "loading" ? "Logging in..." : "Sign In"}
        </button>
        {feedback ? <p className="text-sm font-medium text-[var(--danger)] text-center">{feedback}</p> : null}
      </div>

      <div className="text-center space-y-2 mt-4">
        <Link href="/forgot-password" className="text-sm text-[var(--text-muted)] hover:text-[var(--brand)] transition">
          Forgot your password?
        </Link>
        <p className="text-sm text-[var(--text-muted)]">
          New here?
          <Link href="/signup" className="ml-1 font-semibold text-[var(--brand)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
