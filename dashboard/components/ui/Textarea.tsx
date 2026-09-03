import * as React from "react";

import { Field, controlClasses, useFieldIds } from "./Field";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
}

/**
 * Multi-line text.
 *
 * `rows` defaults to 4 rather than the browser's 2: a two-line box invites a
 * two-line answer, and every field that gets one of these is asking for a
 * paragraph. Resizing is vertical only — a horizontally resizable textarea
 * escapes its column and breaks the page layout the first time someone drags it.
 */
export function Textarea({ className, label, hint, error, id, rows = 4, ...props }: TextareaProps) {
  const ids = useFieldIds({ id, hint, error });

  return (
    <Field ids={ids} label={label} hint={hint} error={error} required={props.required}>
      <textarea
        id={ids.controlId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={controlClasses({
          error: Boolean(error),
          className: `resize-y py-3 leading-relaxed ${className || ""}`,
        })}
        {...props}
      />
    </Field>
  );
}
