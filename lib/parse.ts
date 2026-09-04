import { sha256, shortHash } from "./chain";
import type { ParsedField, ParsedUpdate, UpdateType } from "./types";

// A fake inbox of simulated WhatsApp updates for the demo.
export const WAIT_SOURCE_SIMULATOR: {
  id: string;
  projectId: string;
  from: string;
  type: UpdateType;
  at: string;
  raw: string;
  evoParsed: ParsedField[];
}[] = [
  {
    id: "in-001",
    projectId: "prj-01",
    from: "Lakshmi (Field Officer)",
    type: "photo",
    at: "2026-09-04T11:02:00Z",
    raw: "[Image: receipt_IMG_7721.jpg] — “Rs 4,52,300 spent on roof material for the school block, paid by HL Trust account.”",
    evoParsed: [
      { key: "amount", label: "Amount", value: "₹4,52,300", confidence: 0.97 },
      { key: "category", label: "Category", value: "Construction material", confidence: 0.94 },
      { key: "milestone", label: "Milestone", value: "Implementation — civil works", confidence: 0.91 },
      { key: "payer", label: "Payer", value: "HL Foundation Trust acct.", confidence: 0.88 },
    ],
  },
  {
    id: "in-002",
    projectId: "prj-02",
    from: "Rajesh (Village Coordinator)",
    type: "voice",
    at: "2026-09-04T12:40:00Z",
    raw: "[voice: 0:21] — “Progress on the water tanks is about 60 percent done. The second tank wall is up and they are doing the roof. I think we'll finish on schedule.”",
    evoParsed: [
      { key: "milestone", label: "Milestone", value: "Implementation — 60% complete", confidence: 0.9 },
      { key: "progress", label: "Work done", value: "60%", confidence: 0.89 },
      { key: "schedule", label: "Schedule signal", value: "On schedule", confidence: 0.84 },
    ],
  },
  {
    id: "in-003",
    projectId: "prj-01",
    from: "Lakshmi (Field Officer)",
    type: "text",
    at: "2026-09-05T08:15:00Z",
    raw: "Teacher training session concluded today with 32 teachers. Attendance sheet attached. All 4 modules delivered.",
    evoParsed: [
      { key: "activity", label: "Activity", value: "Teacher training session", confidence: 0.96 },
      { key: "attendees", label: "Attendees", value: "32", confidence: 0.93 },
      { key: "milestone", label: "Milestone", value: "Implementation — training delivered", confidence: 0.9 },
    ],
  },
  {
    id: "in-004",
    projectId: "prj-03",
    from: "Meena (Campus NGO)",
    type: "text",
    at: "2026-09-05T09:30:00Z",
    raw: "35th medical camp done at Vandana colony. 210 patients screened. Some papers missing for 12 patients, will follow up.",
    evoParsed: [
      { key: "activity", label: "Activity", value: "Medical camp #35", confidence: 0.96 },
      { key: "patients", label: "Patients screened", value: "210", confidence: 0.95 },
      { key: "flag", label: "Flag", value: "12 records missing — needs review", confidence: 0.82 },
    ],
  },
  {
    id: "in-005",
    projectId: "prj-02",
    from: "Rajesh (Village Coordinator)",
    type: "photo",
    at: "2026-09-05T13:05:00Z",
    raw: "[Image: payment_receipt_w_4481.jpg] — “Installed pipe purchase from Ray Suppliers, Rs 1,18,900.”",
    evoParsed: [
      { key: "amount", label: "Amount", value: "₹1,18,900", confidence: 0.95 },
      { key: "category", label: "Category", value: "Piping material", confidence: 0.92 },
      { key: "partner", label: "Partner", value: "Ray Suppliers", confidence: 0.89 },
    ],
  },
];

let prevHashes: string[] = [];
async function digestFor(block: number, raw: string): Promise<string> {
  const full = await sha256(`${block}:${raw}:${prevHashes[block - 1] ?? "root"}`);
  return full;
}

export async function parseUpdates(): Promise<ParsedUpdate[]> {
  const parsed: ParsedUpdate[] = [];
  prevHashes = [""];
  for (let i = 0; i < WAIT_SOURCE_SIMULATOR.length; i++) {
    const item = WAIT_SOURCE_SIMULATOR[i];
    const block = i + 1;
    const previousHash = i === 0 ? "genesis".padEnd(16, "0") : (await digestFor(i, WAIT_SOURCE_SIMULATOR[i - 1].raw));
    const hash = await digestFor(block, item.raw);
    prevHashes.push(hash);
    const needsReview = item.evoParsed.some((f) => f.key === "flag");
    parsed.push({
      ...item,
      parsed: item.evoParsed,
      needsReview,
      reviewReason: needsReview
        ? "Missing supporting records for 12 patients flagged by parser."
        : undefined,
      state: needsReview ? "pending-review" : "unverified",
      verifiedBy: undefined,
      verifiedAt: undefined,
      hash: shortHash(hash),
      previousHash: i === 0 ? "genesis" : shortHash(previousHash),
      block,
    });
  }
  return parsed;
}