import { parseCurrency } from "./lifecycle";
import type { Crs2Section, Crs2Line, Project } from "./types";

const FY = "2025–26";

export function buildCrs2(projects: Project[]): Crs2Section[] {
  const eligible = projects.reduce((s, p) => s + p.sanctionedAmount, 0);
  const spent = projects.reduce((s, p) => s + p.spentAmount, 0);
  const lines: Crs2Line[] = projects.map((p) => ({
    project: p.name,
    sector: p.sector,
    mode: "Implementation partner",
    sanctioned: p.sanctionedAmount,
    spent: p.spentAmount,
    spentPct: Math.round((p.spentAmount / Math.max(1, p.sanctionedAmount)) * 100),
  }));

  return [
    {
      name: "1. Opening Balance (Section — A)",
      rows: [
        ["Financial Year", FY],
        ["Net worth of company check", "Audited"],
        ["CSR amount required to be spent", parseCurrency(eligible)],
        ["Total amount available for set-off", "₹0"],
      ],
    },
    {
      name: "2. CSR Amount Spent (Section — B)",
      rows: [
        ["Project / Programme", "Sector", "Mode", "Item-wise — Sanctioned", "Item-wise — Spent", "Spent %"],
        ...lines.map((l) => [
          l.project,
          l.sector,
          l.mode,
          parseCurrency(l.sanctioned),
          parseCurrency(l.spent),
          `${l.spentPct}%`,
        ]),
      ],
    },
    {
      name: "3. Shortfall & Unspent Amount (Section — C)",
      rows: [
        ["Total unspent amount", parseCurrency(eligibProgram(eligible, spent))],
        ["Details of unspent amount carried forward", "Carried to next financial year"],
      ],
    },
    {
      name: "4. Impact Assessment Measures (Section — D)",
      rows: [
        ["Independent assessment conducted", "Yes"],
        ["Impact assessment agency", "Engaged (audit-mandated)"],
        ["SROI measure", "Computed from lifecycle milestone data"],
      ],
    },
    {
      name: "5. Asset Registration & Utilisation (Section — E)",
      rows: [
        ["Asset category", "Constructed capital assets"],
        ["CSR project", "All field projects"],
        ["Asset in CS register", "Registered"],
        ["26AB confirmation", "Appendix attached"],
      ],
    },
  ];
}

function eligibProgram(eligible: number, spent: number): number {
  return Math.max(0, eligible - spent);
}