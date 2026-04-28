"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ScansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Scan Runs</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Web scanning history and results</p>
        </div>
        <Link href="/dashboard/scans/leak-check">
          <Button>Deep Scan</Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] overflow-hidden">
        <div className="flex items-center justify-center py-20 px-6 text-center">
          <div className="max-w-md space-y-3">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--surface-3)] flex items-center justify-center text-2xl opacity-50">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-strong)]">No Scan Runs Yet</h3>
            <p className="text-sm text-[var(--text-soft)]">
              You haven't run any deep scans or web searches yet. 
              Start a new scan to monitor your assets across the web.
            </p>
            <div className="pt-4">
              <Link href="/dashboard/scans/leak-check">
                <Button variant="secondary">Start Your First Scan</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
