"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession } from "@/lib/auth-client";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, { displayName: name });

      setSession({
        name,
        email,
        company,
        createdAt: new Date().toISOString(),
      });

      router.push("/welcome");
      router.refresh();
    } catch (e: any) {
      setStatus("error");
      setFeedback(e.message ?? "Could not create account.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Sign up form">
      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Full Name
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="Your full name"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm text-[var(--text-muted)]">
          Work Email
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
          Company
          <input
            type="text"
            required
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
            placeholder="Company"
          />
        </label>
      </div>

      <label className="space-y-1 text-sm text-[var(--text-muted)]">
        Password
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-[var(--brand)]"
          placeholder="At least 8 characters"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Creating account..." : "Sign Up"}
        </button>
        {feedback ? <p className="text-sm text-[var(--danger)]">{feedback}</p> : null}
      </div>

      <p className="text-sm text-[var(--text-muted)]">
        Already have an account?
        <Link href="/login" className="ml-1 font-semibold text-[var(--text-strong)] underline">
          Login instead
        </Link>
      </p>
    </form>
  );
}
