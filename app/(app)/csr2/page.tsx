"use client";

import { useMemo } from "react";
import { useBeacon } from "@/lib/store";
import { buildCrs2 } from "@/lib/crs2";
import { Panel, PanelHeader, Chip } from "@/components/ui";
import { FileSignature, Download, Sparkles } from "lucide-react";

export default function Crs2() {
  const { projects } = useBeacon();

  const sections = useMemo(() => buildCrs2(projects), [projects]);

  return (
    <div className="fade-up mx-auto max-w-6xl space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              CSR-2 Annual Draft
            </h1>
            <p className="mt-1 text-sm text-[var(--fg-dim)]">
              Generated directly from lifecycle data — weeks of compliance
              compilation collapses to one click.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Chip tone="accent">
              <Sparkles size={11} /> Auto-drafted
            </Chip>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              <Download size={15} /> Export
            </button>
          </div>
        </div>
      </header>

      <Panel>
        <PanelHeader
          title="Statutory CSR-2 format (Companies Act, 2013 — Sec 135)"
          subtitle="Fields pulled straight from verified lifecycle records."
          right={<FileSignature className="text-[var(--fg-faint)]" size={18} />}
        />

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.name}>
              <h3 className="mb-2 text-sm font-semibold text-[var(--accent)]">
                {section.name}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--line)]">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {section.rows.map((row, rIdx) => {
                      const isSectionBHeader = section.name.includes("Section — B") && rIdx === 0;
                      const isSectionBRow = section.name.includes("Section — B") && rIdx > 0;
                      return (
                        <tr
                          key={rIdx}
                          className={
                            isSectionBRow
                              ? "border-t border-[var(--line)] bg-[var(--panel-2)]"
                              : rIdx === 0
                                ? "bg-white/[0.05]"
                                : "border-t border-[var(--line)]"
                          }
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={[
                                "px-3 py-2 align-top",
                                isSectionBRow && cIdx === 0
                                  ? "font-medium"
                                  : "",
                                typeof cell === "number"
                                  ? "tabular-nums"
                                  : "",
                              ].join(" ")}
                            >
                              <span
                                className={
                                  isSectionBHeader
                                    ? "text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-dim)]"
                                    : rIdx === 0 && !isSectionBHeader
                                      ? "text-xs font-medium text-[var(--fg-dim)]"
                                      : "text-[var(--fg)]"
                                }
                              >
                                {cell}
                              </span>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-200/90">
          <span className="font-semibold">Compliance note:</span> every figure above
          traces to a verified, hash-chained audit-log record — no number reaches
          this report unchecked.
        </div>
      </Panel>
    </div>
  );
}