import * as React from "react";

/**
 * A link in running text.
 *
 * It exists to make one rule impossible to get wrong: links are
 * `--sl-accent-ink` (#A34A1F, 5.9:1 on white), never `--sl-accent` (#C4602A,
 * 4.16:1 — below AA). That single substitution is the most common brand defect
 * in Since Labs code; the app audit counted 62 of them.
 *
 * Underlined by default, because colour alone is not a distinguishing feature
 * for a colour-blind reader (WCAG 1.4.1). Drop the underline only in chrome
 * where position already marks the link — a nav rail, a breadcrumb.
 *
 * An external link gets `rel="noopener noreferrer"` automatically and says so
 * out loud, so nobody follows one expecting to stay put.
 */
export function TextLink({
  href,
  external,
  underline = true,
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  external?: boolean;
  underline?: boolean;
}) {
  const isExternal = external ?? /^https?:\/\//.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`sl-transition sl-focus-ring rounded-[3px] text-terraink hover:text-terraink-hover ${
        underline ? "underline decoration-terraink/35 underline-offset-2 hover:decoration-current" : ""
      } ${className || ""}`}
      {...props}
    >
      {children}
      {isExternal && (
        <>
          <span aria-hidden="true"> ↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
}
