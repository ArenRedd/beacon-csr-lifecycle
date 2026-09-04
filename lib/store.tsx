"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { SEED_PROJECTS } from "./seed";
import { WAIT_SOURCE_SIMULATOR } from "./parse";
import { shortHash } from "./chain";
import type { ParsedUpdate, Project } from "./types";

interface BeaconState {
  projects: Project[];
  updates: ParsedUpdate[];
  intakePool: (typeof WAIT_SOURCE_SIMULATOR)[number][];
  verify: (id: string) => void;
  consumeUpdate: (item: (typeof WAIT_SOURCE_SIMULATOR)[number]) => void;
  ingest: (text: string, type: "text" | "voice" | "photo") => void;
}

const BeaconCtx = createContext<BeaconState | null>(null);

// Derive an initial parsed update list from the simulator pool.
function seedUpdates(): ParsedUpdate[] {
  return WAIT_SOURCE_SIMULATOR.map((item, i) => {
    const needsReview = item.evoParsed.some((f) => f.key === "flag");
    return {
      ...item,
      parsed: item.evoParsed,
      needsReview,
      reviewReason: needsReview
        ? "Missing supporting records for 12 patients flagged by parser."
        : undefined,
      state: needsReview ? "pending-review" : "unverified",
      verifiedBy: undefined,
      verifiedAt: undefined,
      hash: shortHash(`${i}-${item.raw}`),
      previousHash: i === 0 ? "genesis" : shortHash(`${i - 1}-${WAIT_SOURCE_SIMULATOR[i - 1].raw}`),
      block: i + 1,
    };
  });
}

export function BeaconProvider({ children }: { children: ReactNode }) {
  const [projects] = useState<Project[]>(SEED_PROJECTS);
  const [updates, setUpdates] = useState<ParsedUpdate[]>(() => seedUpdates());
  const [intakePool, setIntakePool] = useState<
    (typeof WAIT_SOURCE_SIMULATOR)[number][]
  >(WAIT_SOURCE_SIMULATOR.slice(4));

  function verify(id: string) {
    setUpdates((all) =>
      all.map((u) =>
        u.id === id
          ? { ...u, state: "verified" as const, verifiedBy: "CSR Manager", verifiedAt: new Date().toISOString() }
          : u
      )
    );
  }

  function consumeUpdate(item: (typeof WAIT_SOURCE_SIMULATOR)[number]) {
    const exists = updates.some((u) => u.id === item.id);
    if (exists) return;
    const needsReview = item.evoParsed.some((f) => f.key === "flag");
    const newUpdate: ParsedUpdate = {
      ...item,
      parsed: item.evoParsed,
      needsReview,
      reviewReason: needsReview
        ? "Missing supporting records flagged by parser."
        : undefined,
      state: needsReview ? "pending-review" : "unverified",
      verifiedBy: undefined,
      verifiedAt: undefined,
      hash: shortHash(`${Date.now()}-${item.raw}`),
      previousHash: updates[updates.length - 1]?.hash ?? "genesis",
      block: updates.length + 1,
    };
    setUpdates((all) => [...all, newUpdate]);
    setIntakePool((pool) => pool.filter((p) => p.id !== item.id));
  }

  function ingest(text: string, type: "text" | "voice" | "photo") {
    const id = `manual-${Date.now()}`;
    const mock: (typeof WAIT_SOURCE_SIMULATOR)[number] = {
      id,
      projectId: "prj-01",
      from: "Demo operator",
      type,
      at: new Date().toISOString(),
      raw: text || `[${type}] demo update`,
      evoParsed: [
        { key: "milestone", label: "Milestone", value: "Captured via simulator", confidence: 0.9 },
        { key: "note", label: "Note", value: text, confidence: 0.85 },
      ],
    };
    consumeUpdate(mock);
  }

  return (
    <BeaconCtx.Provider
      value={{ projects, updates, intakePool, verify, consumeUpdate, ingest }}
    >
      {children}
    </BeaconCtx.Provider>
  );
}

export function useBeacon() {
  const ctx = useContext(BeaconCtx);
  if (!ctx) throw new Error("useBeacon must be used within BeaconProvider");
  return ctx;
}