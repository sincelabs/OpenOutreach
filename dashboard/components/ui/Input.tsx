import * as React from "react";

import { Field, controlClasses, useFieldIds } from "./Field";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
}

/**
 * A labelled text field.
 *
 * The label is always rendered and always tied to the input by id — a
 * placeholder is not a label, and it disappears the moment someone types, which
 * is exactly when they most need to know what they are typing into.
 *
 * The hint and the error reach the control through `aria-describedby` (see
 * `Field`), so a screen reader hears them as part of the field rather than as
 * loose text somewhere after it.
 */
export function Input({ className, label, hint, error, id, ...props }: InputProps) {
  const ids = useFieldIds({ id, hint, error });

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={props.required}>
      <input
        id={ids.controlId}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={controlClasses({
          error: Boolean(error),
          className: `h-[48px] ${className || ""}`,
        })}
        {...props}
      />
    </Field>
  );
}
