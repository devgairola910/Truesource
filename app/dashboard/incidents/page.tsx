"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, formatPercent } from "@/lib/utils";
import { alerts } from "@/lib/mock-data";
import type { AlertRecord, AlertStatus } from "@/lib/mock-data";

const extendedAlerts: AlertRecord[] = [
  ...alerts,
  { id: "ALT-9175", title: "Broadcast clip resized and reposted on fan blog", sourceDomain: "replay-hub.net", sourceUrl: "https://replay-hub.net/clips/latest", matchedAssetId: "AST-1010", matchedAssetTitle: "Highlight Reel Q2", severity: "high", detectedAt: "42m ago", status: "confirmed", recommendedAction: "Evidence retained.", evidence: [{ label: "Embedding", score: 0.91 }, { label: "Perceptual hash", score: 0.87 }] },
  { id: "ALT-9168", title: "Logo used in unofficial merchandise listing", sourceDomain: "merch-world.shop", sourceUrl: "https://merch-world.shop/item/342", matchedAssetId: "AST-1021", matchedAssetTitle: "Club Crest Master Vector", severity: "medium", detectedAt: "1h ago", status: "dismissed", recommendedAction: "Dismissed as fan art.", evidence: [{ label: "Logo consistency", score: 0.72 }, { label: "Embedding", score: 0.68 }] },
  { id: "ALT-9161", title: "Official photo cropped and watermarked by third party", sourceDomain: "sports-daily.com", sourceUrl: "https://sports-daily.com/gallery/week-15", matchedAssetId: "AST-1002", matchedAssetTitle: "Player Reveal - Matchday Graphic", severity: "critical", detectedAt: "2h ago", status: "whitelisted", recommendedAction: "Source whitelisted as partner.", evidence: [{ label: "Embedding", score: 0.96 }, { label: "Watermark", score: 0.89 }] },
];

const savedViews = [
  { id: "all", label: "All Incidents" },
  { id: "new", label: "Needs Review" },
  { id: "critical", label: "Critical" },
  { id: "confirmed", label: "Confirmed" },
];

export default function IncidentsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "high" | "medium">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return extendedAlerts.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (view === "new" && a.status !== "new") return false;
      if (view === "critical" && a.severity !== "critical") return false;
      if (view === "confirmed" && a.status !== "confirmed") return false;
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      return true;
    });
  }, [search, view, severityFilter]);

  const toggleSelect = (id: string) => {
    setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Incidents</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{extendedAlerts.filter(a => a.status === "new").length} awaiting review</p>
        </div>
      </div>

      {/* Saved views */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {savedViews.map((sv) => (
          <button
            key={sv.id}
            onClick={() => setView(sv.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap border",
              view === sv.id ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "bg-[var(--surface-1)] text-[var(--text-muted)] border-[var(--stroke)] hover:bg-[var(--surface-2)]"
            )}
          >
            {sv.label}
            {sv.id === "new" && <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">{extendedAlerts.filter(a => a.status === "new").length}</span>}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" placeholder="Search incidents…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder:text-[var(--text-soft)] input-focus-ring" />
        </div>
        <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)} className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] input-focus-ring">
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
        </select>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-surface)] px-4 py-3 slide-up">
          <span className="text-sm font-medium text-[var(--brand)]">{selected.size} selected</span>
          <Button size="sm" variant="danger">Confirm All</Button>
          <Button size="sm" variant="secondary">Dismiss All</Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-[var(--text-muted)]">Clear</button>
        </div>
      )}

      {/* Incident list */}
      {filtered.length === 0 ? (
        <EmptyState title="No incidents found" description="Adjust your filters or check back later." />
      ) : (
        <div className="space-y-2">
          {filtered.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3">
              <button onClick={() => toggleSelect(alert.id)} className="shrink-0">
                <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center transition", selected.has(alert.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]")}>
                  {selected.has(alert.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              <Link href={`/dashboard/incidents/${alert.id}`} className="flex-1 flex items-center gap-4 rounded-xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4 hover:shadow-sm transition group">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  alert.severity === "critical" ? "bg-[var(--danger-surface)]" : alert.severity === "high" ? "bg-[var(--warning-surface)]" : "bg-[var(--surface-1)]"
                )}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={alert.severity === "critical" ? "var(--danger)" : alert.severity === "high" ? "var(--warning)" : "var(--text-soft)"} strokeWidth="2" strokeLinecap="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[var(--text-soft)]">{alert.id}</span>
                    <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"}>{alert.severity}</Badge>
                    <Badge variant={alert.status === "new" ? "info" : alert.status === "confirmed" ? "danger" : alert.status === "whitelisted" ? "success" : "default"}>{alert.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate">{alert.title}</p>
                  <p className="text-xs text-[var(--text-soft)] mt-0.5">{alert.sourceDomain} · Matched: {alert.matchedAssetTitle} · {alert.detectedAt}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <p className="text-xs text-[var(--text-soft)]">Confidence</p>
                  <p className="text-sm font-bold text-[var(--text-strong)]">{formatPercent(alert.evidence[0]?.score ?? 0)}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--text-soft)] shrink-0"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
