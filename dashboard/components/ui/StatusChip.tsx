import * as React from "react";

export type StatusTone = "success" | "attention" | "warning" | "error" | "info" | "neutral";

/**
 * Which tone does a raw status string belong to?
 *
 * Centralised so a new status value cannot silently render as neutral in one
 * table and as success in another.
 */
const TONE_BY_STATUS: Record<string, StatusTone> = {
  active: "success", success: "success", approved: "success", live: "success", complete: "success",
  pending: "attention", waiting: "attention", review: "attention", attention: "attention", partial: "attention",
  warning: "warning", degraded: "warning", stale: "warning",
  rejected: "error", disabled: "error", error: "error", cancelled: "error", failed: "error", suspended: "error",
  info: "info", internal: "info", draft: "info",
  inactive: "neutral", retired: "neutral", archived: "neutral", unknown: "neutral",
};

const TONES: Record<StatusTone, { bg: string; text: string; dot: string }> = {
  success:   { bg: "var(--sl-success-bg)",   text: "var(--sl-success-text)",   dot: "var(--sl-success-dot)" },
  attention: { bg: "var(--sl-attention-bg)", text: "var(--sl-attention-text)", dot: "var(--sl-attention-dot)" },
  warning:   { bg: "var(--sl-warning-bg)",   text: "var(--sl-warning-text)",   dot: "var(--sl-warning-dot)" },
  error:     { bg: "var(--sl-error-bg)",     text: "var(--sl-error-text)",     dot: "var(--sl-error-dot)" },
  info:      { bg: "var(--sl-info-bg)",      text: "var(--sl-info-text)",      dot: "var(--sl-info-dot)" },
  neutral:   { bg: "var(--sl-neutral-bg)",   text: "var(--sl-neutral-text)",   dot: "var(--sl-neutral-dot)" },
};

export function toneForStatus(status: string): StatusTone {
  return TONE_BY_STATUS[status.toLowerCase()] ?? "neutral";
}

/**
 * State as a chip.
 *
 * The dot is not decoration: it is the redundant, non-colour channel that lets
 * the chip work in greyscale and for a colour-blind reader. Never ship a
 * status pill that is a bare colour swatch.
 */
export function StatusChip({
  status,
  tone,
  label,
  className,
}: {
  status?: string;
  tone?: StatusTone;
  label?: string;
  className?: string;
}) {
  const resolved = tone ?? toneForStatus(status ?? "unknown");
  const c = TONES[resolved];
  const text = label ?? (status ? status.charAt(0).toUpperCase() + status.slice(1) : resolved);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${className || ""}`}
      style={{ background: c.bg, color: c.text }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: c.dot }}
      />
      {text}
    </span>
  );
}
