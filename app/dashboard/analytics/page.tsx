"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { kpis } from "@/lib/mock-data";

const chartWeeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const detectionData = [12, 18, 24, 15, 31, 28, 36, 42];
const precisionData = [88, 90, 91, 89, 92, 93, 91, 94];

const topSources = [
  { domain: "streamclips.watch", incidents: 14, confirmed: 11 },
  { domain: "sports-trends.blog", incidents: 9, confirmed: 6 },
  { domain: "fan-news-hub.io", incidents: 7, confirmed: 3 },
  { domain: "replay-hub.net", incidents: 5, confirmed: 4 },
  { domain: "game-recap.tv", incidents: 3, confirmed: 1 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("8w");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Analytics</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Detection performance and operational metrics</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "4w", "8w", "6m"].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition", period === p ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-1)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]")}>{p}</button>
          ))}
          <Button size="sm" variant="outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.id} className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">{k.label}</p>
            <p className="text-2xl font-bold text-[var(--text-strong)] mt-2">{k.value}</p>
            <p className="text-xs text-[var(--text-soft)] mt-1">Target: {k.target}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detections chart */}
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Weekly Detections</h2>
          <div className="flex items-end gap-2 h-40">
            {detectionData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--text-soft)]">{v}</span>
                <div className="w-full rounded-t bg-[var(--brand)] hover:bg-[var(--brand-light)] transition" style={{ height: `${(v / Math.max(...detectionData)) * 100}%` }} />
                <span className="text-[10px] text-[var(--text-soft)]">{chartWeeks[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Precision chart */}
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
          <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Precision Trend (%)</h2>
          <div className="relative h-40">
            <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={precisionData.map((v, i) => `${(i / (precisionData.length - 1)) * 200},${100 - ((v - 85) / 15) * 100}`).join(" ")}
              />
              <polyline
                fill="url(#gradient)"
                stroke="none"
                points={`0,100 ${precisionData.map((v, i) => `${(i / (precisionData.length - 1)) * 200},${100 - ((v - 85) / 15) * 100}`).join(" ")} 200,100`}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[10px] text-[var(--text-soft)]">
              {chartWeeks.map((w) => <span key={w}>{w}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Top sources */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Top Infringing Sources</h2>
        <div className="space-y-3">
          {topSources.map((src, i) => (
            <div key={src.domain} className="flex items-center gap-4">
              <span className="w-6 text-xs font-semibold text-[var(--text-soft)] text-right">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-strong)]">{src.domain}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-3)] max-w-[200px]">
                    <div className="h-full rounded-full bg-[var(--danger)]" style={{ width: `${(src.incidents / topSources[0].incidents) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[var(--text-soft)]">{src.incidents} incidents</span>
                </div>
              </div>
              <Badge variant="danger">{src.confirmed} confirmed</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
