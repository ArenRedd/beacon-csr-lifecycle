export type StageId =
  | "proposal"
  | "evaluation"
  | "approval"
  | "funding"
  | "implementation"
  | "monitoring"
  | "closure";

export const STAGES: { id: StageId; label: string; index: number }[] = [
  { id: "proposal", label: "Proposal", index: 0 },
  { id: "evaluation", label: "Evaluation", index: 1 },
  { id: "approval", label: "Approval", index: 2 },
  { id: "funding", label: "Funding", index: 3 },
  { id: "implementation", label: "Implementation", index: 4 },
  { id: "monitoring", label: "Monitoring", index: 5 },
  { id: "closure", label: "Closure", index: 6 },
];

export type RiskLevel = "on-track" | "at-risk" | "off-track";

export interface Project {
  id: string;
  name: string;
  partner: string;
  sector: string;
  sanctionedAmount: number;
  spentAmount: number;
  currentStage: StageId;
  startDate: string;
  plannedEndDate: string;
  pace: number; // % of elapsed time consumed vs plan
  workDone: number; // % of planned work delivered
  risk: RiskLevel;
  status: string;
}

export interface WaitSource {
  label: string;
  author: string;
  title: string;
  year: string;
  contribution: string;
  borrowed: "Borrowed" | "Yours";
  license: string;
}

export type UpdateType = "text" | "photo" | "voice";

export interface IncomingUpdate {
  id: string;
  projectId: string;
  from: string;
  type: UpdateType;
  raw: string;
  note?: string;
  at: string;
}

export interface ParsedField {
  key: string;
  label: string;
  value: string;
  confidence: number;
}

export interface ParsedUpdate extends IncomingUpdate {
  parsed: ParsedField[];
  needsReview: boolean;
  reviewReason?: string;
  state: "pending-review" | "unverified" | "verified";
  verifiedBy?: string;
  verifiedAt?: string;
  hash: string;
  previousHash: string;
  block: number;
}

export interface AuditEntry {
  block: number;
  hash: string;
  previousHash: string;
  projectId: string;
  action: string;
  actor: string;
  detail: string;
  at: string;
}

export interface Crs2DraftConfig {
  financialYear: string;
  eligibleAmount: number;
  spentAmount: number;
  spentPct: number;
  attrition: number;
}

export interface Crs2Section {
  name: string;
  rows: (string | number)[][];
}

export interface Crs2Line {
  project: string;
  sector: string;
  mode: string;
  sanctioned: number;
  spent: number;
  spentPct: number;
}