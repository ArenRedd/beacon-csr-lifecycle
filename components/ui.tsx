import { cn } from "@/lib/cn";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-sm font-semibold text-[var(--fg)]">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-[var(--fg-dim)]">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "accent";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/5 text-[var(--fg-dim)] border-white/10",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/25",
    red: "bg-red-500/10 text-red-300 border-red-500/25",
    accent: "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
  accent = "var(--fg)",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-2)] p-4">
      <div className="text-[11px] uppercase tracking-wide text-[var(--fg-faint)]">
        {label}
      </div>
      <div
        className="mt-1 text-2xl font-semibold tabular-nums"
        style={{ color: accent }}
      >
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-[var(--fg-dim)]">{sub}</div> : null}
    </div>
  );
}