import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Access-code session token.
 *
 * The site has no per-member identity — anyone holding the club access code is
 * let in. The token therefore carries nothing but an expiry, signed with
 * HMAC-SHA256 so it cannot be forged client-side.
 *
 * Kept free of `next/headers` so `proxy.ts` can import it. Cookie handling
 * lives in `./session`.
 */

export const SESSION_COOKIE = "noad_session";

export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

interface TokenPayload {
  exp: number;
}

/** Throws rather than falling back, so a missing secret fails closed and loud. */
const secret = (): string => {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error(
      "SESSION_SECRET 환경변수가 없습니다. .env.local 또는 Vercel 환경변수를 확인하세요.",
    );
  }
  return value;
};

const sign = (encodedPayload: string): string =>
  createHmac("sha256", secret()).update(encodedPayload).digest("base64url");

/** Constant-time compare that tolerates length mismatch. */
const safeEquals = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

export const createToken = (): string => {
  const payload: TokenPayload = {
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
};

export const verifyToken = (token: string | undefined): boolean => {
  if (!token) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  if (!safeEquals(signature, sign(encoded))) return false;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString(),
    ) as Partial<TokenPayload>;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    // Signature was valid but the body is not the payload we write — treat as
    // unauthenticated rather than crashing the request.
    return false;
  }
};

export const isValidAccessCode = (input: string): boolean => {
  const expected = process.env.CLUB_ACCESS_CODE;
  if (!expected) {
    throw new Error(
      "CLUB_ACCESS_CODE 환경변수가 없습니다. .env.local 또는 Vercel 환경변수를 확인하세요.",
    );
  }
  return safeEquals(input.trim(), expected);
};
