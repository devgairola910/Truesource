"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const reports = [
  { id: "RPT-001", title: "Weekly Detection Summary", type: "Automated", schedule: "Every Monday", lastRun: "2d ago", format: "PDF" },
  { id: "RPT-002", title: "Monthly Incident Report", type: "Automated", schedule: "1st of month", lastRun: "24d ago", format: "PDF" },
  { id: "RPT-003", title: "Source Domain Analysis", type: "On-demand", schedule: "Manual", lastRun: "5d ago", format: "CSV" },
  { id: "RPT-004", title: "Asset Protection Audit", type: "On-demand", schedule: "Manual", lastRun: "12d ago", format: "PDF" },
  { id: "RPT-005", title: "Team Performance Metrics", type: "Automated", schedule: "Bi-weekly", lastRun: "8d ago", format: "PDF" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Reports</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Generate and schedule reports</p>
        </div>
        <Button size="sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Create Report
        </Button>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        {reports.map((r) => (
          <div key={r.id} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition">
            <div className="h-10 w-10 rounded-xl bg-[var(--brand-surface)] flex items-center justify-center text-[var(--brand)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-strong)]">{r.title}</p>
              <p className="text-xs text-[var(--text-soft)]">{r.type} · {r.schedule} · Last: {r.lastRun}</p>
            </div>
            <Badge variant="default">{r.format}</Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost">View</Button>
              <Button size="sm" variant="outline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
