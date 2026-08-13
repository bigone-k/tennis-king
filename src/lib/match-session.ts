import {
  DEFAULT_NTRP,
  NTRP_MAX,
  NTRP_MIN,
  type BracketResult,
  type Player,
} from "./match-maker";
import type { Gender } from "./data/members";

export interface MatchScore {
  scoreA: number;
  scoreB: number;
}

/** The part of the shared session that clients are allowed to write. */
export interface MatchSessionData {
  guests: Player[];
  selectedIds: string[];
  gamesPerPlayer: number;
  bracket: BracketResult | null;
  scores: Record<number, MatchScore>;
}

/** Stored shape: writable data plus server-owned concurrency fields. */
export interface MatchSession extends MatchSessionData {
  /** Bumped on every accepted write. Used for optimistic locking. */
  version: number;
  updatedAt: string;
}

export const REDIS_KEY = "tennis-king:match-session:v1";

export const DEFAULT_GAMES_PER_PLAYER = 3;

export const emptySession = (): MatchSession => ({
  version: 0,
  updatedAt: new Date(0).toISOString(),
  guests: [],
  selectedIds: [],
  gamesPerPlayer: DEFAULT_GAMES_PER_PLAYER,
  bracket: null,
  scores: {},
});

/* ---------- Validation ----------
 * Anything reaching the API is untrusted. Reject malformed payloads loudly
 * rather than persisting garbage that would break every client afterwards. */

class InvalidPayloadError extends Error {}

export const isInvalidPayload = (error: unknown): boolean =>
  error instanceof InvalidPayloadError;

const fail = (message: string): never => {
  throw new InvalidPayloadError(message);
};

const isGender = (value: unknown): value is Gender =>
  value === "M" || value === "F";

/**
 * A session stored before NTRP existed has no rating on its guests. Fall back
 * to the default there so an in-progress session survives the deploy; anything
 * present but malformed is still rejected.
 */
const parseNtrpField = (value: unknown, where: string): number => {
  if (value === undefined || value === null) return DEFAULT_NTRP;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    fail(`${where}.ntrp 가 숫자가 아닙니다.`);
  }
  const ntrp = value as number;
  if (ntrp < NTRP_MIN || ntrp > NTRP_MAX) {
    fail(`${where}.ntrp 는 ${NTRP_MIN} ~ ${NTRP_MAX} 범위여야 합니다.`);
  }
  return ntrp;
};

const parsePlayer = (value: unknown, where: string): Player => {
  if (typeof value !== "object" || value === null) fail(`${where}: 객체가 아닙니다.`);
  const p = value as Record<string, unknown>;
  if (typeof p.id !== "string" || !p.id) fail(`${where}.id 가 없습니다.`);
  if (typeof p.name !== "string" || !p.name) fail(`${where}.name 이 없습니다.`);
  if (!isGender(p.gender)) fail(`${where}.gender 가 올바르지 않습니다.`);
  return {
    id: p.id as string,
    name: p.name as string,
    gender: p.gender as Gender,
    ntrp: parseNtrpField(p.ntrp, where),
    ...(p.isGuest === true ? { isGuest: true } : {}),
  };
};

const parseTeamPlayers = (
  value: unknown,
  where: string,
): [Player, Player] => {
  if (!Array.isArray(value) || value.length !== 2) {
    fail(`${where}: 2명이어야 합니다.`);
  }
  const list = value as unknown[];
  return [parsePlayer(list[0], `${where}[0]`), parsePlayer(list[1], `${where}[1]`)];
};

const parseBracket = (value: unknown): BracketResult | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== "object") fail("bracket 이 객체가 아닙니다.");
  const b = value as Record<string, unknown>;
  if (!Array.isArray(b.matches)) fail("bracket.matches 가 배열이 아닙니다.");

  return {
    matches: (b.matches as unknown[]).map((raw, i) => {
      if (typeof raw !== "object" || raw === null) fail(`matches[${i}] 가 객체가 아닙니다.`);
      const m = raw as Record<string, unknown>;
      if (typeof m.index !== "number") fail(`matches[${i}].index 가 없습니다.`);
      const teamA = m.teamA as Record<string, unknown> | undefined;
      const teamB = m.teamB as Record<string, unknown> | undefined;
      return {
        index: m.index as number,
        teamA: { players: parseTeamPlayers(teamA?.players, `matches[${i}].teamA`) },
        teamB: { players: parseTeamPlayers(teamB?.players, `matches[${i}].teamB`) },
      };
    }),
    gamesPerPlayer: typeof b.gamesPerPlayer === "number" ? b.gamesPerPlayer : 0,
    requestedGamesPerPlayer:
      typeof b.requestedGamesPerPlayer === "number" ? b.requestedGamesPerPlayer : 0,
    playerGameCounts:
      typeof b.playerGameCounts === "object" && b.playerGameCounts !== null
        ? (b.playerGameCounts as Record<string, number>)
        : {},
  };
};

const parseScores = (value: unknown): Record<number, MatchScore> => {
  if (value === null || value === undefined) return {};
  if (typeof value !== "object") fail("scores 가 객체가 아닙니다.");

  const result: Record<number, MatchScore> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const index = Number(key);
    if (!Number.isInteger(index)) fail(`scores 키 "${key}" 가 정수가 아닙니다.`);
    if (typeof raw !== "object" || raw === null) fail(`scores[${key}] 가 객체가 아닙니다.`);
    const s = raw as Record<string, unknown>;
    if (typeof s.scoreA !== "number" || typeof s.scoreB !== "number") {
      fail(`scores[${key}] 의 점수가 숫자가 아닙니다.`);
    }
    result[index] = {
      scoreA: Math.max(0, Math.trunc(s.scoreA as number)),
      scoreB: Math.max(0, Math.trunc(s.scoreB as number)),
    };
  }
  return result;
};

/** Throws `InvalidPayloadError` (see `isInvalidPayload`) when the shape is wrong. */
export const parseMatchSessionData = (value: unknown): MatchSessionData => {
  if (typeof value !== "object" || value === null) fail("본문이 객체가 아닙니다.");
  const d = value as Record<string, unknown>;

  if (!Array.isArray(d.guests)) fail("guests 가 배열이 아닙니다.");
  if (!Array.isArray(d.selectedIds)) fail("selectedIds 가 배열이 아닙니다.");
  if (typeof d.gamesPerPlayer !== "number") fail("gamesPerPlayer 가 숫자가 아닙니다.");

  return {
    guests: (d.guests as unknown[]).map((g, i) => parsePlayer(g, `guests[${i}]`)),
    selectedIds: (d.selectedIds as unknown[]).map((id, i) =>
      typeof id === "string" ? id : fail(`selectedIds[${i}] 가 문자열이 아닙니다.`),
    ),
    gamesPerPlayer: Math.min(20, Math.max(1, Math.trunc(d.gamesPerPlayer as number))),
    bracket: parseBracket(d.bracket),
    scores: parseScores(d.scores),
  };
};
