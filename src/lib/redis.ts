/**
 * Minimal Upstash Redis REST client.
 *
 * Only GET / EVAL / DEL are needed, and the stored value is a single JSON
 * string, so the official SDK would not earn its dependency here.
 */

interface Endpoint {
  url: string;
  token: string;
}

/**
 * Accepts either naming convention: `UPSTASH_*` (Upstash console) or `KV_*`
 * (Vercel Marketplace integration). Throws so a misconfigured deployment
 * fails loudly instead of silently losing shared state.
 */
const endpoint = (): Endpoint => {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Upstash Redis 환경변수가 없습니다. UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (또는 KV_REST_API_URL / KV_REST_API_TOKEN) 을 설정하세요.",
    );
  }
  return { url, token };
};

const command = async <T>(args: (string | number)[]): Promise<T> => {
  const { url, token } = endpoint();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Upstash 요청 실패 (${response.status}): ${await response.text()}`,
    );
  }

  const body = (await response.json()) as { result?: T; error?: string };
  if (body.error) {
    throw new Error(`Upstash 오류: ${body.error}`);
  }
  return body.result as T;
};

export const redisGet = (key: string): Promise<string | null> =>
  command<string | null>(["GET", key]);

export const redisDel = (key: string): Promise<number> =>
  command<number>(["DEL", key]);

/** Sets the field only if it does not exist. Resolves 1 when set, 0 when it already existed. */
export const redisHsetnx = (
  key: string,
  field: string,
  value: string,
): Promise<number> => command<number>(["HSETNX", key, field, value]);

/** Resolves the number of fields removed (0 when the field did not exist). */
export const redisHdel = (key: string, field: string): Promise<number> =>
  command<number>(["HDEL", key, field]);

/** Upstash returns HGETALL as a flat [field, value, field, value, ...] array. */
export const redisHgetall = async (
  key: string,
): Promise<Record<string, string>> => {
  const flat = (await command<string[] | null>(["HGETALL", key])) ?? [];
  const result: Record<string, string> = {};
  for (let i = 0; i + 1 < flat.length; i += 2) {
    result[flat[i]] = flat[i + 1];
  }
  return result;
};

export const redisEval = (
  script: string,
  keys: string[],
  args: string[],
): Promise<number> =>
  command<number>(["EVAL", script, keys.length, ...keys, ...args]);
