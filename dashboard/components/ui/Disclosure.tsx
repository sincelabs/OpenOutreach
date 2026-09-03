import * as React from "react";

/**
 * A section that opens and closes.
 *
 * Built on `<details>`/`<summary>`, which brings the button semantics, the
 * expanded state, Enter and Space, and — the reason it wins outright — the
 * browser's find-in-page opening a closed section that contains the match. A
 * div-and-state version hides that content from Ctrl+F entirely.
 *
 * The marker rotates, which is the one exception to "no rotation outside a
 * spinner": it is 90 degrees of state, not an animation.
 */
export function Disclosure({
  summary,
  defaultOpen = false,
  children,
  className,
}: {
  summary: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-[12px] border border-borderl bg-white ${className || ""}`}
    >
      <summary className="sl-transition sl-focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-[12px] px-4 py-3 text-[13.5px] font-medium text-ink hover:bg-mist [&::-webkit-details-marker]:hidden">
        {summary}
        <svg
          viewBox="0 0 24 24"
          className="sl-transition-move h-4 w-4 shrink-0 text-muted group-open:rotate-90"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </summary>
      <div className="border-t border-borderl px-4 py-3.5 text-[13.5px] leading-relaxed text-body">
        {children}
      </div>
    </details>
  );
}

/**
 * A stack of disclosures.
 *
 * Deliberately not an "accordion" that closes its siblings. Auto-closing means
 * a person cannot compare two sections, and the one they were reading vanishes
 * when they open another.
 */
export function DisclosureGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex flex-col gap-2 ${className || ""}`}>{children}</div>;
}
