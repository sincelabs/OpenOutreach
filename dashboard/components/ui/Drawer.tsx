"use client";

import * as React from "react";

/**
 * A panel that slides in from an edge.
 *
 * The one place in this brand where something travels a full screen width, and
 * the one place `translateX` is sanctioned (docs/08-motion.md 8.4): 200ms, with
 * the backdrop fading over the same duration so they read as one movement.
 *
 * It is *not* a modal `<dialog>`, deliberately — the commonest drawer is a
 * mobile navigation rail, and making the rest of the page inert is wrong for
 * navigation. That means the focus trap is ours: `Tab` cycles inside the panel
 * while it is open, focus moves in on open and returns to the trigger on close.
 * A drawer you can tab out of leaves a keyboard user typing into a page they
 * cannot see.
 */
export function Drawer({
  open,
  onClose,
  title,
  side = "left",
  width = 300,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  width?: number;
  children: React.ReactNode;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const returnFocusTo = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    returnFocusTo.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusable = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    // Focus the panel itself rather than its first link: the reader should hear
    // the drawer's name before its contents.
    panel?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnFocusTo.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="sl-animate-fade fixed inset-0 z-40 bg-scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        // The keyframe reads its starting edge from this variable, so one
        // animation serves both sides. See tokens/since-motion.css.
        style={{ width, ["--sl-slide-from" as string]: side === "right" ? "100%" : "-100%" } as React.CSSProperties}
        className={`sl-animate-slide fixed inset-y-0 z-50 flex max-w-[calc(100vw-3rem)] flex-col overflow-y-auto bg-base shadow-overlay outline-none ${
          side === "left" ? "left-0 border-r" : "right-0 border-l"
        } border-borderl`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-borderl px-4 py-3">
          <h2 id={titleId} className="text-[14px] font-semibold text-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="sl-transition sl-focus-ring cursor-pointer rounded-md p-1.5 text-muted hover:bg-mist hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </>
  );
}
