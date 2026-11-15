import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/auth/session";
import {
  buildAtpRecord,
  createAtpRecord,
  deleteAtpRecord,
} from "@/lib/atp";
import { computeRankings } from "@/lib/match-ranking";
import { readSession, writeSession } from "@/lib/match-session-store";

/**
 * ATP points for the bracket currently in the shared match session.
 *
 * The bracket and scores are read from the server, never from the request —
 * the client only sends the `generatedAt` it is looking at, so a stale screen
 * cannot record (or delete) a different bracket than the one it shows.
 */

const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

const serverError = (e: unknown) => {
  console.error("[atp]", e);
  return error(e instanceof Error ? e.message : "알 수 없는 오류", 500);
};

const STALE_BRACKET =
  "화면의 대진표가 최신이 아닙니다. 새로고침 후 다시 시도해 주세요.";

/** `generatedAt` the client is looking at; null when absent (legacy bracket). */
const readClientGeneratedAt = async (request: Request): Promise<string | null> => {
  try {
    const body = (await request.json()) as { generatedAt?: unknown };
    return typeof body?.generatedAt === "string" ? body.generatedAt : null;
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  if (!(await hasValidSession())) return error("인증이 필요합니다.", 401);
  const clientGeneratedAt = await readClientGeneratedAt(request);

  try {
    const current = await readSession();
    const { bracket, scores } = current;

    if (!bracket || bracket.matches.length === 0) {
      return error("기록할 대진표가 없습니다.", 400);
    }
    if (clientGeneratedAt && clientGeneratedAt !== bracket.generatedAt) {
      return error(STALE_BRACKET, 409);
    }
    if (!bracket.matches.some((m) => scores[m.index])) {
      return error("점수가 입력된 경기가 없어 ATP 점수를 기록할 수 없습니다.", 400);
    }

    // A bracket generated before timestamps existed gets one now, persisted
    // into the session so later create/delete calls hit the same record.
    let generatedAt = bracket.generatedAt;
    if (!generatedAt) {
      generatedAt = new Date().toISOString();
      const saved = await writeSession(current.version, {
        guests: current.guests,
        selectedIds: current.selectedIds,
        gamesPerPlayer: current.gamesPerPlayer,
        bracket: { ...bracket, generatedAt },
        scores,
      });
      if (!saved) {
        return error("다른 분이 동시에 수정했습니다. 다시 시도해 주세요.", 409);
      }
    }

    const record = buildAtpRecord(generatedAt, computeRankings(bracket, scores));
    if (!(await createAtpRecord(record))) {
      return error("이미 ATP 점수가 기록된 대진표입니다. 중복 등록할 수 없습니다.", 409);
    }
    return NextResponse.json(record, { status: 201 });
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(request: Request) {
  if (!(await hasValidSession())) return error("인증이 필요합니다.", 401);
  const clientGeneratedAt = await readClientGeneratedAt(request);

  try {
    const generatedAt = (await readSession()).bracket?.generatedAt;
    if (clientGeneratedAt && clientGeneratedAt !== generatedAt) {
      return error(STALE_BRACKET, 409);
    }
    if (!generatedAt || !(await deleteAtpRecord(generatedAt))) {
      return error("이 대진표로 기록된 ATP 점수가 없습니다.", 404);
    }
    return NextResponse.json({ deleted: generatedAt });
  } catch (e) {
    return serverError(e);
  }
}
