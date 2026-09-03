"use client";

import { useActionState, useState } from "react";

import { Button, Checkbox, Input, Panel, StatusChip, Textarea } from "@/components/ui";
import { type FieldDef, GROUPS } from "@/lib/config-schema";
import type { ConfigRow } from "@/lib/db";

import { saveSettings, type SaveState } from "./actions";

export function SettingsForm({ initial }: { initial: ConfigRow }) {
  const [state, formAction, pending] = useActionState<SaveState | undefined, FormData>(
    saveSettings,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-[10px] border px-4 py-3 text-[13px]"
          style={{
            borderColor: "var(--sl-error-dot)",
            color: "var(--sl-error-text)",
            background: "var(--sl-error-bg)",
          }}
        >
          {state.error}
        </div>
      )}

      {GROUPS.map((group) => (
        <Panel key={group.title} title={group.title} description={group.description}>
          <div className="flex flex-col gap-4">
            {group.fields.map((field) => (
              <FieldControl key={field.key} field={field} defaultValue={initial[field.key]} />
            ))}
          </div>
        </Panel>
      ))}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save configuration"}
        </Button>
        {state?.ok && <StatusChip tone="success" label="Saved" />}
      </div>
    </form>
  );
}

function FieldControl({
  field,
  defaultValue,
}: {
  field: FieldDef;
  defaultValue: string | number | undefined;
}) {
  if (field.type === "checkbox") {
    return (
      <Checkbox name={field.key} label={field.label} hint={field.hint} defaultChecked={Boolean(defaultValue)} />
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        name={field.key}
        label={field.label}
        hint={field.hint}
        defaultValue={String(defaultValue ?? "")}
        rows={field.key === "signature" ? 3 : 6}
      />
    );
  }

  if (field.type === "secret") {
    return <SecretInput field={field} defaultValue={String(defaultValue ?? "")} />;
  }

  return (
    <Input
      name={field.key}
      type={field.type === "email" ? "email" : "text"}
      label={field.label}
      hint={field.hint}
      maxLength={field.maxLength}
      placeholder={field.placeholder}
      defaultValue={String(defaultValue ?? "")}
    />
  );
}

function SecretInput({ field, defaultValue }: { field: FieldDef; defaultValue: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        name={field.key}
        type={visible ? "text" : "password"}
        label={field.label}
        hint={field.hint}
        maxLength={field.maxLength}
        defaultValue={defaultValue}
        autoComplete="off"
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="sl-transition sl-focus-ring self-start rounded-md text-[12px] font-medium text-terraink hover:text-terraink-hover"
      >
        {visible ? "Hide value" : "Show value"}
      </button>
    </div>
  );
}
