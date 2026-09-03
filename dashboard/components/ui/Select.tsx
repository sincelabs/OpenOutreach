import * as React from "react";

import { Field, controlClasses, useFieldIds } from "./Field";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  /** Convenience: pass options as data instead of children. */
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

/**
 * A native `<select>`, deliberately.
 *
 * A custom listbox is 200 lines of keyboard handling, a focus trap and a
 * portal, and it still loses to the OS picker on a phone. Reach for one only
 * when the options need search, multi-select or rich rows — and then it is a
 * `DropdownMenu`, not a select.
 *
 * The chevron is a background image rather than an overlaid element so the
 * whole control stays one hit target: an absolutely positioned icon swallows
 * the click that was meant to open the menu.
 */
export function Select({
  className,
  label,
  hint,
  error,
  id,
  options,
  children,
  ...props
}: SelectProps) {
  const ids = useFieldIds({ id, hint, error });

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={props.required}>
      <select
        id={ids.controlId}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={controlClasses({
          error: Boolean(error),
          className: `h-[48px] cursor-pointer appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10 ${className || ""}`,
        })}
        style={{
          // currentColor cannot be used inside a data: URI, so the chevron is
          // drawn in ink-muted, which reads on both paper and the dark surface.
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B6762' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          : children}
      </select>
    </Field>
  );
}
