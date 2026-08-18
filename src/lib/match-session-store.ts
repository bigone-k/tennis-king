import { redisDel, redisEval, redisGet } from "./redis";
import {
  REDIS_KEY,
  applyScoreOp,
  emptySession,
  parseMatchSessionData,
  type MatchSession,
  type MatchSessionData,
  type ScoreOp,
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
    const stored = JSON.parse(raw) as MatchSession;
    // Run stored data through the same parser as an incoming write. A session
    // saved before a field existed (NTRP ratings) is filled in with defaults
    // here, so an in-progress bracket keeps working across a deploy.
    return { ...stored, ...parseMatchSessionData(stored) };
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

/** Attempts before giving up on a score write; each retry re-reads the session. */
const SCORE_MAX_ATTEMPTS = 5;

/**
 * Apply one score change on top of whatever is stored right now.
 *
 * Read-modify-write under the same CAS as everything else, retried on
 * contention. The caller sends only the change, so two people tapping
 * different matches both land instead of one overwriting the other.
 *
 * Returns `null` when the match is not in the current bracket.
 */
export const applyScore = async (op: ScoreOp): Promise<MatchSession | null> => {
  for (let attempt = 0; attempt < SCORE_MAX_ATTEMPTS; attempt++) {
    const current = await readSession();

    const known = current.bracket?.matches.some((m) => m.index === op.match);
    if (!known) return null;

    const saved = await writeSession(current.version, {
      guests: current.guests,
      selectedIds: current.selectedIds,
      gamesPerPlayer: current.gamesPerPlayer,
      bracket: current.bracket,
      scores: applyScoreOp(current.scores, op),
    });
    if (saved) return saved;
  }

  // Losing the race five times in a row means something is wrong — say so
  // rather than reporting a score change that never happened.
  throw new Error(
    `점수 반영이 ${SCORE_MAX_ATTEMPTS}회 연속 실패했습니다. 잠시 후 다시 시도해 주세요.`,
  );
};

export const clearSession = async (): Promise<void> => {
  await redisDel(REDIS_KEY);
};
