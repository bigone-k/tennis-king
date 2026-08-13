"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "./session";
import { isValidAccessCode } from "./token";

export interface GateState {
  error: string | null;
}

/** Only allow same-origin paths back through `?next=`, never a full URL. */
const safeNext = (value: string): string =>
  value.startsWith("/") && !value.startsWith("//") ? value : "/";

export async function submitAccessCode(
  _prev: GateState,
  formData: FormData,
): Promise<GateState> {
  const code = String(formData.get("code") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!code.trim()) {
    return { error: "가입코드를 입력해 주세요." };
  }
  if (!isValidAccessCode(code)) {
    return { error: "가입코드가 올바르지 않습니다." };
  }

  await createSession();
  redirect(safeNext(next));
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/gate");
}
