import { SignupForm } from "@/components/auth/signup-form";
import { SectionCard } from "@/components/ui/section-card";

export default function SignupPage() {
  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Sign Up
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Create your account and launch your integrity workspace.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
          Set up your account in under a minute. Once complete, we guide you through onboarding,
          profile setup, and your initial dashboard configuration.
        </p>
      </section>

      <SectionCard
        className="reveal-up"
        title="Create Account"
        description="Provide your details to get started"
      >
        <SignupForm />
      </SectionCard>
    </>
  );
}
