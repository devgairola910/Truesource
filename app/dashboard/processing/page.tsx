"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const jobs = [
  { id: "JOB-4401", asset: "Trophy Ceremony Highlights", type: "video", stage: "Shot indexing", progress: 67, eta: "~8 min" },
  { id: "JOB-4400", asset: "Halftime Show B-Roll", type: "video", stage: "Embedding vectors", progress: 34, eta: "~14 min" },
  { id: "JOB-4399", asset: "Season Opener Promo", type: "video", stage: "Watermark embed", progress: 89, eta: "~2 min" },
];

const completed = [
  { id: "JOB-4398", asset: "Player Reveal - Matchday Graphic", stage: "All steps", time: "2h ago", duration: "1m 22s" },
  { id: "JOB-4395", asset: "Club Crest Master Vector", stage: "All steps", time: "4h ago", duration: "38s" },
  { id: "JOB-4390", asset: "Stadium Aerial Photograph", stage: "All steps", time: "1d ago", duration: "2m 10s" },
];

export default function ProcessingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Processing</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Active fingerprinting and analysis jobs</p>
      </div>

      {/* Active jobs */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        <h2 className="text-base font-semibold text-[var(--text-strong)] mb-4">Active Jobs ({jobs.length})</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[var(--text-soft)]">{job.id}</span>
                  <Badge variant="info">{job.stage}</Badge>
                </div>
                <span className="text-xs text-[var(--text-soft)]">ETA: {job.eta}</span>
              </div>
              <p className="text-sm font-medium text-[var(--text-strong)] mb-2">{job.asset}</p>
              <div className="flex items-center gap-3">
                <Progress value={job.progress} className="flex-1" />
                <span className="text-xs font-semibold text-[var(--text-strong)] w-10 text-right">{job.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--stroke)]">
          <h2 className="text-base font-semibold text-[var(--text-strong)]">Recently Completed</h2>
        </div>
        {completed.map((job) => (
          <div key={job.id} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition">
            <div className="h-8 w-8 rounded-lg bg-[var(--success-surface)] flex items-center justify-center text-[var(--success)] text-xs">✓</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-strong)]">{job.asset}</p>
              <p className="text-xs text-[var(--text-soft)]">{job.id} · {job.stage}</p>
            </div>
            <span className="text-xs text-[var(--text-soft)]">{job.duration}</span>
            <span className="text-xs text-[var(--text-soft)]">{job.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
