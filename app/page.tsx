import { Chip } from "@/components/ui/chip";
import { AssetTable } from "@/components/registry/asset-table";
import { ReviewWorkspace } from "@/components/review/review-workspace";
import { CandidateFeed } from "@/components/scanning/candidate-feed";
import { SectionCard } from "@/components/ui/section-card";
import { alerts, assets, candidates } from "@/lib/mock-data";

const navItems = ["Registry", "Scanning", "Alerts", "Review", "Analytics"];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-5 md:px-8 md:py-8">
      <header className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] px-5 py-4 shadow-[0_12px_40px_rgba(5,27,50,0.12)] md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
              TrueSource
            </p>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-strong)] md:text-3xl">
              Content Integrity Console
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Chip label="MVP Build" tone="success" />
            <Chip label="Limited Sources" />
          </div>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              className="rounded-full border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-1.5 text-sm font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-3)]"
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <main className="grid flex-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard
          title="Asset Registry"
          description="Canonical source of official media and ownership metadata"
        >
          <AssetTable rows={assets} />
        </SectionCard>

        <SectionCard
          title="Web Scanning Feed"
          description="Latest candidate pages discovered from monitored public sources"
        >
          <CandidateFeed items={candidates} />
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard
            title="Reviewer Workflow"
            description="Inspect incident evidence, adjust confidence, and decide actions"
          >
            <ReviewWorkspace initialAlerts={alerts} />
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
