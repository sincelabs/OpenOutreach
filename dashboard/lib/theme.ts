/**
 * Theme resolution, shared by the pre-paint script and the React toggle.
 *
 * Three states, not two. "system" is a real choice — it means "follow the OS",
 * and it is the default — so a toggle that only swaps light and dark takes
 * something away from the person the moment they touch it.
 */

export type ThemePreference = "light" | "dark" | "system";

/** Where the choice lives. Read by the inline script before React exists. */
export const THEME_STORAGE_KEY = "sl-theme";

/**
 * The script that runs before first paint.
 *
 * This has to be inline and synchronous in `<head>`. Anything else — a
 * `useEffect`, a deferred module, a client component — runs after the browser
 * has already painted, and the reader watches the page flash white before it
 * turns to ink. That flash is the single most common defect in a hand-rolled
 * theme toggle.
 *
 * It is deliberately tiny and dependency-free, and every line is in a
 * try/catch: localStorage throws outright in a locked-down browser or a
 * sandboxed frame, and a theme preference is never worth taking the page down
 * for. On a throw the attribute is simply not set, which lands the reader on
 * the `prefers-color-scheme` default — the correct fallback.
 */
export const THEME_SCRIPT = `(function(){try{
var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
if(p==="light"||p==="dark"){document.documentElement.setAttribute("data-theme",p);}
}catch(e){}})();`;

/** What the page is actually showing, given a preference and the OS setting. */
export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Apply a preference to the document and remember it.
 *
 * "system" *removes* the attribute rather than writing a resolved value: the
 * token files key their dark block off `prefers-color-scheme` with a
 * `:root:not([data-theme="light"])` guard, so with no attribute present the
 * page tracks the OS live — including a change made while the tab is open,
 * with no listener of our own.
 */
export function applyTheme(preference: ThemePreference): void {
  const root = document.documentElement;
  if (preference === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", preference);

  try {
    if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage denied. The theme still applies for this page view.
  }
}

/** The stored preference, or "system" when there is none or storage is denied. */
export function readTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage denied.
  }
  return "system";
}
