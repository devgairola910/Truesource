"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatPercent } from "@/lib/utils";
import type { AlertRecord, KpiRecord } from "@/lib/mock-data";

const trendIcon = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const chartData = [42, 58, 35, 72, 65, 88, 76, 54, 91, 68, 82, 95, 78, 63, 87, 71, 93, 84, 67, 79, 96, 85, 74, 89];

export default function DashboardPage() {
  const [activeChart, setActiveChart] = useState<"detections" | "scans">("detections");
  const [kpis, setKpis] = useState<KpiRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const maxChart = Math.max(...chartData);

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiRes, dashboardRes] = await Promise.all([
          fetch("/api/kpis"),
          fetch("/api/dashboard")
        ]);
        
        const kpiData = await kpiRes.json();
        const dashboardData = await dashboardRes.json();

        setKpis(kpiData.kpis || []);
        setAlerts(dashboardData.snapshot?.recentAlerts || []);
      } catch (error) {
        console.error("Dashboard synchronization failure:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const recentActivity = alerts.slice(0, 6).map((alert, i) => ({
    id: alert.id,
    text: alert.title,
    time: alert.detectedAt,
    type: alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "info"
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center h-12">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Operational status synchronized with backend</p>
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
            className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">{kpi.label}</p>
              <span className={cn(
                "text-xs font-black",
                kpi.trend === "up" ? "text-[var(--success)]" : kpi.trend === "down" ? "text-[var(--danger)]" : "text-[var(--text-soft)]"
              )}>
                {trendIcon[kpi.trend]}
              </span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-strong)] tracking-tighter">{kpi.value}</p>
            <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-soft)] uppercase tracking-wider">
              <span>Target: {kpi.target}</span>
            </div>
            <div className="flex items-end gap-0.5 h-8">
              {[35, 42, 38, 55, 48, 62, 58, 70, 65, 78, 72, 85].map((v, j) => (
                <div key={j} className="flex-1 rounded-sm bg-[var(--brand)]" style={{ height: `${(v / 85) * 100}%`, opacity: 0.2 + (j / 12) * 0.8 }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Detection chart */}
        <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)]">Detection Activity</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-soft)] mt-1 text-indigo-500/80">Real-time scan telemetry</p>
            </div>
            <div className="flex rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-1">
              {(["detections", "scans"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChart(tab)}
                  className={cn(
                    "px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition",
                    activeChart === tab ? "bg-[var(--surface-2)] text-[var(--brand)] shadow-sm" : "text-[var(--text-muted)]"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-64">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 group relative flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-[var(--brand)] to-indigo-400 opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-x-110"
                  style={{ height: `${(val / maxChart) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)]">
            <span>0:00</span><span>6:00</span><span>12:00</span><span>18:00</span><span>Live</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-sm">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)] mb-6">Recent Activity</h2>
          <div className="space-y-2">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4 rounded-xl px-4 py-3 border border-transparent hover:border-[var(--stroke)] hover:bg-[var(--surface-1)] transition-all group">
                <div className={cn(
                  "mt-1.5 h-2 w-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]",
                  item.type === "danger" ? "text-[var(--danger)] bg-current" :
                  item.type === "warning" ? "text-[var(--warning)] bg-current" : "text-[var(--brand)] bg-current"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--text-strong)] leading-relaxed">{item.text}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)] mt-1.5 opacity-60 group-hover:opacity-100">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review queue */}
      <div className="reveal-up rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-strong)]">Tactical Review Queue</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-soft)] mt-1">{alerts.filter(a => a.status === "new").length} High-priority nodes pending</p>
          </div>
          <Link href="/dashboard/incidents">
            <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-[var(--brand)]">View Full Feed →</Button>
          </Link>
        </div>
        <div className="space-y-3">
          {alerts.filter(a => a.status === "new").slice(0, 3).map((alert) => (
            <Link
              key={alert.id}
              href={`/dashboard/incidents/${alert.id}`}
              className="flex items-center gap-6 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-1)] p-5 hover:bg-[var(--surface-2)] hover:border-[var(--brand)]/20 transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">{alert.id}</span>
                  <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"} className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate leading-relaxed">{alert.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-1 w-1 rounded-full bg-[var(--text-soft)]" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-soft)] opacity-80">{alert.sourceDomain} · {alert.detectedAt}</p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 px-6 border-x border-[var(--stroke)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)]">Signal Lock</p>
                <p className="text-lg font-black text-[var(--text-strong)] tracking-tighter">{formatPercent(alert.evidence[0].score)}</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-[var(--stroke)] flex items-center justify-center text-[var(--text-soft)] group-hover:text-[var(--brand)] group-hover:border-[var(--brand)]/20 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
