"use client";

import * as React from "react";

/**
 * A short hint attached to a control.
 *
 * Three rules, all of which the CSS-only `:hover` tooltip breaks:
 *
 * 1. **It opens on focus, not just hover.** A keyboard user who cannot see it
 *    cannot use it.
 * 2. **It is never the only place the information exists.** Content that
 *    matters goes on the page. A tooltip is unreachable on touch, invisible in
 *    print, and gone the moment the pointer moves.
 * 3. **It describes; it does not label.** The bubble is wired with
 *    `aria-describedby`, so the control keeps its own accessible name.
 *
 * Escape closes it while the trigger keeps focus — otherwise a bubble covering
 * the next control cannot be dismissed without moving the mouse.
 */
export function Tooltip({
  content,
  side = "top",
  children,
}: {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  /** The trigger. Must itself be focusable — a button, a link, an input. */
  children: React.ReactElement<{ "aria-describedby"?: string }>;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  const position =
    side === "bottom" ? "top-full left-1/2 -translate-x-1/2 mt-2"
    : side === "left" ? "right-full top-1/2 -translate-y-1/2 mr-2"
    : side === "right" ? "left-full top-1/2 -translate-y-1/2 ml-2"
    : "bottom-full left-1/2 -translate-x-1/2 mb-2";

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {React.cloneElement(children, { "aria-describedby": open ? id : undefined })}

      {open && (
        <span
          role="tooltip"
          id={id}
          className={`sl-animate-rise pointer-events-none absolute z-50 w-max max-w-[240px] rounded-[7px] bg-ink px-2.5 py-1.5 text-[12px] leading-snug text-on-ink shadow-lifted ${position}`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

/**
 * The question-mark affordance that carries a `Tooltip`.
 *
 * The button has a real accessible name ("More information"), so a screen
 * reader reaches it and hears the hint as its description rather than landing
 * on an unlabelled icon.
 */
export function InfoTip({ children, side = "top" }: { children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <Tooltip content={children} side={side}>
      <button
        type="button"
        aria-label="More information"
        className="sl-transition sl-focus-ring inline-flex cursor-help items-center rounded-full text-muted hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </button>
    </Tooltip>
  );
}
