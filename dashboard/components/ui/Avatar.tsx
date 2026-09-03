import * as React from "react";

/** Initials from a name, falling back to an email, falling back to "U". */
export function initialsFor(name?: string | null, email?: string | null): string {
  const fromName = name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return fromName || email?.charAt(0).toUpperCase() || "U";
}

export function Avatar({
  name,
  email,
  size = 34,
  tone = "terra",
}: {
  name?: string | null;
  email?: string | null;
  size?: number;
  tone?: "terra" | "mist";
}) {
  return (
    <span
      aria-hidden="true"
      style={{ height: size, width: size, fontSize: Math.round(size * 0.37) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        tone === "terra" ? "bg-terrafill text-onterra" : "bg-mist text-muted"
      }`}
    >
      {initialsFor(name, email)}
    </span>
  );
}
