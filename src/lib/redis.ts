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

export const redisEval = (
  script: string,
  keys: string[],
  args: string[],
): Promise<number> =>
  command<number>(["EVAL", script, keys.length, ...keys, ...args]);
