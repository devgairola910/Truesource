"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession } from "@/lib/auth-client";
import { useFirebaseAuth } from "@/lib/hooks/use-firebase-auth";
import { updateProfile } from "firebase/auth";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useFirebaseAuth();
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
      const userCredential = await signup(email, password);
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: name });

      setSession({
        name: name,
        email: email,
        company: company,
        createdAt: new Date().toISOString(),
        sessionToken: fbUser.uid,
      });

      router.push("/welcome");
      router.refresh();
    } catch (error: any) {
      setStatus("error");
      setFeedback(error.message || "Could not create account.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Sign up form">
      <div className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
          Full Name
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-focus-ring w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-strong)] transition-all placeholder:text-[var(--text-soft)]"
            placeholder="Your full name"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
            Work Email
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
            Company
            <input
              type="text"
              required
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="input-focus-ring w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-strong)] transition-all placeholder:text-[var(--text-soft)]"
              placeholder="Company"
            />
          </label>
        </div>

        <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
          Password
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-focus-ring w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-strong)] transition-all placeholder:text-[var(--text-soft)]"
            placeholder="At least 8 characters"
          />
        </label>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-[var(--brand-ink)] shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {status === "loading" ? "Creating account..." : "Sign Up"}
        </button>
        {feedback ? <p className="text-sm font-medium text-[var(--danger)] text-center">{feedback}</p> : null}
      </div>

      <p className="text-center text-sm text-[var(--text-muted)] mt-4">
        Already have an account?
        <Link href="/login" className="ml-1 font-semibold text-[var(--brand)] hover:underline">
          Login instead
        </Link>
      </p>
    </form>
  );
}
