import * as React from "react";

/**
 * A placeholder in the shape of the thing that is coming.
 *
 * Preferred over a spinner for content, because it holds the layout: when the
 * data lands, nothing jumps. That only works if the skeleton is honestly
 * shaped — a 200px block where a three-line paragraph will appear is worse
 * than a spinner, because it promises a layout it then breaks.
 *
 * `aria-hidden` throughout. A screen reader user gets the loading state from
 * the live region around the fetch, not from a description of grey boxes.
 */
export function Skeleton({
  className,
  radius = "md",
}: {
  className?: string;
  radius?: "sm" | "md" | "full";
}) {
  const r = radius === "full" ? "rounded-full" : radius === "sm" ? "rounded-[5px]" : "rounded-[9px]";
  return (
    <span
      aria-hidden="true"
      className={`sl-animate-pulse block bg-mist ${r} ${className || ""}`}
    />
  );
}

/** A believable paragraph: full-width lines with a short last one. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={`flex flex-col gap-2 ${className || ""}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          radius="sm"
          className={`h-[11px] ${i === lines - 1 ? "w-[55%]" : "w-full"}`}
        />
      ))}
    </span>
  );
}
