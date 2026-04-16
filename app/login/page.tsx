import { LoginForm } from "@/components/auth/login-form";
import { SectionCard } from "@/components/ui/section-card";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Login
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Welcome back. Continue where you left off.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-muted)]">
          Log in to access your dashboard, alerts, and review workflows. You will be redirected to
          your last visited section or the destination you requested.
        </p>
      </section>

      <SectionCard
        className="reveal-up"
        title="Access Your Account"
        description="Enter your credentials to continue"
      >
        <LoginForm requestedRedirect={redirect ?? null} />
      </SectionCard>
    </>
  );
}
