"use client";

import * as React from "react";

import { applyTheme, readTheme, resolveTheme, type ThemePreference } from "@/lib/theme";

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: React.ReactNode }> = [
  {
    value: "light",
    label: "Light",
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  },
];

/**
 * The light / system / dark control.
 *
 * A radio group, not three buttons and not a checkbox: the three states are
 * mutually exclusive and one is always current, which is exactly what
 * `role="radiogroup"` describes. A screen reader then announces "System,
 * selected, 2 of 3" instead of three unrelated toggles.
 *
 * Nothing is marked selected until after mount. The server cannot know which
 * theme this reader chose — the choice lives in their localStorage — so
 * rendering a guess and correcting it on hydration is a React mismatch and a
 * visible jump. The page itself is already correct by then: `THEME_SCRIPT`
 * set `data-theme` before first paint. Only this control catches up late, for
 * one frame, which is the right thing to make late.
 */
export function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  /** `sm` for dense chrome — a toolbar or a table row. */
  size?: "sm" | "md";
}) {
  const [preference, setPreference] = React.useState<ThemePreference | null>(null);

  React.useEffect(() => setPreference(readTheme()), []);

  function choose(next: ThemePreference) {
    applyTheme(next);
    setPreference(next);
  }

  const box = size === "sm" ? "h-[26px] w-[30px]" : "h-[30px] w-[34px]";
  const glyph = size === "sm" ? 14 : 15;

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center gap-0.5 rounded-full border border-borderl bg-base p-0.5 ${className || ""}`}
    >
      {OPTIONS.map((option) => {
        // `null` while unmounted, so no option claims to be checked yet.
        const checked = preference === null ? false : preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            title={
              option.value === "system"
                ? `System (currently ${preference === null ? "…" : resolveTheme("system")})`
                : option.label
            }
            onClick={() => choose(option.value)}
            className={`sl-transition sl-focus-ring inline-flex ${box} cursor-pointer items-center justify-center rounded-full ${
              checked
                ? "bg-white text-ink shadow-raised"
                : "text-muted hover:bg-mist hover:text-ink"
            }`}
          >
            <svg
              width={glyph}
              height={glyph}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
