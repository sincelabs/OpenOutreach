"use server";

import { revalidatePath } from "next/cache";

import { GROUPS } from "@/lib/config-schema";
import { saveConfig } from "@/lib/db";

export type SaveState = { ok?: boolean; error?: string };

export async function saveSettings(
  _prevState: SaveState | undefined,
  formData: FormData,
): Promise<SaveState> {
  const values: Record<string, string | boolean> = {};
  for (const group of GROUPS) {
    for (const field of group.fields) {
      values[field.key] =
        field.type === "checkbox"
          ? formData.get(field.key) === "on"
          : String(formData.get(field.key) ?? "");
    }
  }

  const operatorEmail = String(values.operator_email ?? "");
  if (operatorEmail && !looksLikeEmail(operatorEmail)) {
    return { error: "Enter a valid operator email address." };
  }
  const mailboxAddress = String(values.mailbox_address ?? "");
  if (mailboxAddress && !looksLikeEmail(mailboxAddress)) {
    return { error: "Enter a valid mailbox address." };
  }
  const country = String(values.country_code ?? "").trim();
  if (country && !/^[A-Za-z]{2}$/.test(country)) {
    return { error: "Country code must be two letters (ISO 3166 alpha-2, e.g. US, GB, DE)." };
  }
  values.country_code = country.toLowerCase();

  saveConfig(values);
  revalidatePath("/");
  return { ok: true };
}

function looksLikeEmail(value: string): boolean {
  const [local, domain] = value.split("@");
  return Boolean(
    local && domain && domain.includes(".") && !domain.startsWith(".") && !domain.endsWith("."),
  );
}
