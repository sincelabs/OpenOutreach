import * as React from "react";

export type BadgeTone = "neutral" | "accent" | "ink" | "outline";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-mist text-muted",
  // accent-ink, not accent: this one carries text.
  accent: "bg-terrasoft text-terraink",
  ink: "bg-ink text-on-ink",
  outline: "border border-borderw text-muted",
};

/**
 * A short, static label: a count, a plan name, a version, a category.
 *
 * Not a `StatusChip`. A chip says what state something is *in* and carries a
 * dot so it survives greyscale; a badge just labels. If the thing you are
 * about to render can be "active" or "failed", it is a chip.
 *
 * Never interactive. A badge that can be clicked is a button that looks like a
 * label, and nobody clicks it.
 */
export function Badge({
  tone = "neutral",
  mono = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  /** For identifiers, versions, SHAs — anything a person reads character by character. */
  mono?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${
        mono ? "font-mono tracking-tight" : ""
      } ${TONES[tone]} ${className || ""}`}
    >
      {children}
    </span>
  );
}
