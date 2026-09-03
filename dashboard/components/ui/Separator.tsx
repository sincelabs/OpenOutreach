import * as React from "react";

/**
 * A hairline rule.
 *
 * Decorative by default — `role="none"` — because a border between two cards
 * is not information, and a screen reader announcing "separator" between every
 * pair of rows is noise. Pass `semantic` only where the rule genuinely divides
 * two groups a listener needs to know are different.
 */
export function Separator({
  orientation = "horizontal",
  semantic = false,
  className,
  label,
}: {
  orientation?: "horizontal" | "vertical";
  semantic?: boolean;
  className?: string;
  /** Renders the rule as a labelled divider, e.g. "or". Implies `semantic`. */
  label?: React.ReactNode;
}) {
  if (label) {
    return (
      <div role="separator" aria-orientation="horizontal" className={`flex items-center gap-3 ${className || ""}`}>
        <span aria-hidden="true" className="h-px flex-1 bg-borderl" />
        <span className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-borderl" />
      </div>
    );
  }

  return (
    <div
      role={semantic ? "separator" : "none"}
      aria-orientation={semantic ? orientation : undefined}
      className={`bg-borderl ${
        orientation === "vertical" ? "w-px self-stretch" : "h-px w-full"
      } ${className || ""}`}
    />
  );
}
