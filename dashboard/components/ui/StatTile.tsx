import * as React from "react";

export function StatGrid({
  columns = 4,
  className,
  children,
}: {
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
}) {
  const cols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 xl:grid-cols-4";
  return <dl className={`grid grid-cols-1 gap-4 ${cols} ${className || ""}`}>{children}</dl>;
}

/**
 * A single headline figure.
 *
 * Rendered as a `dt`/`dd` pair so a screen reader reads the label together with
 * its value rather than as two unrelated blocks. Figures are `tabular-nums` so
 * a column of them lines up.
 */
export function StatTile({
  label,
  value,
  hint,
  accent = false,
  footer,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  accent?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[16px] border p-5 shadow-raised ${
        accent
          ? "border-terra/25 bg-[linear-gradient(160deg,rgba(196,96,42,0.10),rgba(196,96,42,0.02))]"
          : "border-borderl bg-white"
      }`}
    >
      <dt className="text-[12px] font-medium tracking-[0.06em] text-muted uppercase">{label}</dt>
      <dd className="mt-2 text-[26px] leading-none font-semibold tabular-nums text-ink">{value}</dd>
      {hint && <p className="mt-2 text-[12.5px] leading-snug text-muted">{hint}</p>}
      {footer && <div className="mt-3">{footer}</div>}
    </div>
  );
}
