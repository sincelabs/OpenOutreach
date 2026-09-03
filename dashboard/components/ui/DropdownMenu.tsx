"use client";

import * as React from "react";

export type MenuItem =
  | { type: "separator" }
  | {
      type?: "item";
      label: string;
      onSelect: () => void;
      icon?: React.ReactNode;
      destructive?: boolean;
      disabled?: boolean;
    };

/**
 * A menu of actions hanging off a trigger.
 *
 * A menu, not a listbox: every item *does* something. If the items set a value
 * instead, that is a `Select`, and if they navigate, they should be links in a
 * plain list.
 *
 * The whole keyboard contract lives here — Arrow keys move, Home/End jump,
 * Escape closes and returns focus to the trigger, Tab closes and moves on. So
 * does the outside-click close, which is bound on `pointerdown` rather than
 * `click`: bound on `click`, the same press that opens the menu also closes it.
 */
export function DropdownMenu({
  trigger,
  items,
  align = "start",
  label = "Actions",
}: {
  /** The button's contents. The button itself is rendered here. */
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const selectable = items
    .map((item, i) => ({ item, i }))
    .filter(({ item }) => item.type !== "separator" && !("disabled" in item && item.disabled));

  React.useEffect(() => {
    if (!open) return;

    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  React.useEffect(() => {
    if (open) itemRefs.current[active]?.focus();
  }, [open, active]);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }

  function move(delta: number) {
    const order = selectable.map(({ i }) => i);
    if (order.length === 0) return;
    const at = order.indexOf(active);
    const next = order[(at + delta + order.length) % order.length];
    setActive(next);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); move(1); break;
      case "ArrowUp": e.preventDefault(); move(-1); break;
      case "Home": e.preventDefault(); setActive(selectable[0]?.i ?? 0); break;
      case "End": e.preventDefault(); setActive(selectable[selectable.length - 1]?.i ?? 0); break;
      case "Escape": e.preventDefault(); close(); break;
      // Tab is not trapped: a menu is not a modal, and swallowing Tab strands
      // anyone who opened it by mistake.
      case "Tab": close(false); break;
    }
  }

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setActive(selectable[0]?.i ?? 0);
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setActive(selectable[0]?.i ?? 0);
            setOpen(true);
          }
        }}
        className="sl-transition sl-focus-ring inline-flex h-[32px] cursor-pointer items-center gap-1.5 rounded-[9px] border border-borderw bg-white px-3 text-[12.5px] font-medium text-body hover:bg-mist"
      >
        {trigger}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={`sl-animate-rise absolute top-full z-50 mt-1.5 min-w-[190px] rounded-[12px] border border-borderl bg-white p-1 shadow-overlay ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) =>
            item.type === "separator" ? (
              <div key={`sep-${i}`} role="separator" className="my-1 h-px bg-borderl" />
            ) : (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                tabIndex={-1}
                onClick={() => {
                  item.onSelect();
                  close();
                }}
                onMouseEnter={() => !item.disabled && setActive(i)}
                className={`sl-transition flex w-full cursor-pointer items-center gap-2 rounded-[8px] px-2.5 py-[7px] text-left text-[13px] outline-none disabled:cursor-not-allowed disabled:opacity-45 ${
                  item.destructive ? "text-[var(--sl-error-text)]" : "text-body"
                } ${active === i && !item.disabled ? "bg-mist" : ""}`}
              >
                {item.icon && <span className="shrink-0 text-muted">{item.icon}</span>}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
