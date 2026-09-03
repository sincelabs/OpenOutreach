import * as React from "react";

/**
 * Page controls for a table or list.
 *
 * `<nav aria-label="Pagination">` so it is a landmark a screen reader user can
 * jump to, and the range is stated in words — "1–25 of 340" — because "Page 2
 * of 14" does not tell anyone whether the row they want is behind them or ahead.
 *
 * Rendered as links when `hrefFor` is given, which keeps the back button, the
 * middle-click and the shareable URL working. Buttons only when the list state
 * genuinely does not live in the URL.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  hrefFor,
  className,
}: {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange?: (next: number) => void;
  hrefFor?: (page: number) => string;
  className?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  const step = (delta: number) => Math.min(pages, Math.max(1, page + delta));

  function control(delta: number, label: string, glyph: React.ReactNode) {
    const target = step(delta);
    const disabled = target === page;
    const classes = `sl-transition sl-focus-ring inline-flex h-[32px] items-center gap-1.5 rounded-[9px] border border-borderw bg-white px-3 text-[12.5px] font-medium text-body ${
      disabled ? "pointer-events-none opacity-45" : "cursor-pointer hover:bg-mist"
    }`;

    if (hrefFor && !disabled) {
      return (
        <a href={hrefFor(target)} rel={delta < 0 ? "prev" : "next"} className={classes}>
          {glyph}
        </a>
      );
    }
    return (
      <button
        type="button"
        disabled={disabled}
        aria-label={label}
        onClick={() => onPageChange?.(target)}
        className={classes}
      >
        {glyph}
      </button>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 ${className || ""}`}
    >
      <p className="text-[12.5px] text-muted">
        {total === 0 ? (
          "No results"
        ) : (
          <>
            <span className="tabular-nums text-ink">
              {first}–{last}
            </span>{" "}
            of <span className="tabular-nums text-ink">{total}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        {control(-1, "Previous page", <>← Previous</>)}
        {control(1, "Next page", <>Next →</>)}
      </div>
    </nav>
  );
}
