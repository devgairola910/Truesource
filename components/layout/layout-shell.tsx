"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

/**
 * Conditionally renders the marketing header/footer/wrapper.
 * Dashboard routes (/dashboard/*) get a bare layout since they
 * have their own AppShell provided by app/dashboard/layout.tsx.
 * Auth-standalone pages (forgot-password, invite) also skip the shell.
 */
const BARE_PREFIXES = ["/dashboard", "/forgot-password", "/invite"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBare = BARE_PREFIXES.some((p) => pathname.startsWith(p));

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
