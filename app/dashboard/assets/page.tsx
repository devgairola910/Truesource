"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { assets } from "@/lib/mock-data";
import type { AssetRecord } from "@/lib/mock-data";

const extendedAssets: (AssetRecord & { thumbnail?: string; size?: string })[] = [
  ...assets,
  { id: "AST-1035", title: "Season Opener Promo Video", kind: "video", rightsOwner: "Apex Sports Media", distributedTo: "YouTube, TikTok", status: "protected", lastUpdated: "3h ago", size: "245 MB" },
  { id: "AST-1042", title: "Stadium Aerial Photograph", kind: "image", rightsOwner: "Apex Sports Media", distributedTo: "Press Kit", status: "protected", lastUpdated: "1d ago", size: "18 MB" },
  { id: "AST-1051", title: "Trophy Ceremony Highlights", kind: "video", rightsOwner: "Apex Sports Media", distributedTo: "Broadcast Partners", status: "fingerprinting", lastUpdated: "5m ago", size: "1.2 GB" },
  { id: "AST-1058", title: "Team Photo — Official 2025", kind: "image", rightsOwner: "Apex Sports Media", distributedTo: "All Channels", status: "protected", lastUpdated: "5d ago", size: "12 MB" },
  { id: "AST-1063", title: "Halftime Show B-Roll", kind: "video", rightsOwner: "Apex Sports Media", distributedTo: "Internal", status: "fingerprinting", lastUpdated: "22m ago", size: "890 MB" },
];

type ViewMode = "grid" | "list";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "protected" | "fingerprinting">("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return extendedAssets.filter((a) => {
      if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "all" && a.kind !== typeFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)] tracking-tight">Asset Library</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{extendedAssets.length} registered assets</p>
        </div>
        <Link href="/dashboard/assets/upload">
          <Button>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Assets
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-4">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] py-2 pl-10 pr-4 text-sm text-[var(--text-strong)] placeholder:text-[var(--text-soft)] input-focus-ring"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] input-focus-ring"
        >
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] px-3 py-2 text-sm text-[var(--text-strong)] input-focus-ring"
        >
          <option value="all">All Status</option>
          <option value="protected">Protected</option>
          <option value="fingerprinting">Fingerprinting</option>
        </select>
        <div className="flex rounded-lg border border-[var(--stroke)] bg-[var(--surface-1)] p-0.5">
          {(["grid", "list"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("p-1.5 rounded-md transition", view === v ? "bg-[var(--surface-2)] shadow-sm" : "text-[var(--text-soft)]")}>
              {v === "grid" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--brand)]/20 bg-[var(--brand-surface)] px-4 py-3 slide-up">
          <span className="text-sm font-medium text-[var(--brand)]">{selected.size} selected</span>
          <Button size="sm" variant="secondary">Export Metadata</Button>
          <Button size="sm" variant="danger">Remove</Button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-[var(--text-muted)] hover:text-[var(--text-strong)]">Clear</button>
        </div>
      )}

      {/* Asset grid/list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>}
          title="No assets found"
          description="Try adjusting your filters or upload your first asset."
          action={<Link href="/dashboard/assets/upload"><Button size="sm">Upload Asset</Button></Link>}
        />
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => (
            <div key={asset.id} className="group relative rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden hover:shadow-md transition">
              {/* Selection checkbox */}
              <button onClick={() => toggleSelect(asset.id)} className="absolute top-3 left-3 z-10">
                <div className={cn("h-5 w-5 rounded-md border-2 flex items-center justify-center transition",
                  selected.has(asset.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)] bg-[var(--surface-2)] opacity-0 group-hover:opacity-100"
                )}>
                  {selected.has(asset.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              {/* Thumbnail placeholder */}
              <div className="aspect-video bg-gradient-to-br from-[var(--surface-1)] to-[var(--surface-3)] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-soft)]">
                  {asset.kind === "video" ? <><rect x="2" y="2" width="20" height="20" rx="2"/><polygon points="10 8 16 12 10 16 10 8"/></> : <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>}
                </svg>
              </div>
              <Link href={`/dashboard/assets/${asset.id}`} className="block p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant={asset.status === "protected" ? "success" : "warning"}>{asset.status}</Badge>
                  <span className="text-[10px] uppercase font-semibold text-[var(--text-soft)] tracking-wider">{asset.kind}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text-strong)] group-hover:text-[var(--brand)] transition truncate">{asset.title}</p>
                <p className="text-xs text-[var(--text-soft)] mt-1">{asset.id} · {asset.lastUpdated}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
          <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--stroke)] bg-[var(--surface-1)] text-xs font-semibold text-[var(--text-soft)] uppercase tracking-wider">
            <button onClick={toggleAll} className="shrink-0">
              <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center", selected.size === filtered.length ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]")}>
                {selected.size === filtered.length && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </button>
            <span className="flex-1">Asset</span>
            <span className="w-20">Type</span>
            <span className="w-28">Status</span>
            <span className="w-24 text-right">Updated</span>
          </div>
          {filtered.map((asset) => (
            <Link key={asset.id} href={`/dashboard/assets/${asset.id}`} className="flex items-center gap-4 px-4 py-3 border-b border-[var(--stroke)] last:border-0 hover:bg-[var(--surface-1)] transition group">
              <button onClick={(e) => { e.preventDefault(); toggleSelect(asset.id); }} className="shrink-0">
                <div className={cn("h-4 w-4 rounded border-2 flex items-center justify-center", selected.has(asset.id) ? "bg-[var(--brand)] border-[var(--brand)]" : "border-[var(--stroke)]")}>
                  {selected.has(asset.id) && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-strong)] group-hover:text-[var(--brand)] truncate">{asset.title}</p>
                <p className="text-xs text-[var(--text-soft)]">{asset.id}</p>
              </div>
              <span className="w-20 text-xs text-[var(--text-muted)] capitalize">{asset.kind}</span>
              <span className="w-28"><Badge variant={asset.status === "protected" ? "success" : "warning"}>{asset.status}</Badge></span>
              <span className="w-24 text-xs text-[var(--text-soft)] text-right">{asset.lastUpdated}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
