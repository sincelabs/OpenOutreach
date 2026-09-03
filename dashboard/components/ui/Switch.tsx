"use client";

import * as React from "react";

/**
 * An on/off control that takes effect immediately.
 *
 * The distinction from `Checkbox` is not visual, it is temporal. A checkbox
 * states an intention that a Save button will later commit; a switch *is* the
 * commit. If the page has a Save button, the control is a checkbox — a switch
 * next to a Save button asks the person to guess whether their change already
 * happened.
 *
 * Built on a real button with `role="switch"`, so Space and Enter both work
 * and a screen reader announces "on"/"off" rather than "checked".
 */
export function Switch({
  checked,
  onCheckedChange,
  label,
  hint,
  disabled,
  className,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  /** Required. A switch with no label is a mystery toggle. */
  label: React.ReactNode;
  hint?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const labelId = React.useId();
  const hintId = hint ? `${labelId}-hint` : undefined;

  return (
    <div className={`flex items-start justify-between gap-4 ${className || ""}`}>
      <span className="min-w-0">
        <span id={labelId} className="block text-[13.5px] font-medium text-ink">
          {label}
        </span>
        {hint && (
          <span id={hintId} className="mt-0.5 block text-[12.5px] leading-snug text-muted">
            {hint}
          </span>
        )}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={`sl-transition sl-focus-ring relative mt-0.5 inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-terrafill" : "bg-borderw"
        }`}
      >
        {/* The knob moves with transform, never `left`: animating a position
            property re-lays out the row on every frame. */}
        <span
          aria-hidden="true"
          className={`sl-transition-move inline-block h-[16px] w-[16px] rounded-full bg-white shadow-raised ${
            checked ? "translate-x-[19px]" : "translate-x-[3px]"
          }`}
        />
      </button>
    </div>
  );
}
