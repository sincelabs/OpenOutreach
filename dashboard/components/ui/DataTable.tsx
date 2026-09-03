import * as React from "react";

/**
 * The table shell.
 *
 * Two things here are not optional. The `overflow-x-auto` wrapper keeps a wide
 * table inside its own scroll box instead of pushing the whole page sideways on
 * a phone. And the `<caption>` — visually hidden — is what tells a screen
 * reader user what the table is before they start arrowing through cells.
 */
export function DataTable({
  caption,
  head,
  children,
  className,
}: {
  caption: string;
  head: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto ${className || ""}`}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-borderl">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({
  children,
  numeric,
  className,
}: {
  children: React.ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`px-5 py-3 text-[11px] font-medium tracking-[0.08em] text-muted uppercase whitespace-nowrap ${
        numeric ? "text-right" : ""
      } ${className || ""}`}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  numeric,
  className,
}: {
  children: React.ReactNode;
  numeric?: boolean;
  className?: string;
}) {
  return (
    <td
      className={`border-b border-borderl px-5 py-3.5 align-middle text-[13.5px] ${
        numeric ? "text-right tabular-nums" : ""
      } ${className || ""}`}
    >
      {children}
    </td>
  );
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={`last:[&>td]:border-0 ${className || ""}`}>{children}</tr>;
}
