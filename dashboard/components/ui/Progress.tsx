import * as React from "react";

/**
 * How far along something is.
 *
 * Determinate whenever you can say. `progressbar` with no `aria-valuenow` is
 * how a screen reader is told the total is unknown, so the indeterminate case
 * is a real state rather than a styling variant — pass `value={null}` and mean
 * it. A bar that claims 90% and sits there is worse than one that admits it
 * does not know.
 */
export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  tone = "accent",
  className,
}: {
  /** 0…max, or null when the total is genuinely unknown. */
  value: number | null;
  max?: number;
  /** Required: a bar with no label describes nothing. */
  label: string;
  showValue?: boolean;
  tone?: "accent" | "success" | "neutral";
  className?: string;
}) {
  const fill =
    tone === "success"
      ? "var(--sl-success-dot)"
      : tone === "neutral"
        ? "var(--sl-ink-muted)"
        : "var(--sl-accent)";

  const pct = value === null ? null : Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className={className}>
      {(showValue || label) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] text-muted">{label}</span>
          {showValue && pct !== null && (
            <span className="text-[12.5px] tabular-nums text-ink">{Math.round(pct)}%</span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value ?? undefined}
        className="h-[6px] w-full overflow-hidden rounded-full bg-mist"
      >
        {pct === null ? (
          // A 25%-wide bar travelling across the track. It never reports a
          // number, because there isn't one.
          <span className="sl-animate-track block h-full w-1/4 rounded-full" style={{ background: fill }} />
        ) : (
          // scaleX, not width. docs/08-motion.md 8.3 rules out animating
          // width — it re-lays out on every frame — and a bar is the one
          // place the temptation is strongest.
          <span
            className="sl-transition-move block h-full w-full origin-left rounded-full"
            style={{ transform: `scaleX(${pct / 100})`, background: fill }}
          />
        )}
      </div>
    </div>
  );
}
