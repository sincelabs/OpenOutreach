import * as React from "react";

/** The default container: white on paper, hairline border, barely-there shadow. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-[16px] border border-borderl bg-white shadow-raised ${className || ""}`}
      {...props}
    />
  );
}

/**
 * A card with a titled header rail.
 *
 * Use over a bare `Card` whenever the content needs a name — which is most of
 * the time. The header is a real landmark, so the heading level is caller-set.
 */
export function Panel({
  title,
  description,
  actions,
  headingLevel: Heading = "h2",
  bodyClassName,
  className,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`overflow-hidden rounded-[16px] border border-borderl bg-white shadow-raised ${className || ""}`}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borderl px-5 py-4">
          <div className="min-w-0">
            {title && <Heading className="text-[15px] font-semibold text-ink">{title}</Heading>}
            {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName ?? "p-5"}>{children}</div>
    </section>
  );
}
