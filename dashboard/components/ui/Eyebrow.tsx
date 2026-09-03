import * as React from "react";

/**
 * The ALL-CAPS section label.
 *
 * The one place the brand uses uppercase. Always tracked out, always muted,
 * always above a heading — never on its own, and never as a button.
 */
export function Eyebrow({
  children,
  slash = false,
  className,
}: {
  children: React.ReactNode;
  /** Prefix with the `//` device. One per surface. */
  slash?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] text-muted uppercase ${className || ""}`}
    >
      {slash && <span className="font-mono font-bold text-terra">{"//"}</span>}
      {children}
    </p>
  );
}
