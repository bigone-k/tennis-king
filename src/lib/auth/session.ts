import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createToken,
  verifyToken,
} from "./token";

export const createSession = async (): Promise<void> => {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
};

export const deleteSession = async (): Promise<void> => {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
};

/**
 * Re-check the session at the data source. `proxy.ts` is an optimistic filter
 * only — Route Handlers and Server Actions must call this themselves.
 */
export const hasValidSession = async (): Promise<boolean> => {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
};
