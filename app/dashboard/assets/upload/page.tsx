"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UploadStep = "files" | "metadata" | "protection" | "review";
const steps: { id: UploadStep; label: string }[] = [
  { id: "files", label: "Select Files" },
  { id: "metadata", label: "Metadata" },
  { id: "protection", label: "Protection" },
  { id: "review", label: "Review" },
];

type FileItem = { name: string; size: string; type: "image" | "video"; progress: number };

export default function UploadPage() {
  const [step, setStep] = useState<UploadStep>("files");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Apex Sports Media");
  const [distribution, setDistribution] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [fingerprint, setFingerprint] = useState(true);

  const currentIndex = steps.findIndex((s) => s.id === step);

  const simulateUpload = () => {
    const mockFiles: FileItem[] = [
      { name: "matchday-promo-v2.jpg", size: "4.2 MB", type: "image", progress: 100 },
      { name: "highlight-clip-q3.mp4", size: "128 MB", type: "video", progress: 78 },
    ];
    setFiles(mockFiles);
    // Simulate progress
    setTimeout(() => setFiles((f) => f.map((file) => ({ ...file, progress: 100 }))), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/assets" className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--stroke)] text-[var(--text-muted)] hover:bg-[var(--surface-1)] transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Upload Assets</h1>
          <p className="text-sm text-[var(--text-muted)]">Register official media for protection</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => i <= currentIndex && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition w-full",
                step === s.id ? "bg-[var(--brand-surface)] text-[var(--brand)]" :
                i < currentIndex ? "text-[var(--success)]" : "text-[var(--text-soft)]"
              )}
            >
              <span className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold shrink-0",
                step === s.id ? "bg-[var(--brand)] text-white" :
                i < currentIndex ? "bg-[var(--success)] text-white" : "bg-[var(--surface-3)] text-[var(--text-soft)]"
              )}>
                {i < currentIndex ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={cn("h-px flex-1", i < currentIndex ? "bg-[var(--success)]" : "bg-[var(--stroke)]")} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] p-6">
        {step === "files" && (
          <div className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); simulateUpload(); }}
              onClick={simulateUpload}
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 px-6 cursor-pointer transition",
                isDragging ? "border-[var(--brand)] bg-[var(--brand-surface)]" : "border-[var(--stroke)] hover:border-[var(--brand)] hover:bg-[var(--brand-surface)]"
              )}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-soft)] mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p className="text-sm font-semibold text-[var(--text-strong)]">Drop files here or click to browse</p>
              <p className="text-xs text-[var(--text-soft)] mt-1">Images (JPG, PNG, WebP) · Videos (MP4, MOV) · Max 2 GB per file</p>
            </div>
            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shrink-0", f.type === "video" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600")}>
                      {f.type === "video" ? "🎬" : "🖼️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-strong)] truncate">{f.name}</p>
                      <p className="text-xs text-[var(--text-soft)]">{f.size}</p>
                      {f.progress < 100 && <Progress value={f.progress} size="sm" className="mt-1.5" />}
                    </div>
                    <Badge variant={f.progress === 100 ? "success" : "info"}>
                      {f.progress === 100 ? "Ready" : `${f.progress}%`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "metadata" && (
          <div className="space-y-5">
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Asset Title
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Matchday Promo — Season 2025" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Rights Owner
              <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Distribution Channels
              <input type="text" value={distribution} onChange={(e) => setDistribution(e.target.value)} placeholder="e.g. Instagram, X, Broadcast" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1" />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-[var(--text-muted)]">
              Description
              <textarea rows={3} placeholder="Optional description or notes…" className="w-full rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] px-4 py-3 text-sm text-[var(--text-strong)] input-focus-ring mt-1 resize-none" />
            </label>
          </div>
        )}

        {step === "protection" && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">Configure protection settings for these assets.</p>
            {[
              { label: "Perceptual Fingerprinting", desc: "Generate resilient hashes for matching against altered copies", checked: fingerprint, onChange: () => setFingerprint(!fingerprint) },
              { label: "Invisible Watermark", desc: "Embed hidden provenance signals for stronger attribution", checked: watermark, onChange: () => setWatermark(!watermark) },
              { label: "Shot-Level Indexing", desc: "Segment video into individual shots for clip-level matching", checked: true, onChange: () => {} },
              { label: "Logo Detection", desc: "Detect and index visible brand cues for evidence", checked: true, onChange: () => {} },
            ].map((opt) => (
              <label key={opt.label} className="flex items-start gap-3 rounded-xl border border-[var(--stroke)] bg-[var(--surface-1)] p-4 cursor-pointer hover:bg-[var(--surface-2)] transition">
                <input type="checkbox" checked={opt.checked} onChange={opt.onChange} className="mt-0.5 h-4 w-4 rounded border-[var(--stroke)] accent-[var(--brand)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text-strong)]">{opt.label}</p>
                  <p className="text-xs text-[var(--text-soft)] mt-0.5">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-[var(--success-surface)] border border-[var(--success)]/20 p-4">
              <p className="text-sm font-semibold text-[var(--success)]">✓ Ready to submit</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Review your upload details below. Assets will begin processing immediately.</p>
            </div>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                ["Files", `${files.length} file(s)`],
                ["Title", title || "Untitled"],
                ["Owner", owner],
                ["Distribution", distribution || "Not specified"],
                ["Fingerprinting", fingerprint ? "Enabled" : "Disabled"],
                ["Watermarking", watermark ? "Enabled" : "Disabled"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-[var(--surface-1)] p-3">
                  <dt className="text-xs text-[var(--text-soft)] uppercase tracking-wider">{label}</dt>
                  <dd className="mt-1 font-medium text-[var(--text-strong)]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={() => setStep(steps[currentIndex - 1]?.id ?? "files")}
          disabled={currentIndex === 0}
        >
          ← Back
        </Button>
        {currentIndex < steps.length - 1 ? (
          <Button onClick={() => setStep(steps[currentIndex + 1].id)}>
            Continue →
          </Button>
        ) : (
          <Link href="/dashboard/assets">
            <Button>Submit & Process</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
