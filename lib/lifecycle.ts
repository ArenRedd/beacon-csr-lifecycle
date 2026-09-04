import { STAGES } from "./types";
import type { Project, RiskLevel, StageId } from "./types";

export function stageIndex(id: StageId): number {
  return STAGES.find((s) => s.id === id)!.index;
}

export function riskOf(p: Project): { level: RiskLevel; label: string } {
  // Compare elapsed-time consumed (pace) vs work actually done (workDone).
  const elapsed = p.pace;
  const delta = elapsed - p.workDone;
  if (delta <= 5) return { level: "on-track", label: "On track" };
  if (delta <= 18) return { level: "at-risk", label: "Diverging from plan" };
  return { level: "off-track", label: "Off plan" };
}

export function spendUtilization(p: Project): number {
  if (p.sanctionedAmount <= 0) return 0;
  return Math.round((p.spentAmount / p.sanctionedAmount) * 100);
}

export function parseCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Recompute risk from live project values (used after simulator actions).
export function projectWithRisk(p: Project): Project {
  return { ...p, risk: riskOf(p).level };
}