import * as React from "react";

/**
 * The label / hint / error scaffold every form control shares.
 *
 * Pulled out because the wiring — not the styling — is the part that gets
 * dropped. A hint rendered as a loose `<p>` under an input is read by a screen
 * reader as unrelated text somewhere after the field, so the user hears
 * "Email, edit text" and then, three tab stops later, the rule they needed
 * before typing. `aria-describedby` is what makes it part of the field.
 *
 * Controls call `useFieldIds` for the ids and render `<Field>` around
 * themselves; nothing has to remember the pattern twice.
 */

export interface FieldIds {
  controlId: string;
  hintId?: string;
  errorId: string | undefined;
  /** Pass straight to the control's `aria-describedby`. */
  describedBy: string | undefined;
}

export function useFieldIds({
  id,
  hint,
  error,
}: {
  id?: string;
  hint?: React.ReactNode;
  error?: string;
}): FieldIds {
  const fallback = React.useId();
  const controlId = id || fallback;
  const hintId = hint ? `${controlId}-hint` : undefined;
  // An error replaces the hint rather than stacking under it: two competing
  // instructions is worse than one correct one.
  const errorId = error ? `${controlId}-error` : undefined;
  return {
    controlId,
    hintId,
    errorId,
    describedBy: [error ? errorId : hintId].filter(Boolean).join(" ") || undefined,
  };
}

export function Field({
  ids,
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  ids: FieldIds;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${className || ""}`}>
      {label && (
        <label htmlFor={ids.controlId} className="block text-[12.5px] font-medium text-ink">
          {label}
          {required && (
            <>
              {/* The asterisk is decoration; `aria-required` on the control is
                  the fact. Both, so neither audience is guessing. */}
              <span aria-hidden="true" className="ml-0.5 text-[var(--sl-error-dot)]">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          )}
        </label>
      )}

      {children}

      {hint && !error && (
        <span id={ids.hintId} className="text-[12px] text-muted">
          {hint}
        </span>
      )}
      {error && (
        <span id={ids.errorId} className="text-[12px] text-[var(--sl-error-text)]">
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * The shared shell of a text-entry control: input, textarea, select.
 *
 * Exported so a control this file does not cover still lands on the same
 * border, radius, focus ring and error state instead of an approximation.
 */
export function controlClasses({
  error,
  className = "",
}: { error?: boolean; className?: string } = {}) {
  return [
    "w-full rounded-[10px] border bg-white px-4 text-[14px] text-body",
    "placeholder:text-muted/70 sl-transition sl-focus-ring",
    "disabled:cursor-not-allowed disabled:bg-mist disabled:text-muted",
    error ? "border-[var(--sl-error-dot)]" : "border-borderw",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}
