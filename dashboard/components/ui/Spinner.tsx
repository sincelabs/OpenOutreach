import * as React from "react";

/**
 * The busy indicator. One second, linear, forever.
 *
 * Two rules from docs/08-motion.md are baked in here rather than left to the
 * caller. The rotation is linear — an eased spin visibly stutters once a
 * revolution. And under `prefers-reduced-motion` it stops dead and drops to
 * 65% opacity (see `.sl-animate-spin` in tokens/since-motion.css): a 0.01ms
 * infinite rotation does not stop, it strobes.
 *
 * Prefer `Skeleton` for content that has a shape, and prefer *nothing* at all
 * under ~300ms — a spinner that flashes for one frame reads as a glitch.
 */
export function Spinner({
  size = 16,
  label = "Loading",
  className,
}: {
  size?: number;
  /** Announced to screen readers. Set to null on a spinner inside a labelled button. */
  label?: string | null;
  className?: string;
}) {
  return (
    <span role={label ? "status" : undefined} className={`inline-flex items-center ${className || ""}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="sl-animate-spin"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
