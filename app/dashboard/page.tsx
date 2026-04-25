"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPercent } from "@/lib/utils";
import { kpis, alerts } from "@/lib/mock-data";

const trendIcon = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const recentActivity = [
  { id: "1", text: "New incident detected from streamclips.watch", time: "3m ago", type: "danger" as const },
  { id: "2", text: "Asset AST-1010 finished fingerprinting", time: "11m ago", type: "success" as const },
  { id: "3", text: "Scan run #847 completed — 12,400 pages processed", time: "28m ago", type: "info" as const },
  { id: "4", text: "Reviewer Sarah confirmed ALT-9193", time: "45m ago", type: "warning" as const },
  { id: "5", text: "Domain partner-broadcast.tv added to whitelist", time: "1h ago", type: "success" as const },
  { id: "6", text: "New team member invited: alex@apex.com", time: "2h ago", type: "info" as const },
];

const chartData = [42, 58, 35, 72, 65, 88, 76, 54, 91, 68, 82, 95, 78, 63, 87, 71, 93, 84, 67, 79, 96, 85, 74, 89];

export default function DashboardPage() {
  const [activeChart, setActiveChart] = useState<"detections" | "scans">("detections");
  const maxChart = Math.max(...chartData);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Your operational snapshot — last updated moments ago</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/assets/upload">
            <Button size="sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Upload Asset
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.id}
            className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">{kpi.label}</p>
              <span className={cn(
                "text-xs font-semibold",
                kpi.trend === "up" ? "text-[var(--success)]" : kpi.trend === "down" ? "text-[var(--danger)]" : "text-[var(--text-soft)]"
              )}>
                {trendIcon[kpi.trend]}
              </span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-strong)] tracking-tight">{kpi.value}</p>
            <p className="text-xs text-[var(--text-soft)]">Target: {kpi.target}</p>
            {/* Mini sparkline */}
            <div className="flex items-end gap-0.5 h-8">
              {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85].map((v, j) => (
                <div key={j} className="flex-1 rounded-sm bg-[var(--brand)]" style={{ height: `${(v / 85) * 100}%`, opacity: 0.3 + (j / 12) * 0.7 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Detection chart */}
        <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[var(--text-strong)]">Detection Activity</h2>
              <p className="text-xs text-[var(--text-soft)] mt-0.5">Last 24 hours</p>
            </div>
            <div className="flex rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] p-0.5">
              {(["detections", "scans"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition capitalize",
                    activeChart === tab ? "bg-[var(--surface-2)] text-[var(--text-strong)] shadow-sm" : "text-[var(--text-muted)]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-1 h-48">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm bg-[var(--brand)] transition-all duration-500 ease-out hover:bg-[var(--brand-light)]"
                  style={{ height: `${(val / maxChart) * 100}%` }}
                  title={`${val} ${activeChart}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-[var(--text-soft)]">
            <span>0:00</span><span>6:00</span><span>12:00</span><span>18:00</span><span>Now</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Recent Activity</h2>
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--surface-1)] transition">
                <div className={cn(
                  "mt-1 h-2 w-2 rounded-full shrink-0",
                  item.type === "danger" ? "bg-[var(--danger)]" :
                  item.type === "success" ? "bg-[var(--success)]" :
                  item.type === "warning" ? "bg-[var(--warning)]" : "bg-[var(--brand)]"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--text-strong)] leading-snug">{item.text}</p>
                  <p className="text-[11px] text-[var(--text-soft)] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review queue */}
      <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-strong)]">Review Queue</h2>
            <p className="text-xs text-[var(--text-soft)] mt-0.5">{alerts.filter(a => a.status === "new").length} items need review</p>
          </div>
          <Link href="/dashboard/incidents">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <div className="space-y-2">
          {alerts.filter(a => a.status === "new").slice(0, 3).map((alert) => (
            <Link
              key={alert.id}
              href={`/dashboard/incidents/${alert.id}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4 hover:bg-[var(--surface-2)] hover:shadow-sm transition group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[var(--text-soft)]">{alert.id}</span>
                  <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate">{alert.title}</p>
                <p className="text-xs text-[var(--text-soft)] mt-0.5">{alert.sourceDomain} · {alert.detectedAt}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <p className="text-xs text-[var(--text-soft)]">Top signal</p>
                <p className="text-sm font-semibold text-[var(--text-strong)]">{formatPercent(alert.evidence[0].score)}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--text-soft)] group-hover:text-[var(--brand)] transition shrink-0"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
