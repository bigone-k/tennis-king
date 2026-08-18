import type { Gender } from "@/lib/data/members";

/** Selectable NTRP range for guests: 1.0 ~ 3.5 in 0.5 steps. */
export const NTRP_MIN = 1.0;
export const NTRP_MAX = 3.5;
export const NTRP_OPTIONS = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5] as const;

/** Used when a rating is unknown ("?" in the member list) or predates this field. */
export const DEFAULT_NTRP = 2.0;

/** Member ratings are stored as text ("2.5", "?"). Unknown falls back to the default. */
export const parseNtrp = (value: string): number => {
  const n = Number(value);
  return Number.isFinite(n) && n >= NTRP_MIN && n <= NTRP_MAX ? n : DEFAULT_NTRP;
};

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  ntrp: number;
  isGuest?: boolean;
}

export const teamNtrp = (players: readonly Player[]): number =>
  players.reduce((sum, p) => sum + p.ntrp, 0);

export interface Team {
  players: [Player, Player];
}

export interface Match {
  index: number;
  teamA: Team;
  teamB: Team;
}

export interface BracketResult {
  matches: Match[];
  gamesPerPlayer: number;
  requestedGamesPerPlayer: number;
  playerGameCounts: Record<string, number>;
}

interface PickContext {
  teammateCount: Map<string, number>;
  playCount: Map<string, number>;
  recentMatchOfPlayer: Map<string, number>;
  matchIndex: number;
  /**
   * Fewest women this match must include. Banning all-female teams caps a
   * match at 2 women, so leaving too many for later makes the last matches
   * unplayable — this keeps them being used up fast enough.
   */
  minFemales: number;
}

const pairKey = (a: Player, b: Player): string => {
  const [x, y] = [a.id, b.id].sort();
  return `${x}::${y}`;
};

const shuffleInPlace = <T,>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Largest k' ≤ k such that (N * k') % 4 === 0.
 * Doubles matches consume 4 player-slots each, so only these values
 * can produce a bracket where every participant plays the same count.
 */
export const adjustGamesPerPlayer = (
  playerCount: number,
  requestedGames: number,
): number => {
  if (playerCount < 4 || requestedGames < 1) return 0;
  for (let k = requestedGames; k >= 1; k--) {
    if ((playerCount * k) % 4 === 0) return k;
  }
  return 0;
};

/** All 3 ways to split 4 picked players into two doubles teams. */
const teamSplits = (
  four: Player[],
): Array<[[Player, Player], [Player, Player]]> => [
  [
    [four[0], four[1]],
    [four[2], four[3]],
  ],
  [
    [four[0], four[2]],
    [four[1], four[3]],
  ],
  [
    [four[0], four[3]],
    [four[1], four[2]],
  ],
];

const isFemaleOnly = (pair: [Player, Player]): boolean =>
  pair[0].gender === "F" && pair[1].gender === "F";

/**
 * Penalty weights, ordered by priority. A repeated teammate pairing always
 * outranks an NTRP imbalance, and NTRP balance in turn outranks pure rotation.
 * Both NTRP terms are expressed per 1.0 of rating.
 */
const WEIGHT_TEAMMATE_REPEAT = 1000;
/** |team A rating sum − team B rating sum| — the "even teams" goal. */
const WEIGHT_TEAM_GAP = 200;
/** (max − min) across the 4 players — keeps a 3.5 from carrying a 1.0. */
const WEIGHT_MATCH_SPREAD = 20;
const WEIGHT_RECENCY = 10;
/**
 * Per position skipped in the waiting order. Has to be comparable to the NTRP
 * weights: at 1 it was 200× weaker, so the search happily passed over whoever
 * had been waiting to shave 0.5 off a team gap, and the same few players ended
 * up filling the opening matches.
 */
const WEIGHT_INDEX = 40;

/**
 * Score a candidate match. Lower is better.
 * Heavy penalty for repeated teammate pairings; NTRP penalties for uneven
 * teams and wide skill gaps; small penalty for skipping higher-priority
 * players (those who have played fewer games).
 */
