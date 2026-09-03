import * as React from "react";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export type { Crumb };

/**
 * The standard page header: breadcrumb, eyebrow, title, description, actions.
 *
 * Every page in the product opens with exactly this. Hand-rolling a heading
 * next to it is how two pages end up with two different title sizes.
 */
export function PageHeader({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  breadcrumbs?: Crumb[];
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-7">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-3" />
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-2 flex items-center gap-2 text-[12px] font-medium tracking-[0.08em] text-muted uppercase">
              {eyebrow}
            </div>
          )}
          <h1 className="font-lora text-[28px] leading-tight font-semibold text-ink">{title}</h1>
          {description && (
            <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-muted">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
