import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const SIZES: Record<ButtonSize, string> = {
  sm: "h-[32px] px-3 text-[12.5px] rounded-[9px]",
  md: "h-[38px] px-3.5 text-[13.5px] rounded-[10px]",
  lg: "h-[48px] px-4 text-[14px] rounded-[12px]",
};

const VARIANTS: Record<ButtonVariant, string> = {
  // Filled with accent-FILL, NOT accent: white on #C4602A is 4.16:1, which
  // fails AA for a 14px label. The fill token is #A34A1F in light (5.90:1
  // under white) and #E07A38 in dark — where the label flips to ink, because
  // white on #E07A38 is 3.00:1 and fails just as badly. Both halves of the
  // pair move together; see tokens/since-brand.css.
  primary:
    "bg-terrafill text-onterra hover:bg-terrafill-hover active:bg-terrafill-hover",
  secondary:
    "bg-white border border-borderw text-body hover:bg-mist active:bg-mist",
  ghost: "text-muted hover:bg-mist hover:text-ink",
  destructive:
    "bg-[var(--sl-error-bg)] border border-[var(--sl-error-dot)] text-[var(--sl-error-text)] hover:brightness-[0.97]",
};

export function buttonVariants({
  variant = "primary",
  size = "lg",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return [
    "inline-flex items-center justify-center gap-1.5 font-medium",
    "transition-colors duration-[120ms] ease-sl cursor-pointer",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra",
    "disabled:cursor-not-allowed disabled:opacity-50",
    SIZES[size],
    VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

/**
 * NOTE: this defaults to `type="button"`, NOT the HTML default of `submit`.
 *
 * A `<Button>` inside a `<form action={...}>` therefore does nothing at all
 * unless it explicitly passes `type="submit"` — and it fails silently, with no
 * console error and no visual difference. Pass `type="submit"` for anything
 * that has to submit a form.
 */
export function Button({
  className,
  variant = "primary",
  size = "lg",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