const scoreCandidate = (
  teamA: [Player, Player],
  teamB: [Player, Player],
  indexPenalty: number,
  ctx: PickContext,
): number => {
  const teamateRepeatA = ctx.teammateCount.get(pairKey(teamA[0], teamA[1])) ?? 0;
  const teamateRepeatB = ctx.teammateCount.get(pairKey(teamB[0], teamB[1])) ?? 0;

  const four = [...teamA, ...teamB];

  // Equal sums are rarely possible, so this is a cost to minimise, not a filter.
  const teamGap = Math.abs(teamNtrp(teamA) - teamNtrp(teamB));
  const ratings = four.map((p) => p.ntrp);
  const matchSpread = Math.max(...ratings) - Math.min(...ratings);

  // Slight bonus if player was played very recently (encourages rotation)
  let recencyPenalty = 0;
  for (const p of four) {
    const last = ctx.recentMatchOfPlayer.get(p.id);
    if (last !== undefined) {
      const gap = ctx.matchIndex - last;
      if (gap === 0) recencyPenalty += 3;
      else if (gap === 1) recencyPenalty += 1;
    }
  }

  return (
    (teamateRepeatA + teamateRepeatB) * WEIGHT_TEAMMATE_REPEAT +
    teamGap * WEIGHT_TEAM_GAP +
    matchSpread * WEIGHT_MATCH_SPREAD +
    recencyPenalty * WEIGHT_RECENCY +
    indexPenalty * WEIGHT_INDEX
  );
};

/** All ways to choose `k` of the first `poolSize` indices, in ascending order. */
const chooseIndices = (poolSize: number, k: number): number[][] => {
  const out: number[][] = [];
  const current: number[] = [];
  const walk = (start: number) => {
    if (current.length === k) {
      out.push([...current]);
      return;
    }
    for (let i = start; i < poolSize; i++) {
      current.push(i);
      walk(i + 1);
      current.pop();
    }
  };
  walk(0);
  return out;
};

/**
 * Pick the best match from `available`, always including every player in
 * `mustPlay` — those have no spare matches left, so leaving one out would
 * make equal play counts impossible.
 */
const pickMatch = (
  available: Player[],
  mustPlay: Player[],
  ctx: PickContext,
): { teamA: [Player, Player]; teamB: [Player, Player] } | null => {
  const slots = 4 - mustPlay.length;
  if (slots < 0 || available.length < slots) return null;

  const limit = Math.min(available.length, 8);
  // Cheapest choice is the front of the priority order; anything later is a skip.
  const minIndexSum = (slots * (slots - 1)) / 2;

  let best: { teamA: [Player, Player]; teamB: [Player, Player] } | null = null;
  let bestScore = Infinity;

  for (const combo of chooseIndices(limit, slots)) {
    const four = [...mustPlay, ...combo.map((i) => available[i])];
    if (four.filter((p) => p.gender === "F").length < ctx.minFemales) continue;
    const indexPenalty = combo.reduce((sum, i) => sum + i, 0) - minIndexSum;

    for (const [teamA, teamB] of teamSplits(four)) {
      if (isFemaleOnly(teamA) || isFemaleOnly(teamB)) continue;
      const score = scoreCandidate(teamA, teamB, indexPenalty, ctx);
      if (score < bestScore) {
        bestScore = score;
        best = { teamA, teamB };
      }
    }
  }
  return best;
};

/**
 * Order available players by:
 *   1. Ascending play count (players behind go first)
 *   2. Random within the same count bucket
 */
const prioritizedAvailable = (
  players: Player[],
  playCount: Map<string, number>,
): Player[] => {
  const buckets = new Map<number, Player[]>();
  for (const p of players) {
    const c = playCount.get(p.id) ?? 0;
    if (!buckets.has(c)) buckets.set(c, []);
    buckets.get(c)!.push(p);
  }
  const sortedKeys = [...buckets.keys()].sort((a, b) => a - b);
  const ordered: Player[] = [];
  for (const k of sortedKeys) {
    ordered.push(...shuffleInPlace(buckets.get(k)!));
  }
  return ordered;
};

