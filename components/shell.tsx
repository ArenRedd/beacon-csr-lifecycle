"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  MessageSquareQuote,
  ScrollText,
  FileSignature,
  Radio,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Lifecycle Dashboard", icon: LayoutDashboard },
  { href: "/intake", label: "WhatsApp Intake", icon: MessageSquareQuote },
  { href: "/audit", label: "Audit Log", icon: ScrollText },
  { href: "/csr2", label: "CSR-2 Draft", icon: FileSignature },
];

export function BeaconShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--bg-soft)]">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg shadow-[var(--accent)]/20">
            <Radio size={17} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Beacon</div>
            <div className="text-[11px] text-[var(--fg-faint)]">
              CSR Lifecycle Bridge
            </div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/[0.06] text-[var(--fg)]"
                    : "text-[var(--fg-dim)] hover:bg-white/[0.03] hover:text-[var(--fg)]"
                )}
              >
                <Icon size={16} className={active ? "text-[var(--accent)]" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--line)] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] text-[var(--fg-dim)]">
              Twilio sandbox · demo mode
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--fg-faint)]">
            Prototype demo — data is simulated locally for the hackathon pitch.
          </p>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}