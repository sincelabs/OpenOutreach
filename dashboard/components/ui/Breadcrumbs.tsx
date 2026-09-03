import * as React from "react";

export type Crumb = { label: string; href?: string };

/**
 * Where this page sits.
 *
 * The last crumb is the current page: never a link, always `aria-current=
 * "page"`. The separators are `aria-hidden` — a listener hearing "Admin slash
 * Users slash Sample User" is being read punctuation, not structure; the
 * `<nav>` and the ordered list carry that already.
 *
 * `PageHeader` renders this for you. Use it directly only outside a page header.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 text-[12.5px] text-muted">
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="text-muted/60">
                  /
                </span>
              )}
              {crumb.href && !last ? (
                <a href={crumb.href} className="sl-transition sl-focus-ring rounded-[4px] hover:text-ink">
                  {crumb.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ink" : ""}>
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
