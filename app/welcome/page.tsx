import Link from "next/link";
import { ProtectedPage } from "@/components/auth/protected-page";
import { SectionCard } from "@/components/ui/section-card";
import { SetPasswordForm } from "@/components/auth/set-password-form";

const nextSteps = [
  {
    title: "Start Onboarding",
    description:
      "Complete core workspace setup, monitored source preferences, and initial detection settings.",
    href: "/onboarding",
  },
  {
    title: "Set Up Profile",
    description:
      "Add role details and communication preferences for personalized alerts and collaboration.",
    href: "/profile/setup",
  },
  {
    title: "Open Dashboard",
    description:
      "Go straight to your dashboard to review current status and key operational metrics.",
    href: "/dashboard",
  },
];

export default function WelcomePage() {
  return (
    <ProtectedPage>
      <div className="max-w-5xl mx-auto space-y-8">
        <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
            Welcome
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
            Your account is ready. Let us guide your next steps.
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
            Great to have you here. Follow the recommended sequence below to set up your workspace
            quickly and make your first detection workflows operational.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 reveal-up">
            <SetPasswordForm />
          </div>

          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-soft)] px-1">
              Next Steps
            </h3>
            <div className="grid gap-5">
              {nextSteps.map((step) => (
                <SectionCard
                  key={step.title}
                  className="reveal-up"
                  title={step.title}
                  description="Recommended action"
                >
                  <p className="mb-3 text-sm leading-7 text-[var(--text-muted)]">{step.description}</p>
                  <Link
                    href={step.href}
                    className="inline-flex rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
                  >
                    Continue
                  </Link>
                </SectionCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
