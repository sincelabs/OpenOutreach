import * as React from "react";

/**
 * Label-and-value pairs: a detail panel, a summary of a record, a receipt.
 *
 * A real `<dl>`, so a screen reader reads "Plan: Team" as one thing. Built out
 * of a two-column grid and it becomes six unrelated cells the listener has to
 * pair up themselves.
 */
export function DescriptionList({
  columns = 1,
  className,
  children,
}: {
  columns?: 1 | 2;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <dl
      className={`grid gap-x-8 gap-y-3.5 ${columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"} ${className || ""}`}
    >
      {children}
    </dl>
  );
}

export function DescriptionItem({
  term,
  children,
  mono = false,
}: {
  term: React.ReactNode;
  children: React.ReactNode;
  /** For identifiers and timestamps — anything read character by character. */
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{term}</dt>
      <dd className={`mt-1 text-[13.5px] text-ink ${mono ? "font-mono text-[12.5px] break-all" : ""}`}>
        {children}
      </dd>
    </div>
  );
}
