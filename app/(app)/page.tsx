"use client";

import { useBeacon } from "@/lib/store";
import { STAGES, type StageId } from "@/lib/types";
import { stageIndex, riskOf, spendUtilization, parseCurrency } from "@/lib/lifecycle";
import { Panel, PanelHeader, Chip, Stat } from "@/components/ui";
import { cn } from "@/lib/cn";

function StageStrip({ current }: { current: StageId }) {
  const currentIdx = stageIndex(current);
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {STAGES.map((s, i) => {
        const reached = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s.id} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors",
                active
                  ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
                  : reached
                    ? "border-[var(--line)] bg-[var(--panel-2)] text-[var(--fg-dim)]"
                    : "border-[var(--line-soft)] bg-transparent text-[var(--fg-faint)] opacity-60"
              )}
            >
              <span className="text-[10px] tabular-nums">{i + 1}</span>
              {s.label}
            </div>
            {i < STAGES.length - 1 ? (
              <span
                className={cn(
                  "h-px w-3",
                  i < currentIdx ? "bg-[var(--accent)]/50" : "bg-[var(--line)]"
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { projects } = useBeacon();

  const totalSanctioned = projects.reduce((s, p) => s + p.sanctionedAmount, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spentAmount, 0);
  const active = projects.filter((p) => p.status === "Active").length;
  const atRisk = projects.filter((p) => p.risk !== "on-track").length;

  return (
    <div className="fade-up mx-auto max-w-6xl space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              CSR Project Lifecycle
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-dim)]">
              Every field update flows in from WhatsApp and lands here — structured
              and audit-ready.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Active projects"
          value={String(active)}
          sub="across 4 partner NGOs"
        />
        <Stat
          label="Sanctioned (FY)"
          value={parseCurrency(totalSanctioned)}
          sub="Section 135 eligible"
          accent="var(--accent)"
        />
        <Stat
          label="Spent to date"
          value={parseCurrency(totalSpent)}
          sub="auto-parsed from field updates"
          accent="var(--green)"
        />
        <Stat
          label="Diverging"
          value={String(atRisk)}
          sub="pace vs plan flags"
          accent={atRisk > 0 ? "var(--amber)" : "var(--green)"}
        />
      </div>

      <Panel>
        <PanelHeader
          title="Portfolio — Live Risk Map"
          subtitle="Pace-vs-plan divergence detection, not just deadline reminders."
          right={
            <div className="flex gap-2 text-[11px] text-[var(--fg-dim)]">
              <Chip tone="green">On track</Chip>
              <Chip tone="amber">Diverging</Chip>
            </div>
          }
        />
        <div className="space-y-3">
          {projects.map((p) => {
            const r = riskOf(p);
            const util = spendUtilization(p);
            return (
              <div
                key={p.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{p.name}</span>
                      <Chip
                        tone={
                          r.level === "on-track"
                            ? "green"
                            : r.level === "at-risk"
                              ? "amber"
                              : "red"
                        }
                      >
                        {r.label}
                      </Chip>
                      <Chip tone="neutral">{p.sector}</Chip>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[var(--fg-dim)]">
                      {p.partner} · {p.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--fg-faint)]">
                        Sanctioned
                      </div>
                      <div className="text-sm font-medium tabular-nums">
                        {parseCurrency(p.sanctionedAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--fg-faint)]">
                        Spent
                      </div>
                      <div className="text-sm font-medium tabular-nums text-[var(--green)]">
                        {parseCurrency(p.spentAmount)}
                        <span className="ml-1 text-[var(--fg-faint)]">({util}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <StageStrip current={p.currentStage} />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[var(--fg-faint)]">Pace vs plan</span>
                      <span className="tabular-nums">{p.pace}% → {p.workDone}% done</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${Math.min(100, p.workDone)}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[var(--fg-faint)]">Spend utilisation</span>
                      <span className="tabular-nums">{util}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          util > 90 ? "bg-[var(--amber)]" : "bg-[var(--green)]"
                        )}
                        style={{ width: `${Math.min(100, util)}%` }}
                      />
                    </div>
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