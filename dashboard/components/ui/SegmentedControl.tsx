"use client";

import * as React from "react";

/**
 * A small set of mutually exclusive choices, all visible at once.
 *
 * Use it for two to four short options that change a view — a date range, a
 * unit, a density. Five or more, or anything longer than two words, wants a
 * `Select`. Unlike `Tabs` it does not control a labelled panel; it sets a
 * value.
 *
 * `role="radiogroup"` rather than a row of buttons, so the state is announced
 * ("Week, selected, 2 of 3") instead of read as three unrelated controls.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  label,
  size = "md",
  className,
}: {
  options: Array<{ value: T; label: React.ReactNode }>;
  value: T;
  onValueChange: (next: T) => void;
  /** Names the group. Required — the options alone rarely say what they are for. */
  label: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const height = size === "sm" ? "h-[26px] px-2.5 text-[12px]" : "h-[30px] px-3 text-[12.5px]";

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex items-center gap-0.5 rounded-full border border-borderl bg-base p-0.5 ${className || ""}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onValueChange(option.value)}
            className={`sl-transition sl-focus-ring inline-flex cursor-pointer items-center justify-center rounded-full font-medium whitespace-nowrap ${height} ${
              selected ? "bg-white text-ink shadow-raised" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
