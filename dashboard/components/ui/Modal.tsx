"use client";

import * as React from "react";

import { Button } from "./Button";

/**
 * A modal built on the native `<dialog>` element.
 *
 * `showModal()` puts the dialog in the browser's **top layer**, outside the
 * document flow entirely, so no ancestor's `overflow` can clip it. That is not
 * a nicety: a popover rendered inside a `Card` with `overflow-hidden` is cut
 * off at the card's edge with no way to reach the confirm button, and wrapping
 * the card in `overflow-x-auto` makes it worse — CSS forces the other axis to
 * `auto` when one axis is not `visible`, so the card sprouts its own scrollbar.
 *
 * The element also brings the focus trap, the Escape handler, `aria-modal` and
 * inert-ing of the page behind it, all of which a hand-rolled div has to
 * reimplement and usually half-implements.
 *
 * Per docs/08-motion.md a modal appears **instantly**. It is a mode change; a
 * fade makes the whole application feel slow.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = "md",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // `open` as a prop would render an inline, non-modal dialog. The modal
    // behaviour only exists behind the method call.
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const width =
    size === "sm"
      ? "w-[min(400px,calc(100vw-2rem))]"
      : size === "lg"
        ? "w-[min(720px,calc(100vw-2rem))]"
        : "w-[min(540px,calc(100vw-2rem))]";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      // Escape fires `cancel` before `close`; both route to the same handler so
      // the parent's state cannot drift out of sync with the element's.
      onCancel={onClose}
      onClose={onClose}
      // The dialog box is a child of this element, so a click that lands on the
      // element itself landed on the backdrop.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`m-auto ${width} rounded-[16px] border border-borderl bg-white p-0 text-left text-body shadow-overlay backdrop:bg-scrim`}
    >
      {/* `m-auto` above is not decoration: the UA stylesheet centres a modal
          with `margin: auto`, and Tailwind's preflight resets it to 0, which
          parks the dialog in the top-left corner of the viewport. */}
      <div className="flex items-start justify-between gap-4 border-b border-borderl px-5 py-4">
        <div className="min-w-0">
          <h2 id={titleId} className="font-lora text-[17px] font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p id={descId} className="mt-1 text-[13px] leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="sl-transition sl-focus-ring -mt-1 -mr-1 shrink-0 cursor-pointer rounded-md p-1.5 text-muted hover:bg-mist hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {children && <div className="px-5 py-4 text-[13.5px] leading-relaxed">{children}</div>}

      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-borderl bg-paper px-5 py-3.5">
          {footer}
        </div>
      )}
    </dialog>
  );
}

/**
 * Confirmation for an action that cannot be undone.
 *
 * The confirm button is `destructive` and its label names the action —
 * "Delete organization", never "OK". A person who reads only the button must
 * still know what they are agreeing to, because that is what a person in a
 * hurry actually reads.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  pending = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  /** Names the action. Not "OK", not "Confirm". */
  confirmLabel: string;
  cancelLabel?: string;
  pending?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={pending}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" size="md" onClick={onConfirm} disabled={pending}>
            {pending ? "Working…" : confirmLabel}
          </Button>
        </>
      }
    >
      {description}
    </Modal>
  );
}
