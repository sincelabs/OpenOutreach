"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { checkPassword, COOKIE_NAME, createSessionToken } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prevState: LoginState | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    return { error: "Wrong password." };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/");
}
