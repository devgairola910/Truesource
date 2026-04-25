"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const scans = [
  { id: "SCAN-847", status: "completed", pages: "12,400", matches: 3, started: "28m ago", duration: "4m 12s" },
  { id: "SCAN-846", status: "completed", pages: "8,920", matches: 1, started: "2h ago", duration: "3m 05s" },
  { id: "SCAN-845", status: "completed", pages: "15,300", matches: 5, started: "6h ago", duration: "5m 44s" },
  { id: "SCAN-844", status: "completed", pages: "11,200", matches: 0, started: "12h ago", duration: "3m 38s" },
  { id: "SCAN-843", status: "completed", pages: "9,800", matches: 2, started: "1d ago", duration: "2m 55s" },
  { id: "SCAN-842", status: "failed", pages: "6,100", matches: 0, started: "1d ago", duration: "1m 22s" },
];

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Scan Runs</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Web scanning history and results</p>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-[var(--stroke)] bg-[var(--surface-1)] text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">
          <span className="w-24">Run ID</span>
          <span className="w-24">Status</span>
          <span className="flex-1">Pages Scanned</span>
          <span className="w-20">Matches</span>
          <span className="w-24">Duration</span>
          <span className="w-20 text-right">Started</span>
        </div>
        {scans.map((scan) => (
          <Link key={scan.id} href={`/dashboard/scans/${scan.id}`} className="flex items-center gap-4 px-6 py-4 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition group">
            <span className="w-24 text-sm font-mono font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)]">{scan.id}</span>
            <span className="w-24"><Badge variant={scan.status === "completed" ? "success" : "danger"}>{scan.status}</Badge></span>
            <span className="flex-1 text-sm text-[var(--text-muted)]">{scan.pages} pages</span>
            <span className="w-20 text-sm font-semibold text-[var(--text-strong)]">{scan.matches}</span>
            <span className="w-24 text-sm text-[var(--text-muted)]">{scan.duration}</span>
            <span className="w-20 text-xs text-[var(--text-soft)] text-right">{scan.started}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
