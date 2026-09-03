"use client";

import * as React from "react";

/**
 * Copy a value to the clipboard, and say so.
 *
 * The confirmation is announced, not just drawn: a swap from "Copy" to
 * "Copied" that only changes a glyph tells a screen reader user nothing, so
 * the state change lives in a polite live region.
 *
 * `navigator.clipboard` is unavailable on an insecure origin and can be denied
 * outright, so the failure path is real — it surfaces "Press ⌘C" and selects
 * nothing rather than pretending the copy worked.
 */
export function CopyButton({
  value,
  label = "Copy",
  size = "sm",
  className,
}: {
  value: string;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");

  React.useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  const text = state === "copied" ? "Copied" : state === "failed" ? "Press ⌘C" : label;
  const box = size === "sm" ? "h-[28px] px-2.5 text-[12px]" : "h-[32px] px-3 text-[12.5px]";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`sl-transition sl-focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-[8px] border border-borderw bg-white font-medium text-body hover:bg-mist ${box} ${className || ""}`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {state === "copied" ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <>
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </>
          )}
        </svg>
        {text}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : ""}
      </span>
    </>
  );
}

/** A read-only value with a copy control — an API key, an invite link, an id. */
export function CopyField({ value, label }: { value: string; label?: string }) {
  const id = React.useId();
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[12.5px] font-medium text-ink">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="text"
          readOnly
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          className="sl-focus-ring min-w-0 flex-1 rounded-[9px] border border-borderw bg-paper px-3 py-2 font-mono text-[12.5px] text-muted"
        />
        <CopyButton value={value} size="md" />
      </div>
    </div>
  );
}
