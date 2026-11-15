import type { Member } from "./data/members";
import type { Ranking } from "./match-ranking";
import { redisHdel, redisHgetall, redisHsetnx } from "./redis";

/* ---------- Points ---------- */

/** 1위 250 · 2위 150 · 3위 90 · 그 외 30 */
const PODIUM_POINTS = [250, 150, 90] as const;
const OTHER_POINTS = 30;

export const atpPointsForRank = (rank: number): number =>
  PODIUM_POINTS[rank - 1] ?? OTHER_POINTS;

/* ---------- Records ---------- */

/**
 * One Redis hash holds every record, keyed by the bracket's `generatedAt`.
 * HSETNX / HDEL make "one record per bracket" atomic without a lock.
 * Overridable so a local run can write to a throwaway key.
 */
export const ATP_RECORDS_KEY =
  process.env.ATP_RECORDS_KEY || "tennis-king:atp-records:v1";

export interface AtpEntry {
  memberNo: number;
  /** Name at record time — kept so a member who later leaves still reads correctly. */
  name: string;
  rank: number;
  points: number;
}

export interface AtpRecord {
  bracketGeneratedAt: string;
  /** Season the points count toward (Asia/Seoul year of the bracket). */
  year: number;
  recordedAt: string;
  entries: AtpEntry[];
}

const MEMBER_ID = /^m-(\d+)$/;

const seoulYear = (date: Date): number =>
  Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
    }).format(date),
  );

export const currentSeoulYear = (): number => seoulYear(new Date());

/**
 * Ranks follow the order shown on the final ranking screen. Guests have no
 * stable identity, so they are not recorded — but they still occupy their
 * place, so a member finishing behind a guest gets that lower rank's points.
 */
export const buildAtpRecord = (
  bracketGeneratedAt: string,
  rankings: Ranking[],
): AtpRecord => ({
  bracketGeneratedAt,
  year: seoulYear(new Date(bracketGeneratedAt)),
  recordedAt: new Date().toISOString(),
  entries: rankings.flatMap((r, i) => {
    const match = MEMBER_ID.exec(r.id);
    if (!match) return [];
    const rank = i + 1;
    return [
      { memberNo: Number(match[1]), name: r.name, rank, points: atpPointsForRank(rank) },
    ];
  }),
});

/** Resolves false when this bracket already has a record. */
export const createAtpRecord = async (record: AtpRecord): Promise<boolean> =>
  (await redisHsetnx(
    ATP_RECORDS_KEY,
    record.bracketGeneratedAt,
    JSON.stringify(record),
  )) === 1;

/** Resolves false when there was no record to delete. */
export const deleteAtpRecord = async (
  bracketGeneratedAt: string,
): Promise<boolean> =>
  (await redisHdel(ATP_RECORDS_KEY, bracketGeneratedAt)) === 1;

export const readAtpRecords = async (): Promise<AtpRecord[]> => {
  const stored = await redisHgetall(ATP_RECORDS_KEY);
  const records: AtpRecord[] = [];
  for (const [field, raw] of Object.entries(stored)) {
    try {
      records.push(JSON.parse(raw) as AtpRecord);
    } catch {
      // Skip it but say so — dropping points silently would look like a bug in the totals.
      console.error(`[atp] 기록을 파싱할 수 없어 제외합니다. field=${field}`);
    }
  }
  return records;
};

/* ---------- Standings ---------- */

export interface AtpStanding {
  memberNo: number;
  name: string;
  points: number;
  /** Number of brackets recorded for this member in the year. */
  played: number;
  /** Shared on ties (1, 1, 3). `null` for members with no points yet. */
  rank: number | null;
}

/**
 * Every current member appears (0 points → unranked) so each person can find
 * themselves; former members appear only if they scored that year.
 */
export const yearStandings = (
  records: AtpRecord[],
  year: number,
  roster: Member[],
): AtpStanding[] => {
  const byNo = new Map<number, AtpStanding>();
  for (const m of roster) {
    byNo.set(m.no, { memberNo: m.no, name: m.name, points: 0, played: 0, rank: null });
  }

  for (const record of records) {
    if (record.year !== year) continue;
    for (const e of record.entries) {
      const s = byNo.get(e.memberNo) ?? {
        memberNo: e.memberNo,
        name: e.name,
        points: 0,
        played: 0,
        rank: null,
      };
      s.points += e.points;
      s.played += 1;
      byNo.set(e.memberNo, s);
    }
  }

  const sorted = [...byNo.values()].sort(
    (a, b) => b.points - a.points || a.name.localeCompare(b.name, "ko"),
  );

  let prevPoints = -1;
  let prevRank = 0;
  sorted.forEach((s, i) => {
    if (s.points === 0) return;
    s.rank = s.points === prevPoints ? prevRank : i + 1;
    prevPoints = s.points;
    prevRank = s.rank;
  });
  return sorted;
};

export const yearsWithRecords = (records: AtpRecord[]): number[] =>
  [...new Set(records.map((r) => r.year))].sort((a, b) => b - a);
