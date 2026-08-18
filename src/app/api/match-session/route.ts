import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth/session";
import { members } from "@/lib/data/members";
import { generateBracket, parseNtrp, type Player } from "@/lib/match-maker";
import {
  emptySession,
  isInvalidPayload,
  parseMatchSessionData,
  parseScoreOp,
  type MatchSessionData,
} from "@/lib/match-session";
import {
  applyScore,
  clearSession,
  readSession,
  writeSession,
} from "@/lib/match-session-store";

/**
 * Shared match state for /tools/match-maker — one live session that every
 * visitor reads and writes.
 *
 * `proxy.ts` already blocks unauthenticated requests, but it is an optimistic
 * pre-filter only: every handler re-checks the session here, at the data.
 */

const unauthorized = () =>
  NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

const conflict = async () =>
  NextResponse.json(
    { error: "다른 분이 먼저 수정했습니다.", session: await readSession() },
    { status: 409 },
  );

const serverError = (error: unknown) => {
  console.error("[match-session]", error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "알 수 없는 오류" },
    { status: 500 },
  );
};

const readVersion = (body: unknown): number => {
  const version = (body as { version?: unknown })?.version;
  if (typeof version !== "number" || !Number.isInteger(version) || version < 0) {
    throw new SyntaxError("version 이 올바르지 않습니다.");
  }
  return version;
};

export async function GET() {
  if (!(await hasValidSession())) return unauthorized();
  try {
    return NextResponse.json(await readSession());
  } catch (error) {
    return serverError(error);
  }
}

/**
 * Save client-side edits (selection, guests, games per player).
 *
 * Scores are deliberately NOT taken from this payload — they belong to PATCH.
 * A whole-session write carries a snapshot of the scores taken before the
 * request left the browser, so honouring it here would silently roll back a
 * score somebody else entered in the meantime.
 */
export async function PUT(request: Request) {
  if (!(await hasValidSession())) return unauthorized();

  let expectedVersion: number;
  let data: MatchSessionData;
  try {
    const body = await request.json();
    expectedVersion = readVersion(body);
    data = parseMatchSessionData((body as { state?: unknown }).state);
  } catch (error) {
    if (isInvalidPayload(error) || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: `요청 본문이 올바르지 않습니다: ${(error as Error).message}` },
        { status: 400 },
      );
    }
    return serverError(error);
  }

  try {
    const current = await readSession();
    if (current.version !== expectedVersion) return await conflict();

    const saved = await writeSession(expectedVersion, {
      ...data,
      scores: current.scores,
    });
    return saved ? NextResponse.json(saved) : await conflict();
  } catch (error) {
    return serverError(error);
  }
}

/** Apply a single score change (+1 / −1 / reset) without touching anything else. */
export async function PATCH(request: Request) {
  if (!(await hasValidSession())) return unauthorized();

  let op;
  try {
    op = parseScoreOp(await request.json());
  } catch (error) {
    if (isInvalidPayload(error) || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: `요청 본문이 올바르지 않습니다: ${(error as Error).message}` },
        { status: 400 },
      );
    }
    return serverError(error);
  }

  try {
    const saved = await applyScore(op);
    return saved
      ? NextResponse.json(saved)
      : NextResponse.json(
          { error: `${op.match}경기를 찾을 수 없습니다.` },
          { status: 400 },
        );
  } catch (error) {
    return serverError(error);
  }
}

/**
 * Generate the bracket server-side. Doing this on each client would hand
 * everyone a different random draw.
 */
export async function POST(request: Request) {
  if (!(await hasValidSession())) return unauthorized();

  let expectedVersion: number;
  try {
    expectedVersion = readVersion(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: `요청 본문이 올바르지 않습니다: ${(error as Error).message}` },
      { status: 400 },
    );
  }

  try {
    const current = await readSession();
    if (current.version !== expectedVersion) return await conflict();

    const pool: Player[] = [
      ...members.map((m) => ({
        id: `m-${m.no}`,
        name: m.name,
        gender: m.gender,
        ntrp: parseNtrp(m.ntrp),
      })),
      ...current.guests,
    ];
    const selected = pool.filter((p) => current.selectedIds.includes(p.id));

    if (selected.length < 4) {
      return NextResponse.json(
        { error: "최소 4명 이상의 참가자를 선택하세요." },
        { status: 400 },
      );
    }

    const bracket = generateBracket(selected, current.gamesPerPlayer);
    const saved = await writeSession(expectedVersion, {
      guests: current.guests,
      selectedIds: current.selectedIds,
      gamesPerPlayer: current.gamesPerPlayer,
      bracket,
      scores: {},
    });

    return saved ? NextResponse.json(saved) : await conflict();
  } catch (error) {
    return serverError(error);
  }
}

/** Reset for everyone. */
export async function DELETE() {
  if (!(await hasValidSession())) return unauthorized();
  try {
    await clearSession();
    return NextResponse.json(emptySession());
  } catch (error) {
    return serverError(error);
  }
}
