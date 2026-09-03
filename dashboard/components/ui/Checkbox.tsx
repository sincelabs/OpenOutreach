import * as React from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
}

/**
 * A checkbox with its label.
 *
 * A real `<input type="checkbox">` under a styled box, not a `<div role=
 * "checkbox">`. The native control brings keyboard handling, form
 * participation, the browser's own "required" message and — the one people
 * forget — Windows High Contrast Mode, where a div painted with background
 * colours disappears entirely.
 *
 * `peer` styling drives the visual box off the real input's state, so checked,
 * focused and disabled stay in sync without a line of JavaScript.
 */
export function Checkbox({ className, label, hint, id, ...props }: CheckboxProps) {
  const fallbackId = React.useId();
  const inputId = id || fallbackId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`flex gap-2.5 ${className || ""}`}>
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          aria-describedby={hintId}
          className="peer sl-focus-ring h-[18px] w-[18px] cursor-pointer appearance-none rounded-[5px] border border-borderw bg-white checked:border-terrafill checked:bg-terrafill disabled:cursor-not-allowed disabled:bg-mist"
          {...props}
        />
        {/* The tick sits above the input and must not eat its click. It is
            drawn in --sl-on-accent, which flips to ink in the dark theme: a
            white tick on the lifted terracotta is 3.00:1, below the 3:1 a
            graphical object needs (WCAG 1.4.11). */}
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute h-3 w-3 text-onterra opacity-0 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>

      <span className="min-w-0">
        <label
          htmlFor={inputId}
          className="cursor-pointer text-[13.5px] leading-[1.35] text-body select-none"
        >
          {label}
        </label>
        {hint && (
          <span id={hintId} className="mt-0.5 block text-[12px] text-muted">
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * A set of checkboxes that belong together.
 *
 * `<fieldset>`/`<legend>` is the only markup that tells a screen reader "these
 * five checkboxes answer one question". A heading above a stack of them does
 * not: the user tabs into box three with no idea what it is a choice about.
 */
export function CheckboxGroup({
  legend,
  hint,
  error,
  children,
}: {
  legend: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-1 text-[12.5px] font-medium text-ink">{legend}</legend>
      {hint && <p className="mb-2.5 text-[12px] text-muted">{hint}</p>}
      <div className="flex flex-col gap-2.5">{children}</div>
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-[var(--sl-error-text)]">
          {error}
        </p>
      )}
    </fieldset>
  );
}
