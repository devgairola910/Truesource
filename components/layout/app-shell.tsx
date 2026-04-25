"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/40 fade-in" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-[var(--sidebar-width)]" style={{ animation: "slide-in-left 200ms ease" }}>
            <Sidebar onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Topbar */}
      <Topbar sidebarCollapsed={collapsed} onMenuToggle={() => setMobileOpen(!mobileOpen)} />

      {/* Main content */}
      <main
        className={cn(
          "pt-[var(--topbar-height)] min-h-screen transition-all duration-300",
          "lg:pl-[var(--sidebar-width)]",
          collapsed && "lg:pl-[68px]"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
