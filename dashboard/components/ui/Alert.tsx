import * as React from "react";

import type { StatusTone } from "./StatusChip";

const TONES: Record<StatusTone, { bg: string; text: string; border: string }> = {
  success:   { bg: "var(--sl-success-bg)",   text: "var(--sl-success-text)",   border: "var(--sl-success-dot)" },
  attention: { bg: "var(--sl-attention-bg)", text: "var(--sl-attention-text)", border: "var(--sl-attention-dot)" },
  warning:   { bg: "var(--sl-warning-bg)",   text: "var(--sl-warning-text)",   border: "var(--sl-warning-dot)" },
  error:     { bg: "var(--sl-error-bg)",     text: "var(--sl-error-text)",     border: "var(--sl-error-dot)" },
  info:      { bg: "var(--sl-info-bg)",      text: "var(--sl-info-text)",      border: "var(--sl-info-dot)" },
  neutral:   { bg: "var(--sl-neutral-bg)",   text: "var(--sl-neutral-text)",   border: "var(--sl-border-strong)" },
};

/**
 * An inline message about the surface it sits on.
 *
 * `error` and `warning` announce themselves via `role="alert"`; the quieter
 * tones do not, so a page full of informational notes does not shout over a
 * screen reader on load.
 */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: StatusTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const c = TONES[tone];
  const assertive = tone === "error" || tone === "warning";

  return (
    <div
      role={assertive ? "alert" : undefined}
      className={`rounded-[10px] border-l-2 px-3.5 py-3 text-[13px] leading-relaxed ${className || ""}`}
      style={{ background: c.bg, color: c.text, borderLeftColor: c.border }}
    >
      {title && <p className="mb-0.5 font-medium">{title}</p>}
      {children}
    </div>
  );
}
