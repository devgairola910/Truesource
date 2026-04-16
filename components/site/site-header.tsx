import Link from "next/link";
import { AuthActions } from "@/components/auth/auth-actions";
import { Chip } from "@/components/ui/chip";
import { NavLinks } from "@/components/site/nav-links";

export function SiteHeader() {
  return (
    <header className="mx-auto mt-4 w-full max-w-6xl rounded-2xl border border-[var(--stroke)] bg-[var(--surface-2)] px-5 py-4 shadow-[0_12px_40px_rgba(5,27,50,0.12)] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.22em] text-[var(--text-soft)]">
            TrueSource
          </p>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-strong)] md:text-3xl">
            Content Integrity Platform
          </h1>
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Chip label="Public Demo" tone="success" />
          <Chip label="MVP" />
          <AuthActions />
        </div>
      </div>
      <div className="mt-4">
        <NavLinks />
      </div>
    </header>
  );
}
