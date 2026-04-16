import { ProtectedPage } from "@/components/auth/protected-page";
import { SectionCard } from "@/components/ui/section-card";

const quickStats = [
  { label: "Open Alerts", value: "18" },
  { label: "Confirmed Today", value: "9" },
  { label: "Median Triage", value: "1m 42s" },
  { label: "Suppressed Sources", value: "31" },
];

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <section className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 md:p-8">
        <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
          Dashboard
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--text-strong)] md:text-4xl">
          Welcome back. Here is your operational snapshot.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)]">
          This dashboard is your primary post-login destination with high-priority metrics and
          workflow visibility. Use it to quickly assess queue health and review throughput.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((item) => (
          <SectionCard
            key={item.label}
            className="reveal-up"
            title={item.value}
            description={item.label}
          >
            <p className="text-sm text-[var(--text-muted)]">Updated moments ago.</p>
          </SectionCard>
        ))}
      </section>
    </ProtectedPage>
  );
}
