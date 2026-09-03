"use client";

import { useActionState } from "react";

import { Button, Input, Panel } from "@/components/ui";

import { login, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState | undefined, FormData>(
    login,
    undefined,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 text-center">
          <div className="font-lora mb-1 text-[26px] font-semibold text-ink">
            <span className="text-terraink">//</span> OpenOutreach
          </div>
          <p className="text-[13px] text-muted">Sign in to configure this install.</p>
        </div>

        <Panel title="Dashboard sign-in">
          <form action={formAction} className="flex flex-col gap-4">
            <Input
              type="password"
              name="password"
              label="Password"
              autoFocus
              required
              autoComplete="current-password"
              error={state?.error}
            />
            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Panel>
      </div>
    </main>
  );
}
