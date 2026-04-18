"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLastVisitedPath, getSession, setSession } from "@/lib/auth-client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      let name = userCredential.user.displayName || "";
      let company = "";

      setSession({
        name,
        email: userCredential.user.email || email,
        company,
        createdAt: new Date().toISOString(),
      });

      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setStatus("error");
      setFeedback(e.message ?? "Unable to log in with these credentials.");
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

      <p className="text-center text-sm text-[var(--text-muted)] mt-4">
        New here?
        <Link href="/signup" className="ml-1 font-semibold text-[var(--brand)] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
