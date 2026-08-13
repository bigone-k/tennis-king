import { redisDel, redisEval, redisGet } from "./redis";
import {
  REDIS_KEY,
  emptySession,
  type MatchSession,
  type MatchSessionData,
} from "./match-session";

/**
 * Compare-and-set in a single round trip.
 *
 * Reading then writing as two commands leaks the lock: another request can
 * land in between. Doing the version check inside Lua makes the write atomic
 * and costs one Redis command instead of two.
 *
 * A missing or unparseable value reports version 0, which matches what
 * `readSession()` hands to clients — so a corrupt value self-heals on the
 * next write instead of wedging the feature.
 */
const CAS_SCRIPT = `
local current = redis.call('GET', KEYS[1])
local expected = tonumber(ARGV[1])
local currentVersion = 0
if current ~= false then
  -- cjson.decode returns nil for malformed input instead of raising, so pcall
  -- alone isn't enough — the type must be checked before indexing.
  local ok, decoded = pcall(cjson.decode, current)
  if ok and type(decoded) == 'table' and tonumber(decoded.version) then
    currentVersion = tonumber(decoded.version)
  end
end
if currentVersion == expected then
  redis.call('SET', KEYS[1], ARGV[2])
  return 1
end
return 0
`;

export const readSession = async (): Promise<MatchSession> => {
  const raw = await redisGet(REDIS_KEY);
  if (!raw) return emptySession();

  try {
    return JSON.parse(raw) as MatchSession;
  } catch {
    // Surface it — silently serving a blank session would look like data loss
    // with no explanation. Clients recover by writing over version 0.
    console.error(
      `[match-session] 저장된 값을 파싱할 수 없습니다. 초기 상태로 대체합니다. key=${REDIS_KEY}`,
    );
    return emptySession();
  }
};

/**
 * Returns the stored session on success, or `null` when `expectedVersion`
 * no longer matches (someone else wrote first).
 */
export const writeSession = async (
  expectedVersion: number,
  data: MatchSessionData,
): Promise<MatchSession | null> => {
  const next: MatchSession = {
    ...data,
    version: expectedVersion + 1,
    updatedAt: new Date().toISOString(),
  };

  const applied = await redisEval(
    CAS_SCRIPT,
    [REDIS_KEY],
    [String(expectedVersion), JSON.stringify(next)],
  );

  return applied === 1 ? next : null;
};

export const clearSession = async (): Promise<void> => {
  await redisDel(REDIS_KEY);
};
