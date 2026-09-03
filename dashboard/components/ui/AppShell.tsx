"use client";

import * as React from "react";

import { Drawer } from "./Drawer";
import { Icon, type IconName } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

export type ShellNavItem = { label: string; href: string; icon?: IconName; badge?: React.ReactNode };
export type ShellNavSection = { title?: string; items: ShellNavItem[] };

/**
 * The frame a Since Labs product sits in: a recessed rail on the left, a
 * content column on the right, and on a phone the same rail behind a drawer.
 *
 * Worth using rather than rebuilding, because the layout carries four things
 * that are easy to leave out and expensive to add back:
 *
 *   · a skip link, which is the only way a keyboard user gets past a
 *     twenty-item nav to the content;
 *   · `<main id="content">` as a real landmark for that link to reach;
 *   · `aria-current="page"` on the active row, so "current" is a fact and not
 *     just a background colour;
 *   · the rail on `--sl-paper-base` and the content on `--sl-paper`, which is
 *     the recession the brand uses instead of a shadow or a heavier border.
 *
 * `renderLink` exists because this component must not know your router. Pass
 * `next/link`, a React Router `Link`, or leave it and get plain anchors.
 */
export function AppShell({
  brand,
  sections,
  currentPath,
  actions,
  footer,
  renderLink,
  children,
}: {
  /** The lockup at the top of the rail. Your `Wordmark`, usually. */
  brand: React.ReactNode;
  sections: ShellNavSection[];
  /** Matched against each item's href to mark the current row. */
  currentPath: string;
  /** Top-right of the content column: an account menu, a search, a button. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  renderLink?: (props: {
    href: string;
    className: string;
    children: React.ReactNode;
    "aria-current"?: "page";
  }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const link =
    renderLink ??
    (({ href, className, children: inner, ...rest }) => (
      <a href={href} className={className} {...rest}>
        {inner}
      </a>
    ));

  const nav = (
    <nav aria-label="Main" className="flex-1">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="mb-5">
          {section.title && (
            <h2 className="mb-1.5 px-[11px] text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
              {section.title}
            </h2>
          )}
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = currentPath === item.href;
              return (
                <li key={item.href}>
                  {link({
                    href: item.href,
                    "aria-current": active ? "page" : undefined,
                    className: `sl-transition sl-focus-ring flex items-center gap-2.5 rounded-md px-[11px] py-[7px] text-[13.5px] ${
                      active
                        ? "bg-terrasoft font-medium text-terraink"
                        : "text-muted hover:bg-mist hover:text-ink"
                    }`,
                    children: (
                      <>
                        {item.icon && <Icon name={item.icon} size={16} strokeWidth={1.9} />}
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge}
                      </>
                    ),
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const rail = (
    <>
      <div className="mb-6 px-1.5">{brand}</div>
      {nav}
      {footer && <div className="mt-4 border-t border-borderl pt-3">{footer}</div>}
    </>
  );

  return (
    <div className="flex min-h-screen bg-paper text-body">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-[13px] focus:text-ink focus:shadow-overlay"
      >
        Skip to content
      </a>

      <aside className="hidden w-[264px] shrink-0 flex-col overflow-y-auto border-r border-borderl bg-base px-[18px] py-[18px] lg:flex">
        {rail}
      </aside>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Navigation" width={272}>
        {rail}
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-borderl bg-base px-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            className="sl-transition sl-focus-ring -ml-1.5 cursor-pointer rounded-md p-2 text-muted hover:bg-mist hover:text-ink lg:hidden"
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="ml-auto flex items-center gap-2">
            {actions}
            <ThemeToggle size="sm" />
          </div>
        </header>

        <main id="content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
