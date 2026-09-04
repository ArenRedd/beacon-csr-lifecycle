"use client";

import { useMemo } from "react";
import { useBeacon } from "@/lib/store";
import { Panel, PanelHeader, Chip } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ShieldCheck, Link2, Fingerprint } from "lucide-react";

export default function Audit() {
  const { updates } = useBeacon();

  const blocks = useMemo(
    () =>
      updates.map((u) => ({
        block: u.block,
        action: u.state === "verified" ? "Verified" : u.needsReview ? "Flagged for review" : "Structured",
        actor: u.state === "verified" ? u.verifiedBy ?? "CSR Manager" : "AI Parser",
        detail: `${u.parsed[0]?.label ?? "Update"}: ${u.parsed[0]?.value ?? ""}`,
        at: u.raw.slice(0, 40) || "[no text]",
        hash: u.hash,
        previousHash: u.previousHash,
        status: u.state,
      })),
    [updates]
  );

  const tamperFlag = blocks.some((b, i) => {
    if (i === 0) return b.previousHash !== "genesis";
    return b.previousHash !== blocks[i - 1].hash;
  });

  return (
    <div className="fade-up mx-auto max-w-6xl space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
            <p className="mt-1 text-sm text-[var(--fg-dim)]">
              Every change is hash-chained — each block references the last, so a
              silent edit breaks the chain.
            </p>
          </div>
          <Chip
            tone={tamperFlag ? "red" : "green"}
            className="ml-auto"
          >
            {tamperFlag ? "Chain integrity compromised" : "Chain intact"}
          </Chip>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Panel className="flex items-center gap-3 py-4">
          <Fingerprint className="text-[var(--accent)]" size={22} />
          <div>
            <div className="text-lg font-semibold tabular-nums">{blocks.length}</div>
            <div className="text-xs text-[var(--fg-dim)]">chained blocks</div>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3 py-4">
          <Link2 className="text-[var(--green)]" size={22} />
          <div>
            <div className="text-lg font-semibold">
              {blocks.filter((b) => b.status === "verified").length}
            </div>
            <div className="text-xs text-[var(--fg-dim)]">human-verified entries</div>
          </div>
        </Panel>
        <Panel className="flex items-center gap-3 py-4">
          <ShieldCheck className="text-[var(--amber)]" size={22} />
          <div>
            <div className="text-lg font-semibold">SHA-256</div>
            <div className="text-xs text-[var(--fg-dim)]">hashed per block</div>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeader
          title="Block chain"
          subtitle="Left-to-right: the genesis → latest linkage. Purpose-built for Section 135 audit support."
        />
        <div className="space-y-0">
          {blocks.map((b, i) => {
            const matchesLink = i === 0 || b.previousHash === blocks[i - 1].hash;
            return (
              <div key={b.block} className="flex gap-3">
                {/* chain link line */}
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 rounded-full",
                      b.status === "verified"
                        ? "bg-emerald-400"
                        : b.status === "pending-review"
                          ? "bg-amber-400"
                          : "bg-[var(--accent)]"
                    )}
                  />
                  {i < blocks.length - 1 ? (
                    <span
                      className={cn(
                        "w-px flex-1",
                        matchesLink ? "bg-emerald-500/40" : "bg-red-500/60"
                      )}
                    />
                  ) : null}
                </div>

                <div className="mb-3 flex-1 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[var(--fg-faint)]">
                        #{b.block}
                      </span>
                      <span
                        className={cn(
                          !matchesLink && "text-red-400",
                          "font-mono text-[11px]",
                          matchesLink ? "text-[var(--fg-dim)]" : "text-red-400"
                        )}
                      >
                        {matchesLink ? "✓ linked" : "✗ CHAIN BREAK"}
                      </span>
                    </div>
                    <Chip
                      tone={
                        b.status === "verified"
                          ? "green"
                          : b.status === "pending-review"
                            ? "amber"
                            : "accent"
                      }
                    >
                      {b.action}
                    </Chip>
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-[var(--fg)]">
                    {b.detail}
                  </div>
                  <div className="mt-1 text-xs text-[var(--fg-dim)]">{b.at}</div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2 font-mono text-[11px]">
                    <span className="text-[var(--fg-faint)]">
                      prev <span className="text-[var(--fg-dim)]">{b.previousHash.slice(0, 12)}</span>
                    </span>
                    <span className="text-[var(--fg-dim)]">
                      this <span className="text-[var(--accent)]">{b.hash.slice(0, 12)}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}