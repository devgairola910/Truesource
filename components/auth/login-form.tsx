"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLastVisitedPath, getSession, setSession } from "@/lib/auth-client";

type LoginPayload = {
  user?: {
    name: string;
    email: string;
    company: string;
  };
  message?: string;
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

      const payload = (await response.json()) as LoginPayload;

      if (!response.ok || !payload.user) {
        setStatus("error");
        setFeedback(payload.message ?? "Unable to log in with these credentials.");
        return;
      }

      setSession({
        ...payload.user,
        createdAt: new Date().toISOString(),
      });

      const lastVisited = getLastVisitedPath();
      const destination = requestedRedirect || lastVisited || "/dashboard";

      router.push(destination);
      router.refresh();
    } catch {
      setStatus("error");
      setFeedback("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Login form">
      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="name@company.com"
        />
      </label>

      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="Enter your password"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
        {feedback ? <p className="text-sm text-[var(--danger)]">{feedback}</p> : null}
      </div>

      <p className="text-sm text-[var(--text-muted)]">
        New here?
        <Link href="/signup" className="ml-1 font-semibold text-[var(--text-strong)] underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
