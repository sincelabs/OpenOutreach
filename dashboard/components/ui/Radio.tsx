import * as React from "react";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  hint?: React.ReactNode;
}

/**
 * One option in a radio group.
 *
 * Never ship a lone radio: unlike a checkbox, a radio cannot be unset by the
 * person who set it, so a single one is a switch they can turn on and never
 * off. Two or more, always inside a `RadioGroup`, and give every one of them
 * the same `name` — that shared name is what makes the arrow keys move between
 * them instead of tabbing.
 */
export function Radio({ className, label, hint, id, ...props }: RadioProps) {
  const fallbackId = React.useId();
  const inputId = id || fallbackId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className={`flex gap-2.5 ${className || ""}`}>
      <span className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="radio"
          aria-describedby={hintId}
          className="peer sl-focus-ring h-[18px] w-[18px] cursor-pointer appearance-none rounded-full border border-borderw bg-white checked:border-terrafill disabled:cursor-not-allowed disabled:bg-mist"
          {...props}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-[8px] w-[8px] rounded-full bg-terrafill opacity-0 peer-checked:opacity-100"
        />
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

export function RadioGroup({
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
