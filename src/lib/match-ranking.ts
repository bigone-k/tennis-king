import type { BracketResult, Player } from "./match-maker";
import type { MatchScore } from "./match-session";

export type Winner = "A" | "B" | null;

export const getWinner = (s?: MatchScore): Winner => {
  if (!s) return null;
  if (s.scoreA > s.scoreB) return "A";
  if (s.scoreB > s.scoreA) return "B";
  return null;
};

export interface Ranking {
  /** Player id: `m-{no}` for members, `g-{uuid}` for guests. */
  id: string;
  name: string;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

/**
 * Final standings for a bracket. Shared by the ranking screen and the ATP
 * record API so the points awarded always match the order people saw.
 */
export const computeRankings = (
  bracket: BracketResult,
  scores: Record<number, MatchScore>,
): Ranking[] => {
  const tallies: Record<string, Ranking> = {};
  const init = (p: Player) => {
    tallies[p.id] ??= {
      id: p.id,
      name: p.name,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
  };

  for (const m of bracket.matches) {
    for (const p of m.teamA.players) init(p);
    for (const p of m.teamB.players) init(p);

    const s = scores[m.index];
    if (!s) continue;

    for (const p of m.teamA.players) {
      tallies[p.id].pointsFor += s.scoreA;
      tallies[p.id].pointsAgainst += s.scoreB;
    }
    for (const p of m.teamB.players) {
      tallies[p.id].pointsFor += s.scoreB;
      tallies[p.id].pointsAgainst += s.scoreA;
    }

    const w = getWinner(s);
    if (!w) continue;
    const winTeam = w === "A" ? m.teamA.players : m.teamB.players;
    const loseTeam = w === "A" ? m.teamB.players : m.teamA.players;
    for (const p of winTeam) tallies[p.id].wins += 1;
    for (const p of loseTeam) tallies[p.id].losses += 1;
  }

  return Object.values(tallies).sort((a, b) => {
    // 1) 득실차 높은 순
    const pdA = a.pointsFor - a.pointsAgainst;
    const pdB = b.pointsFor - b.pointsAgainst;
    if (pdB !== pdA) return pdB - pdA;
    // 2) 승-패 차이 높은 순
    const wdA = a.wins - a.losses;
    const wdB = b.wins - b.losses;
    if (wdB !== wdA) return wdB - wdA;
    // 3) 득점+실점 큰 순
    return (
      b.pointsFor + b.pointsAgainst - (a.pointsFor + a.pointsAgainst)
    );
  });
};