export const generateBracket = (
  players: Player[],
  requestedGamesPerPlayer: number,
): BracketResult => {
  const gamesPerPlayer = adjustGamesPerPlayer(
    players.length,
    requestedGamesPerPlayer,
  );

  if (gamesPerPlayer === 0 || players.length < 4) {
    return {
      matches: [],
      gamesPerPlayer: 0,
      requestedGamesPerPlayer,
      playerGameCounts: Object.fromEntries(players.map((p) => [p.id, 0])),
    };
  }

  const totalMatches = (players.length * gamesPerPlayer) / 4;
  const playCount = new Map<string, number>(players.map((p) => [p.id, 0]));
  const teammateCount = new Map<string, number>();
  const recentMatchOfPlayer = new Map<string, number>();
  const matches: Match[] = [];

  for (let mIdx = 0; mIdx < totalMatches; mIdx++) {
    const available = players.filter(
      (p) => (playCount.get(p.id) ?? 0) < gamesPerPlayer,
    );
    if (available.length < 4) break;

    /*
     * Equal play counts are a hard constraint, not a preference: a player
     * whose remaining games equal the remaining matches has to be in every
     * one of them. Fixing those first keeps the NTRP scoring below from
     * balancing a match at the cost of someone's game count.
     */
    const remainingMatches = totalMatches - mIdx;
    const mustPlay: Player[] = [];
    const optional: Player[] = [];
    for (const p of available) {
      const left = gamesPerPlayer - (playCount.get(p.id) ?? 0);
      if (left >= remainingMatches) mustPlay.push(p);
      else optional.push(p);
    }
    // Remaining slots always total 4 × remainingMatches, so this cannot exceed 4.
    if (mustPlay.length > 4) break;

    const femaleSlotsLeft = available.reduce(
      (sum, p) =>
        p.gender === "F" ? sum + gamesPerPlayer - (playCount.get(p.id) ?? 0) : sum,
      0,
    );

    /*
     * Upper bound, mirroring the `mustPlay` lower bound. After m matches
     * 4 × m slots have been handed out, so nobody should be further ahead
     * than their share of them. Without this the play counts still even out
     * by the end, but only because whoever ran ahead early sits out the rest
     * — which reads as "the same people keep playing the opening matches".
     */
    const cap = Math.ceil((4 * (mIdx + 1)) / players.length);
    const withinCap = optional.filter((p) => (playCount.get(p.id) ?? 0) < cap);

    const ctx = {
      teammateCount,
      playCount,
      recentMatchOfPlayer,
      matchIndex: mIdx,
      minFemales: Math.max(0, femaleSlotsLeft - 2 * (remainingMatches - 1)),
    };

    // The cap is a preference, not a rule: narrowing the pool can leave no
    // legal match at all (the female-pairing rule still has to hold), so fall
    // back to the full pool rather than cutting the bracket short.
    const picked =
      pickMatch(prioritizedAvailable(withinCap, playCount), mustPlay, ctx) ??
      pickMatch(prioritizedAvailable(optional, playCount), mustPlay, ctx);

    if (!picked) break;

    matches.push({
      index: mIdx + 1,
      teamA: { players: picked.teamA },
      teamB: { players: picked.teamB },
    });

    for (const p of [...picked.teamA, ...picked.teamB]) {
      playCount.set(p.id, (playCount.get(p.id) ?? 0) + 1);
      recentMatchOfPlayer.set(p.id, mIdx);
    }
    const kA = pairKey(picked.teamA[0], picked.teamA[1]);
    const kB = pairKey(picked.teamB[0], picked.teamB[1]);
    teammateCount.set(kA, (teammateCount.get(kA) ?? 0) + 1);
    teammateCount.set(kB, (teammateCount.get(kB) ?? 0) + 1);
  }

  return {
    matches,
    gamesPerPlayer,
    requestedGamesPerPlayer,
    playerGameCounts: Object.fromEntries(playCount),
  };
};
