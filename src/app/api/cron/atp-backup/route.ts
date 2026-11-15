import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { readAtpRecords } from "@/lib/atp";

/**
 * Weekly ATP backup (Vercel Cron, see vercel.json).
 *
 * Reads every ATP record from Redis and commits it as one JSON file to the
 * GitHub repo's main branch. Git history is the version history, so the file
 * is overwritten in place, and nothing is committed when the content is
 * unchanged — which also makes a duplicate cron delivery harmless.
 *
 * Excluded from proxy.ts: Vercel Cron has no session cookie and does not
 * follow redirects. It authenticates with `Authorization: Bearer CRON_SECRET`.
 *
 * Env:
 *   CRON_SECRET          shared secret Vercel sends with each invocation
 *   GITHUB_BACKUP_TOKEN  fine-grained PAT, this repo only, Contents read/write
 *   GITHUB_BACKUP_REPO   "owner/repo" (defaults to the repo Vercel deployed from)
 *   GITHUB_BACKUP_BRANCH defaults to "main"
 *   GITHUB_BACKUP_PATH   defaults to "backup/atp-records.json"
 */

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com";

const safeEquals = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
};

const isAuthorized = (request: NextRequest): boolean => {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization") ?? "";
  return Boolean(secret) && safeEquals(header, `Bearer ${secret}`);
};

/** Throws with the missing variable's name so a misconfigured deploy fails loudly. */
const config = () => {
  const token = process.env.GITHUB_BACKUP_TOKEN;
  const vercelRepo =
    process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
      ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
      : undefined;
  const repo = process.env.GITHUB_BACKUP_REPO || vercelRepo;
  if (!token) throw new Error("GITHUB_BACKUP_TOKEN 환경변수가 없습니다.");
  if (!repo) throw new Error("GITHUB_BACKUP_REPO 환경변수가 없습니다.");
  return {
    token,
    repo,
    branch: process.env.GITHUB_BACKUP_BRANCH || "main",
    path: process.env.GITHUB_BACKUP_PATH || "backup/atp-records.json",
  };
};

/** Stable output: same records → byte-identical file → no commit. */
const serialize = async (): Promise<{ json: string; count: number }> => {
  const records = (await readAtpRecords()).sort((a, b) =>
    a.bracketGeneratedAt.localeCompare(b.bracketGeneratedAt),
  );
  return {
    json: `${JSON.stringify({ version: 1, records }, null, 2)}\n`,
    count: records.length,
  };
};

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token, repo, branch, path } = config();
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "tennis-king-atp-backup",
    };
    const fileUrl = `${GITHUB_API}/repos/${repo}/contents/${path}`;

    const { json, count } = await serialize();

    // Current file on the branch (404 = first backup).
    const existing = await fetch(`${fileUrl}?ref=${encodeURIComponent(branch)}`, {
      headers,
      cache: "no-store",
    });
    let sha: string | undefined;
    if (existing.ok) {
      const body = (await existing.json()) as { sha: string; content: string };
      sha = body.sha;
      if (Buffer.from(body.content, "base64").toString("utf8") === json) {
        return NextResponse.json({ status: "unchanged", records: count });
      }
    } else if (existing.status !== 404) {
      throw new Error(
        `GitHub 파일 조회 실패 (${existing.status}): ${await existing.text()}`,
      );
    }

    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
      new Date(),
    );
    const put = await fetch(fileUrl, {
      method: "PUT",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `chore: ATP records backup ${today} [skip ci]`,
        content: Buffer.from(json, "utf8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!put.ok) {
      // 409 = another delivery of the same run committed first; the next run reconciles.
      throw new Error(`GitHub 커밋 실패 (${put.status}): ${await put.text()}`);
    }

    const result = (await put.json()) as { commit?: { sha?: string } };
    return NextResponse.json({
      status: sha ? "updated" : "created",
      records: count,
      commit: result.commit?.sha,
    });
  } catch (e) {
    console.error("[atp-backup]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "알 수 없는 오류" },
      { status: 500 },
    );
  }
}
