"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="flex flex-wrap gap-2">
      {navigationItems.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              isActive
                ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--brand-ink)]"
                : "border-[var(--stroke)] bg-[var(--surface-1)] text-[var(--text-muted)] hover:bg-[var(--surface-3)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
