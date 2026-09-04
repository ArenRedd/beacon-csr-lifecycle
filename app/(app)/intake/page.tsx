"use client";

import { useState } from "react";
import { useBeacon } from "@/lib/store";
import { Panel, PanelHeader, Chip } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  Camera,
  Mic,
  Type,
  Check,
  ShieldCheck,
  Sparkles,
  Inbox,
} from "lucide-react";

export default function Intake() {
  const { updates, intakePool, verify, consumeUpdate } = useBeacon();
  const [draft, setDraft] = useState("");

  const pendingReview = updates.filter((u) => u.state === "pending-review").length;

  function sendManual() {
    if (!draft.trim()) return;
    consumeUpdate({
      id: `manual-${Date.now()}`,
      projectId: "prj-01",
      from: "Demo operator",
      type: "text",
      at: new Date().toISOString(),
      raw: draft.trim(),
      evoParsed: [
        { key: "milestone", label: "Milestone", value: "Manual capture", confidence: 1 },
        { key: "note", label: "Note", value: draft.trim(), confidence: 1 },
      ],
    });
    setDraft("");
  }

  const typeIcon = {
    text: <Type size={14} />,
    photo: <Camera size={14} />,
    voice: <Mic size={14} />,
  };

  return (
    <div className="fade-up mx-auto max-w-6xl space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              WhatsApp Intake
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-dim)]">
              Field partners text updates — the parsing layer turns them into
              structured, auditable records.
            </p>
          </div>
          <Chip tone={pendingReview > 0 ? "amber" : "green"} className="ml-auto">
            {pendingReview > 0
              ? `${pendingReview} awaiting review`
              : "All clear"}
          </Chip>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: incoming feed */}
        <Panel className="flex flex-col">
          <PanelHeader
            title="Inbox — latest field updates"
            subtitle="Automatically structured on arrival."
            right={<Inbox size={16} className="text-[var(--fg-faint)]" />}
          />
          <div className="space-y-4">
            {updates.map((u) => (
              <div key={u.id} className="fade-up space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--fg-faint)]">
                    <span>{typeIcon[u.type]}</span>
                    <span className="text-[var(--fg-dim)]">{u.from}</span>
                    <span>· block #{u.block}</span>
                  </div>
                  <Chip
                    tone={
                      u.state === "verified"
                        ? "green"
                        : u.state === "pending-review"
                          ? "amber"
                          : "neutral"
                    }
                  >
                    {u.state === "verified"
                      ? "Verified"
                      : u.state === "pending-review"
                        ? "Needs review"
                        : "Unverified"}
                  </Chip>
                </div>

                <div className="rounded-xl rounded-tr-sm border border-[var(--line)] bg-[var(--panel-2)] px-3.5 py-2.5 text-sm text-[var(--fg)]">
                  {u.raw || `[${u.type}] field update`}
                </div>

                <div className="rounded-xl bg-white/[0.03] p-3">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] text-[var(--fg-faint)]">
                    <Sparkles size={12} className="text-[var(--accent)]" />
                    Parsed fields
                  </div>
                  <div className="space-y-1.5">
                    {u.parsed.map((f) => (
                      <div key={f.key} className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-[var(--fg-dim)]">{f.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{f.value}</span>
                          <span
                            className={cn(
                              "tabular-nums",
                              f.confidence >= 0.9
                                ? "text-[var(--green)]"
                                : "text-[var(--amber)]"
                            )}
                          >
                            {Math.round(f.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {u.needsReview ? (
                    <div className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1.5 text-[11px] text-amber-200/90">
                      {u.reviewReason}
                    </div>
                  ) : null}

                  <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.06] pt-2">
                    <span className="text-[11px] font-mono text-[var(--fg-faint)]">
                      {u.previousHash.slice(0, 8)} ·· {u.hash.slice(0, 8)}
                    </span>
                    {u.state !== "verified" ? (
                      <button
                        onClick={() => verify(u.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--panel-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-dim)] transition-colors hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        <Check size={12} />
                        Verify
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-300">
                        <ShieldCheck size={12} />
                        {u.verifiedBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Right: simulator / pending pool */}
        <div className="space-y-6">
          <Panel>
            <PanelHeader
              title="Intake Simulator"
              subtitle="Drain the in-flight queue into the lifecycle. Watch it land on the dashboard."
            />
            {intakePool.length === 0 ? (
              <p className="text-sm text-[var(--fg-dim)]">
                Queue drained — new field updates flow straight in as parsed
                records.
              </p>
            ) : (
              <div className="space-y-2.5">
                {intakePool.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-[var(--fg-dim)]">
                        {typeIcon[item.type]}
                        {item.from}
                      </div>
                      <button
                        onClick={() => consumeUpdate(item)}
                        className="rounded-lg border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium text-[var(--fg-dim)] transition-colors hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                      >
                        Ingest →
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--fg-dim)] line-clamp-2">
                      {item.raw}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel>
            <PanelHeader
              title="Manual capture"
              subtitle="Stands in for a partner's voice note / text drop."
            />
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendManual();
                }}
                placeholder='e.g. "Training done, 32 teachers, day 4 module delivered"'
                className="flex-1 rounded-xl border border-[var(--line)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)]/50 focus:outline-none"
              />
              <button
                onClick={sendManual}
                className="rounded-xl bg-[var(--accent)] px-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Send
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}