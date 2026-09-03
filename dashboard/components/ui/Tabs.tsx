"use client";

import * as React from "react";

export type TabItem = { id: string; label: React.ReactNode; badge?: React.ReactNode };

/**
 * Tabs, with the keyboard behaviour the ARIA pattern actually requires.
 *
 * The part people skip is **roving tabindex**: only the selected tab is in the
 * tab order, and Left/Right (plus Home/End) move between them. Leave every tab
 * at `tabIndex={0}` and a keyboard user has to press Tab eight times to get
 * past a tab bar to the content it controls.
 *
 * Only the selected panel is rendered. If a hidden panel holds a form, render
 * them all and toggle `hidden` instead — unmounting throws away what the person
 * typed.
 */
export function Tabs({
  items,
  value,
  onValueChange,
  label = "Sections",
  children,
}: {
  items: TabItem[];
  value: string;
  onValueChange: (id: string) => void;
  /** Names the tab list for a screen reader. */
  label?: string;
  /** Rendered inside the panel for the selected tab. */
  children: React.ReactNode;
}) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: React.KeyboardEvent) {
    const i = items.findIndex((t) => t.id === value);
    if (i < 0) return;

    const next =
      e.key === "ArrowRight" ? (i + 1) % items.length
      : e.key === "ArrowLeft" ? (i - 1 + items.length) % items.length
      : e.key === "Home" ? 0
      : e.key === "End" ? items.length - 1
      : null;

    if (next === null) return;
    e.preventDefault();
    const id = items[next].id;
    onValueChange(id);
    // Selection follows focus in this pattern, so the newly selected tab must
    // actually receive focus or the next arrow press starts from the old one.
    refs.current[id]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-borderl"
      >
        {items.map((tab) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                refs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onValueChange(tab.id)}
              className={`sl-transition sl-focus-ring -mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13.5px] whitespace-nowrap ${
                selected
                  ? "border-terra font-medium text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {tab.label}
              {tab.badge}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${value}`}
        aria-labelledby={`tab-${value}`}
        // Focusable so a keyboard user can reach panel content that has no
        // controls of its own — a table, a paragraph — after leaving the tabs.
        tabIndex={0}
        className="sl-focus-ring pt-5"
      >
        {children}
      </div>
    </div>
  );
}
