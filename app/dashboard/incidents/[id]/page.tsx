"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs } from "@/components/ui/tabs";
import { cn, formatPercent } from "@/lib/utils";
import { alerts } from "@/lib/mock-data";
import type { AlertStatus } from "@/lib/mock-data";

const auditTrail = [
  { action: "Incident created", user: "System", time: "3 min ago", detail: "Auto-generated from scan run #847" },
  { action: "Assigned to reviewer", user: "System", time: "3 min ago", detail: "Auto-assigned based on severity routing" },
  { action: "Evidence snapshot captured", user: "System", time: "2 min ago", detail: "Source page archived for legal reference" },
];

export default function IncidentDetailPage() {
  const params = useParams();
  const alertId = params.id as string;
  const alert = alerts.find((a) => a.id === alertId) ?? alerts[0];
  const [status, setStatus] = useState<AlertStatus>(alert.status);
  const [tab, setTab] = useState("evidence");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; time: string; user: string }[]>([]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([{ text: note, time: "just now", user: "You" }, ...notes]);
    setNote("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/incidents" className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--text-soft)]">{alert.id}</span>
            <Badge variant={alert.severity === "critical" ? "danger" : alert.severity === "high" ? "warning" : "default"}>{alert.severity}</Badge>
            <Badge variant={status === "new" ? "info" : status === "confirmed" ? "danger" : status === "whitelisted" ? "success" : "default"}>{status}</Badge>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-strong)]">{alert.title}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{alert.sourceDomain} · Detected {alert.detectedAt}</p>
        </div>
      </div>

      {/* Reviewer actions */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4">
        <span className="text-sm font-medium text-[var(--text-muted)] mr-2">Actions:</span>
        <Button size="sm" variant="danger" onClick={() => setStatus("confirmed")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Confirm
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setStatus("dismissed")}>Dismiss</Button>
        <Button size="sm" variant="outline" onClick={() => setStatus("whitelisted")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Whitelist Source
        </Button>
        <Button size="sm" variant="ghost">Assign</Button>
        <Button size="sm" variant="ghost">Escalate</Button>
      </div>

      <Tabs
        tabs={[
          { id: "evidence", label: "Evidence" },
          { id: "signals", label: "Signal Breakdown" },
          { id: "audit", label: "Audit Trail", count: auditTrail.length + notes.length },
        ]}
        activeTab={tab}
        onChange={setTab}
      />

      {tab === "evidence" && (
        <div className="space-y-6">
          {/* Side-by-side comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--stroke)] bg-[var(--surface-1)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">Original Asset</p>
                <p className="text-sm font-medium text-[var(--text-strong)] mt-0.5">{alert.matchedAssetTitle}</p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center text-[var(--text-soft)]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p className="text-xs">Official registered asset</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--danger)]/30 bg-[var(--surface-2)] overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--danger)]/20 bg-[var(--danger-surface)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--danger)]">Suspected Infringement</p>
                <p className="text-sm font-medium text-[var(--text-strong)] mt-0.5 truncate">{alert.sourceUrl}</p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center text-[var(--text-soft)]">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  <p className="text-xs">Captured from {alert.sourceDomain}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Source info */}
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-5">
            <h3 className="text-sm font-semibold text-[var(--text-strong)] mb-3">Source Details</h3>
            <dl className="grid gap-2 sm:grid-cols-2 text-sm">
              {[
                ["Source URL", alert.sourceUrl],
                ["Source Domain", alert.sourceDomain],
                ["Detected At", alert.detectedAt],
                ["Matched Asset", `${alert.matchedAssetId} — ${alert.matchedAssetTitle}`],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-[var(--text-soft)] uppercase tracking-wider">{k}</dt>
                  <dd className="mt-0.5 font-medium text-[var(--text-strong)] break-all">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 rounded-lg bg-[var(--surface-1)] p-3">
              <p className="text-xs text-[var(--text-soft)] uppercase tracking-wider mb-1">Recommended Action</p>
              <p className="text-sm text-[var(--text-muted)]">{alert.recommendedAction}</p>
            </div>
          </div>
        </div>
      )}

      {tab === "signals" && (
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--text-strong)]">Confidence Breakdown</h3>
            <Badge variant={alert.severity === "critical" ? "danger" : "warning"}>
              Composite: {formatPercent(alert.evidence.reduce((s, e) => s + e.score, 0) / alert.evidence.length)}
            </Badge>
          </div>
          <div className="space-y-4">
            {alert.evidence.map((signal) => (
              <div key={signal.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--text-strong)]">{signal.label}</span>
                  <span className={cn("font-bold", signal.score >= 0.8 ? "text-[var(--danger)]" : signal.score >= 0.6 ? "text-[var(--warning)]" : "text-[var(--text-muted)]")}>{formatPercent(signal.score)}</span>
                </div>
                <Progress value={signal.score * 100} color={signal.score >= 0.8 ? "var(--danger)" : signal.score >= 0.6 ? "var(--warning)" : "var(--text-soft)"} />
                <p className="text-xs text-[var(--text-soft)]">
                  {signal.score >= 0.8 ? "Strong match — high confidence signal" : signal.score >= 0.6 ? "Moderate match — corroborative signal" : "Weak match — insufficient alone"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "audit" && (
        <div className="space-y-4">
          {/* Add note */}
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4">
            <div className="flex gap-3">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note to the audit trail…" rows={2} className="flex-1 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring resize-none" />
              <Button onClick={addNote} size="sm" className="self-end">Add Note</Button>
            </div>
          </div>

          {/* Trail */}
          <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6 space-y-0">
            {[...notes.map(n => ({ action: "Note added", user: n.user, time: n.time, detail: n.text })), ...auditTrail].map((entry, i) => (
              <div key={i} className="flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--brand)] shrink-0 mt-1" />
                  {i < auditTrail.length + notes.length - 1 && <div className="w-px flex-1 bg-[var(--stroke)] mt-1" />}
                </div>
                <div className="flex-1 -mt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-[var(--text-strong)]">{entry.action}</p>
                    <span className="text-xs text-[var(--text-soft)]">by {entry.user}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">{entry.detail}</p>
                  <p className="text-[10px] text-[var(--text-soft)] mt-1">{entry.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
