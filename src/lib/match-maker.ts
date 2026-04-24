import type { Gender } from "@/data/members";

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  isGuest?: boolean;
}

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
 * Score a candidate match. Lower is better.
 * Heavy penalty for repeated teammate pairings; small penalty for skipping
 * higher-priority players (those who have played fewer games).
 */
const scoreCandidate = (
  teamA: [Player, Player],
  teamB: [Player, Player],
  indexPenalty: number,
  ctx: PickContext,
): number => {
  const teamateRepeatA = ctx.teammateCount.get(pairKey(teamA[0], teamA[1])) ?? 0;
  const teamateRepeatB = ctx.teammateCount.get(pairKey(teamB[0], teamB[1])) ?? 0;

  // Slight bonus if player was played very recently (encourages rotation)
  let recencyPenalty = 0;
  for (const p of [...teamA, ...teamB]) {
    const last = ctx.recentMatchOfPlayer.get(p.id);
    if (last !== undefined) {
      const gap = ctx.matchIndex - last;
      if (gap === 0) recencyPenalty += 3;
      else if (gap === 1) recencyPenalty += 1;
    }
  }

  return (teamateRepeatA + teamateRepeatB) * 1000 + recencyPenalty * 10 + indexPenalty;
};

const pickMatch = (
  available: Player[],
  ctx: PickContext,
): { teamA: [Player, Player]; teamB: [Player, Player] } | null => {
  const limit = Math.min(available.length, 8);
  let best: { teamA: [Player, Player]; teamB: [Player, Player] } | null = null;
  let bestScore = Infinity;

  for (let i1 = 0; i1 < limit; i1++) {
    for (let i2 = i1 + 1; i2 < limit; i2++) {
      for (let i3 = i2 + 1; i3 < limit; i3++) {
        for (let i4 = i3 + 1; i4 < limit; i4++) {
          const four = [available[i1], available[i2], available[i3], available[i4]];
          const indexPenalty = i1 + i2 + i3 + i4 - 6;

          for (const [teamA, teamB] of teamSplits(four)) {
            if (isFemaleOnly(teamA) || isFemaleOnly(teamB)) continue;
            const score = scoreCandidate(teamA, teamB, indexPenalty, ctx);
            if (score < bestScore) {
              bestScore = score;
              best = { teamA, teamB };
            }
          }
        }
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

    const ordered = prioritizedAvailable(available, playCount);
    const picked = pickMatch(ordered, {
      teammateCount,
      playCount,
      recentMatchOfPlayer,
      matchIndex: mIdx,
    });

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
