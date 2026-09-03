"use client";

import * as React from "react";

import type { StatusTone } from "./StatusChip";

export type Toast = {
  id: string;
  tone: StatusTone;
  title: string;
  description?: string;
};

type ToastInput = Omit<Toast, "id">;

const ToastContext = React.createContext<((toast: ToastInput) => void) | null>(null);

/**
 * Confirmation that something you did worked.
 *
 * A toast reports the *result of an action the person just took*. It is not a
 * notification channel, not a place for errors that need a decision (that is an
 * `Alert`, on the surface, where it stays), and never the only record of
 * something important — it disappears, and it disappears fastest for the people
 * reading slowest.
 *
 * The region is `aria-live="polite"`: a toast interrupts nothing, it waits for
 * a gap. `role="alert"`, which does interrupt, is reserved for the `error` tone
 * on each toast.
 */
export function ToastProvider({
  children,
  duration = 5000,
}: {
  children: React.ReactNode;
  duration?: number;
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (toast: ToastInput) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list, { ...toast, id }]);
      // Errors do not self-dismiss. Something went wrong and the person may
      // need to read it twice, or copy it into a support message.
      if (toast.tone !== "error") {
        window.setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss, duration],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Push a toast. Throws outside a `ToastProvider`, rather than silently doing nothing. */
export function useToast() {
  const push = React.useContext(ToastContext);
  if (!push) throw new Error("useToast must be used inside a <ToastProvider>");
  return push;
}

const TONE_STYLE: Record<StatusTone, { bg: string; text: string; dot: string }> = {
  success:   { bg: "var(--sl-success-bg)",   text: "var(--sl-success-text)",   dot: "var(--sl-success-dot)" },
  attention: { bg: "var(--sl-attention-bg)", text: "var(--sl-attention-text)", dot: "var(--sl-attention-dot)" },
  warning:   { bg: "var(--sl-warning-bg)",   text: "var(--sl-warning-text)",   dot: "var(--sl-warning-dot)" },
  error:     { bg: "var(--sl-error-bg)",     text: "var(--sl-error-text)",     dot: "var(--sl-error-dot)" },
  info:      { bg: "var(--sl-info-bg)",      text: "var(--sl-info-text)",      dot: "var(--sl-info-dot)" },
  neutral:   { bg: "var(--sl-surface)",      text: "var(--sl-ink-body)",       dot: "var(--sl-ink-muted)" },
};

export function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const c = TONE_STYLE[toast.tone];
  return (
    <div
      role={toast.tone === "error" ? "alert" : "status"}
      style={{ background: c.bg, color: c.text }}
      className="sl-animate-rise pointer-events-auto flex w-full max-w-[380px] items-start gap-2.5 rounded-[12px] border border-borderl px-3.5 py-3 shadow-overlay"
    >
      <span
        aria-hidden="true"
        className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: c.dot }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-[12.5px] leading-snug opacity-90">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="sl-transition sl-focus-ring -mt-0.5 -mr-1 shrink-0 cursor-pointer rounded-md p-1 opacity-70 hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
