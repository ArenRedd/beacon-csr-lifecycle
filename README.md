# Beacon — CSR Lifecycle Bridge

**Hackathon prototype (Wildcard Track — CSR Project Lifecycle Management).**

Turns scattered WhatsApp updates from CSR field partners into audit-ready,
compliance-linked project records. A dashboard alone doesn't fix bad data —
so Beacon fixes data capture at the source: field partners text/photo/voice
updates, a parsing layer structures them, and every change lands in a
tamper-evident audit chain that directly feeds the statutory CSR-2 report.

## Pages

| Route      | What it shows                                                        |
| ---------- | -------------------------------------------------------------------- |
| `/`        | Lifecycle dashboard: projects, pace-vs-plan risk flags, spend        |
| `/intake`  | WhatsApp intake: parsed fields, verify / needs-review flow, simulator |
| `/audit`   | Hash-chained block log (Section 135 audit support)                   |
| `/csr2`    | Auto-drafted statutory CSR-2 report (Sections A–E)                   |

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript
- Tailwind CSS v4
- lucide-react icons

> Demo-only: intake, parsing confidence, and timestamps are simulated
> client-side. No live Twilio/Claude/Postgres wiring in this slice.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Verify: `npm run lint` and `npm run build` both pass.